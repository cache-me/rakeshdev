import type { AiChatEducationCertificate, AiChatPersonalDocument, AiChatResponse } from '@portfolio/types'
import {
  detectEducationCertificateFilters,
  detectRequestedPersonalDocTypes,
  isEducationCertificateChatRequest,
  type EducationQualFilter,
} from '@portfolio/validation'

import { env } from '../lib/env.js'

import {
  buildGroundedFacts,
  detectIntent,
  extractPersonalDocumentToken,
  isPersonalDocumentsQuestion,
  isPersonalDocumentsFollowUp,
  PERSONAL_DOCUMENTS_ASK_MESSAGE,
  validateNavigation,
} from './intent.service.js'
import { listDocumentsForToken } from './personal-document.service.js'
import {
  getPortfolioContext,
  getProjectBySlug,
  listEducation,
  listProjects,
  searchPortfolio,
} from './portfolio.service.js'

const FALLBACK =
  "I don't have that information in the portfolio."

export class AIService {
  async answerQuestion(
    message: string,
    opts?: { personalDocumentToken?: string; personalDocumentContext?: string },
  ): Promise<AiChatResponse> {
    const intent = detectIntent(message)
    const tokenInMessage = extractPersonalDocumentToken(message)
    const sessionToken = opts?.personalDocumentToken
    const personalDocFollowUp = isPersonalDocumentsFollowUp(message)
    const personalDocTopic =
      Boolean(tokenInMessage) ||
      intent === 'VIEW_PERSONAL_DOCUMENTS' ||
      isPersonalDocumentsQuestion(message) ||
      (Boolean(sessionToken) && personalDocFollowUp)

    const accessToken =
      tokenInMessage ?? (personalDocTopic && sessionToken ? sessionToken : null)

    if (personalDocTopic) {
      return this.answerPersonalDocuments(
        message,
        accessToken,
        intent,
        opts?.personalDocumentContext,
      )
    }

    if (isEducationCertificateChatRequest(message)) {
      return this.answerEducationCertificates(message, intent)
    }

    const context = await getPortfolioContext()
    const facts = buildGroundedFacts(context)

    let messageText = await this.generateWithProvider(message, facts, intent)

    if (intent === 'SEARCH_PROJECTS' && /react/i.test(message)) {
      const projects = await listProjects()
      const reactProjects = projects.filter((p) =>
        p.technologies.some((t) => t.toLowerCase().includes('react')),
      )
      if (reactProjects.length === 0) {
        messageText = FALLBACK
      } else {
        messageText = `Here are React-related projects: ${reactProjects.map((p) => p.title).join(', ')}.`
      }
    }

    if (intent === 'VIEW_PROJECT') {
      const slug = message.match(/immersive|analytics|3d|dashboard/i)
      let project = null
      if (slug) {
        const projects = await listProjects()
        project =
          projects.find((p) => /immersive|3d/i.test(p.title) && /3d|immersive/i.test(message)) ??
          projects.find((p) => /analytics|dashboard/i.test(p.title) && /analytics|dashboard/i.test(message)) ??
          null
      }
      if (!project) {
        const search = await searchPortfolio(message, 'projects')
        if (search[0]?.slug) {
          project = await getProjectBySlug(search[0].slug)
        }
      }
      if (project) {
        messageText = `${project.title}: ${project.summary}`
      } else if (!messageText.includes(FALLBACK)) {
        messageText = FALLBACK
      }
    }

    const navigation = await validateNavigation(intent, message)

    if (!messageText.trim()) {
      messageText = FALLBACK
    }

    return {
      message: messageText,
      intent,
      navigation,
    }
  }

