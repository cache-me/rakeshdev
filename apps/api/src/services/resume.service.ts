import { renderResumeHtml, type ResumeDocument } from '@portfolio/resume'
import type { ResumeTemplateId } from '@portfolio/validation'

import { env } from '../lib/env.js'
import {
  getSiteSettings,
  listEducation,
  listExperience,
  listSkills,
} from './portfolio.service.js'

function publicOrigin(): string {
  return env.BETTER_AUTH_URL.replace(/\/$/, '')
}

function resolveProfileImage(url: string | null | undefined, origin: string): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`
}

function parseHobbies(raw: string | undefined): string[] {
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string')
      }
    } catch {
      /* fall through */
    }
  }
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function buildResumeDocument(): Promise<ResumeDocument | null> {
  const settings = await getSiteSettings()
  if (!settings) return null

  const origin = publicOrigin()
  const links = settings.socialLinks
  const [allSkills, experience, educationRows] = await Promise.all([
    listSkills(),
    listExperience(),
    listEducation(),
  ])

  const languages = allSkills
    .filter((s) => s.category.toLowerCase() === 'language')
    .map((s) => ({ name: s.name, proficiency: s.proficiency }))

  const personalSkills = allSkills
    .filter((s) => s.category.toLowerCase().startsWith('personal'))
    .map((s) => ({ name: s.name, proficiency: s.proficiency }))

  const skills = allSkills.filter(
    (s) =>
      s.category.toLowerCase() !== 'language' &&
      !s.category.toLowerCase().startsWith('personal'),
  )

  const education = educationRows.filter((ed) => ed.qualificationType !== 'professional')
  const certifications = educationRows
    .filter((ed) => ed.qualificationType === 'professional')
    .map((ed) => ({
      title: ed.degree,
      year: ed.endDate ?? ed.startDate,
      institution: ed.institution,
    }))

  const moreInfo =
    links.gender || links.dateOfBirth || links.nationality
      ? {
          gender: links.gender,
          dateOfBirth: links.dateOfBirth,
          nationality: links.nationality,
        }
      : null

  return {
    name: settings.name,
    title: settings.title,
    summary: settings.bio,
    email: settings.email,
    phone: links.phone ?? null,
    website: links.website ?? null,
    linkedIn: links.linkedin ?? links.linkedIn ?? null,
    location: settings.location,
    profileImageUrl: resolveProfileImage(settings.profileImageUrl, origin),
    hobbies: parseHobbies(links.hobbies),
    moreInfo,
    skills: skills.map((s) => ({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
    })),
    languages,
    personalSkills,
    certifications,
    experience: experience.map((e) => ({
      role: e.role,
      company: e.company,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      description: e.description,
    })),
    education: education.map((ed) => ({
      institution: ed.institution,
      degree: ed.degree,
      startDate: ed.startDate,
      endDate: ed.endDate,
      description: ed.description,
    })),
    generatedAt: new Date().toISOString(),
  }
}

export function renderResumePreviewHtml(
  doc: ResumeDocument,
  templateId: ResumeTemplateId,
): string {
  return renderResumeHtml(doc, templateId)
}

export async function renderResumePdf(
  doc: ResumeDocument,
  templateId: ResumeTemplateId,
): Promise<Buffer> {
  const html = renderResumeHtml(doc, templateId)
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