  private async answerPersonalDocuments(
    message: string,
    accessToken: string | null,
    intent: AiChatResponse['intent'],
    personalDocumentContext?: string,
  ): Promise<AiChatResponse> {
    const resolvedIntent: AiChatResponse['intent'] =
      intent === 'VIEW_PERSONAL_DOCUMENTS' ? intent : 'VIEW_PERSONAL_DOCUMENTS'

    if (accessToken) {
      const result = await listDocumentsForToken(accessToken)
      if (!result.ok) {
        return {
          message: `${result.message} Paste a fresh token from the portfolio owner (valid 30–60 minutes).`,
          intent: resolvedIntent,
        }
      }

      const requested = detectRequestedPersonalDocTypes(message, personalDocumentContext)

      const toShow =
        requested === 'all'
          ? result.data
          : result.data.filter((d) =>
              requested.includes(d.docType as (typeof requested)[number]),
            )

      if (toShow.length === 0) {
        return {
          message:
            'Token is valid, but none of the requested document types are available. Try asking for Aadhaar, PAN, or bank passbook specifically.',
          intent: resolvedIntent,
        }
      }

      const docs: AiChatPersonalDocument[] = toShow.map((d) => ({
        id: d.id,
        docType: d.docType as AiChatPersonalDocument['docType'],
        title: d.title,
        imageUrl: `/api/personal-documents/file?token=${encodeURIComponent(accessToken)}&documentId=${encodeURIComponent(d.id)}`,
      }))

      const shownTitles = docs.map((d) => d.title).join(', ')
      const scope =
        requested === 'all'
          ? `Showing all private documents: ${shownTitles}.`
          : `Showing requested document(s): ${shownTitles}.`

      return {
        message: `Token verified. ${scope} Scans are displayed below in this chat until your token expires.`,
        intent: resolvedIntent,
        personalDocuments: docs,
      }
    }

    return {
      message: PERSONAL_DOCUMENTS_ASK_MESSAGE,
      intent: resolvedIntent,
    }
  }

  private async answerEducationCertificates(
    message: string,
    intent: AiChatResponse['intent'],
  ): Promise<AiChatResponse> {
    const resolvedIntent: AiChatResponse['intent'] =
      intent === 'VIEW_EDUCATION' ? intent : 'VIEW_EDUCATION'

    const filters = detectEducationCertificateFilters(message)
    const rows = await listEducation()

    const matches = rows.filter((row) => {
      if (filters.includes('all' as EducationQualFilter)) return true
      return filters.includes(row.qualificationType as EducationQualFilter)
    })

    if (matches.length === 0) {
      return {
        message:
          'No matching qualification records were found. Try matric, intermediate (+2), graduation (BSc), post graduation (MSc), or Masai professional certificate.',
        intent: resolvedIntent,
      }
    }

    const educationCertificates: AiChatEducationCertificate[] = matches.map((row) => ({
      id: row.id,
      qualificationType: row.qualificationType as AiChatEducationCertificate['qualificationType'],
      degree: row.degree,
      institution: row.institution,
      resultSummary: row.resultSummary,
      imageUrl: row.certificateUrl,
    }))

    const withScan = educationCertificates.filter((c) => c.imageUrl)
    const withoutScan = educationCertificates.filter((c) => !c.imageUrl)

    const lines = educationCertificates.map(
      (c) =>
        `${c.degree} (${c.institution})${c.resultSummary ? ` — ${c.resultSummary}` : ''}${
          c.imageUrl ? '' : ' — scan not uploaded yet'
        }`,
    )

    let messageText = `Here ${educationCertificates.length === 1 ? 'is' : 'are'} the requested qualification record(s):\n${lines.join('\n')}`
    if (withScan.length) {
      messageText += `\n\nCertificate scans are shown below in this chat.`
    }
    if (withoutScan.length && withScan.length) {
      messageText += ` Some entries have result details only (no scan on file).`
    }

    return {
      message: messageText,
      intent: resolvedIntent,
      educationCertificates,
    }
  }

  private systemPrompt(intent: string): string {
    if (intent === 'VIEW_PERSONAL_DOCUMENTS') {
      return `You help visitors access PRIVATE identity documents (Aadhaar, PAN, bank passbook). They are NOT in the JSON facts. Never say you lack portfolio data for this — explain that a time-limited token is required. If the user has no token, tell them to paste it in chat or use the secure viewer. Never invent or describe document numbers or images.`
    }
    return `You are a portfolio assistant. Answer ONLY using the JSON facts below. If information is missing, reply exactly: "${FALLBACK}" Never invent personal details. Keep answers concise (2-4 sentences). Intent: ${intent}`
  }

  private userPrompt(message: string, facts: string): string {
    return `Facts:\n${facts}\n\nQuestion: ${message}`
  }

  private async generateWithProvider(
    message: string,
    facts: string,
    intent: string,
  ): Promise<string> {
    if (!env.AI_API_KEY) {
      return this.ruleBasedResponse(message, facts, intent)
    }

    try {
      if (env.AI_PROVIDER === 'anthropic') {
        return await this.generateAnthropic(message, facts, intent)
      }
      return await this.generateOpenAi(message, facts, intent)
    } catch {
      return this.ruleBasedResponse(message, facts, intent)
    }
  }

  private async generateAnthropic(
    message: string,
    facts: string,
    intent: string,
  ): Promise<string> {
    const baseUrl = env.AI_BASE_URL ?? 'https://api.anthropic.com/v1'
    const res = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': env.AI_API_KEY!,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        max_tokens: 1024,
        system: this.systemPrompt(intent),
        messages: [{ role: 'user', content: this.userPrompt(message, facts) }],
        temperature: 0.2,
      }),
    })
    if (!res.ok) {
      return this.ruleBasedResponse(message, facts, intent)
    }
    const json = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>
    }
    const text = json.content?.find((block) => block.type === 'text')?.text?.trim()
    return text ?? this.ruleBasedResponse(message, facts, intent)
  }

  private async generateOpenAi(
    message: string,
    facts: string,
    intent: string,
  ): Promise<string> {
    const baseUrl = env.AI_BASE_URL ?? 'https://api.openai.com/v1'
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        messages: [
          { role: 'system', content: this.systemPrompt(intent) },
          { role: 'user', content: this.userPrompt(message, facts) },
        ],
        temperature: 0.2,
      }),
    })
    if (!res.ok) {
      return this.ruleBasedResponse(message, facts, intent)
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    return json.choices?.[0]?.message?.content?.trim() ?? this.ruleBasedResponse(message, facts, intent)
  }

  private ruleBasedResponse(message: string, facts: string, intent: string): string {
    const data = JSON.parse(facts) as {
      person?: { name?: string; title?: string; bio?: string }
    }
    const q = message.toLowerCase()

    if (/who (is|are)|who are you/i.test(q) && data.person?.name) {
      return `${data.person.name} is ${data.person.title}. ${data.person.bio}`
    }
    if (intent === 'VIEW_SKILLS' || /technologies|skills/i.test(q)) {
      const parsed = JSON.parse(facts) as { skills?: Array<{ name: string }> }
      const names = parsed.skills?.map((s) => s.name).join(', ')
      return names ? `Main skills include ${names}.` : FALLBACK
    }
    if (intent === 'VIEW_EXPERIENCE' || /work history|where (did|does).*work|job at/i.test(q)) {
      const parsed = JSON.parse(facts) as {
        experience?: Array<{ role: string; company: string; current?: boolean }>
      }
      const jobs = parsed.experience
      if (jobs?.length) {
        const summary = jobs
          .map((e) => `${e.role} at ${e.company}${e.current ? ' (current)' : ''}`)
          .join('; ')
        return `Work history: ${summary}. See the experience page for full details.`
      }
      return 'You can review detailed work history on the experience page.'
    }
    if (
      intent === 'VIEW_EDUCATION' ||
      /education|degree|university|certification|educat|matric|bsc|msc|masai/i.test(q)
    ) {
      const parsed = JSON.parse(facts) as {
        education?: Array<{ degree: string; institution: string; endDate?: string | null }>
        certifications?: Array<{ title: string; institution: string; year?: string | null }>
      }
      const parts: string[] = []
      if (parsed.education?.length) {
        parts.push(
          parsed.education
            .map(
              (ed) =>
                `${ed.degree} from ${ed.institution}${ed.endDate ? ` (${ed.endDate})` : ''}`,
            )
            .join('; '),
        )
      }
      if (parsed.certifications?.length) {
        parts.push(
          `Certifications: ${parsed.certifications
            .map((c) => `${c.title} — ${c.institution}${c.year ? ` (${c.year})` : ''}`)
            .join('; ')}`,
        )
      }
      return parts.length
        ? `${parts.join(' ')} Open the education page for full marks and certificates.`
        : 'Education details are on the education page.'
    }
    if (intent === 'VIEW_PROJECTS') {
      return 'Sure — here are the featured projects in the portfolio.'
    }
    if (intent === 'VIEW_CONTACT') {
      return 'You can reach out via the contact page or the email listed in the portfolio.'
    }
    if (intent === 'VIEW_RESUME') {
      return 'You can open the resume page to view or download the CV.'
    }
    if (intent === 'VIEW_PERSONAL_DOCUMENTS') {
      return PERSONAL_DOCUMENTS_ASK_MESSAGE
    }

    return FALLBACK
  }
}

export const aiService = new AIService()
