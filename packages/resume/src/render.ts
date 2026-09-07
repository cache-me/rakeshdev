import type { ResumeTemplateId } from '@portfolio/validation'

import {
  descriptionBullets,
  escapeHtml,
  formatExperienceRange,
  formatMonthYear,
  proficiencyLabel,
  proficiencyPercent,
} from './format.js'
import type { ResumeDocument } from './types.js'

type Theme = {
  accent: string
  font: string
  headingFont: string
}

const THEMES: Record<ResumeTemplateId, Theme> = {
  'navy-orange-pro': {
    accent: '#d97706',
    font: 'Helvetica, Arial, sans-serif',
    headingFont: 'Georgia, "Times New Roman", serif',
  },
  'white-classic': { accent: '#111827', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'white-serif': { accent: '#1f2937', font: 'Georgia, "Times New Roman", serif', headingFont: 'Georgia, "Times New Roman", serif' },
  'white-minimal': { accent: '#374151', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'teal-center': { accent: '#0f766e', font: 'Helvetica, Arial, sans-serif', headingFont: 'Georgia, serif' },
  'maroon-center': { accent: '#7f1d1d', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'blue-margin': { accent: '#2563eb', font: 'Helvetica, Arial, sans-serif', headingFont: 'Georgia, serif' },
  'slate-columns': { accent: '#475569', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'gray-sidebar': { accent: '#64748b', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'mauve-banner': { accent: '#9d8189', font: 'Helvetica, Arial, sans-serif', headingFont: 'Georgia, serif' },
  'yellow-sidebar': { accent: '#ca8a04', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'teal-sidebar': { accent: '#0d9488', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
  'teal-photo': { accent: '#0891b2', font: 'Helvetica, Arial, sans-serif', headingFont: 'Helvetica, Arial, sans-serif' },
}

function contactLine(doc: ResumeDocument): string {
  const parts = [
    doc.location,
    doc.email,
    doc.title,
  ].filter(Boolean)
  return parts.map((p) => escapeHtml(p!)).join(' · ')
}

function skillsHtml(doc: ResumeDocument, columns = 2): string {
  const items = doc.skills.map((s) => `<li>${escapeHtml(s.name)}</li>`).join('')
  if (columns === 1) return `<ul class="skills">${items}</ul>`
  const mid = Math.ceil(doc.skills.length / 2)
  const left = doc.skills.slice(0, mid)
  const right = doc.skills.slice(mid)
  return `<div class="skills-cols"><ul class="skills">${left.map((s) => `<li>${escapeHtml(s.name)}</li>`).join('')}</ul><ul class="skills">${right.map((s) => `<li>${escapeHtml(s.name)}</li>`).join('')}</ul></div>`
}

function experienceHtml(doc: ResumeDocument): string {
  return doc.experience
    .map((job) => {
      const bullets = descriptionBullets(job.description)
        .map((b) => `<li>${escapeHtml(b)}</li>`)
        .join('')
      const range = formatExperienceRange(job.startDate, job.endDate, job.current)
      const loc = job.location ? ` · ${escapeHtml(job.location)}` : ''
      return `<article class="job">
        <div class="job-head">
          <strong>${escapeHtml(job.role)}</strong>
          <span class="job-date">${escapeHtml(range)}</span>
        </div>
        <div class="job-sub">${escapeHtml(job.company)}${loc}</div>
        <ul class="bullets">${bullets}</ul>
      </article>`
    })
    .join('')
}

function educationHtml(doc: ResumeDocument): string {
  return doc.education
    .map((ed) => {
      const years = [ed.startDate, ed.endDate].filter(Boolean).map((d) => formatMonthYear(d)).join(' — ')
      return `<article class="edu">
        <strong>${escapeHtml(ed.degree)}</strong>
        <div>${escapeHtml(ed.institution)}${years ? ` · ${escapeHtml(years)}` : ''}</div>
        ${ed.description ? `<p>${escapeHtml(ed.description)}</p>` : ''}
      </article>`
    })
    .join('')
}

function topSkillsBars(doc: ResumeDocument, accent: string): string {
  const top = doc.skills.slice(0, 6)
  return top
    .map((s) => {
      const pct = proficiencyPercent(s.proficiency)
      return `<div class="skill-bar">
        <div class="skill-bar-label"><span>${escapeHtml(s.name)}</span><span>${escapeHtml(proficiencyLabel(s.proficiency))}</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${pct}%;background:${accent}"></div></div>
      </div>`
    })
    .join('')
}

function photoBlock(doc: ResumeDocument): string {
  if (!doc.profileImageUrl) {
    return `<div class="photo placeholder"></div>`
  }
  return `<img class="photo" src="${escapeHtml(doc.profileImageUrl)}" alt="" />`
}

function baseCss(theme: Theme): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${theme.font}; color: #111; background: #fff; font-size: 10.5pt; line-height: 1.45; }
    h1, h2, h3 { font-family: ${theme.headingFont}; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 16mm; }
    .accent { color: ${theme.accent}; }
    .section { margin-top: 14px; }
    .section-title { font-size: 11pt; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${theme.accent}; margin-bottom: 6px; }
    .bullets { margin: 6px 0 0 18px; }
    .bullets li { margin-bottom: 3px; }
    .skills { margin-left: 18px; }
    .skills li { margin-bottom: 2px; }
    .skills-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
    .job { margin-bottom: 10px; }
    .job-head { display: flex; justify-content: space-between; gap: 12px; font-size: 10.5pt; }
    .job-date { font-weight: 600; white-space: nowrap; }
    .job-sub { font-weight: 600; margin-top: 2px; color: #374151; }
    .edu { margin-bottom: 8px; }
    .photo { width: 88px; height: 88px; object-fit: cover; border-radius: 4px; }
    .photo.placeholder { background: #e5e7eb; }
    .skill-bar { margin-bottom: 8px; }
    .skill-bar-label { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 3px; }
    .skill-bar-track { height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
    .skill-bar-fill { height: 100%; border-radius: 999px; }
    .muted { color: #6b7280; }
  `
}

function wrapDocument(title: string, theme: Theme, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>${baseCss(theme)}</style>
</head>
<body>${body}</body>
</html>`
}

function renderWhiteClassic(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page">
    <header style="margin-bottom:12px">
      <h1 style="font-size:22pt;font-weight:700">${escapeHtml(doc.name)}</h1>
      <p class="muted" style="margin-top:4px">${contactLine(doc)}</p>
    </header>
    <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
    <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc)}</section>
    <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
    <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderWhiteSerif(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page">
    <header style="border-bottom:1px solid #d1d5db;padding-bottom:10px;margin-bottom:12px">
      <h1 style="font-size:24pt;font-weight:700">${escapeHtml(doc.name)}</h1>
      <p style="margin-top:6px">${contactLine(doc)}</p>
    </header>
    <section class="section"><h2 class="section-title" style="color:#111">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
    <section class="section"><h2 class="section-title" style="color:#111">Skills</h2>${skillsHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="color:#111">Experience</h2>${experienceHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="color:#111">Education</h2>${educationHtml(doc)}</section>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderWhiteMinimal(doc: ResumeDocument, theme: Theme): string {
  const contact = [doc.email, doc.location].filter(Boolean).map((c) => escapeHtml(c!)).join(' | ')
  const body = `<div class="page">
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:14px">
      <div><h1 style="font-size:20pt">${escapeHtml(doc.name)}</h1><p class="muted" style="margin-top:4px">${escapeHtml(doc.title)}</p></div>
      <div style="text-align:right;font-size:9.5pt" class="muted">${contact}</div>
    </header>
    <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
    <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc, 1)}</section>
    <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
    <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderTealCenter(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page">
    <header style="text-align:center;margin-bottom:14px">
      <h1 style="font-size:22pt;color:${theme.accent}">${escapeHtml(doc.name.toUpperCase())}</h1>
      <p class="muted" style="margin-top:6px">${contactLine(doc)}</p>
      <hr style="border:none;border-top:1px solid #d1d5db;margin-top:10px" />
    </header>
    <section class="section"><h2 class="section-title" style="text-align:center">Summary</h2><p style="text-align:justify">${escapeHtml(doc.summary)}</p></section>
    <section class="section"><h2 class="section-title" style="text-align:center">Skills</h2>${skillsHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="text-align:center">Experience</h2>${experienceHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="text-align:center">Education</h2>${educationHtml(doc)}</section>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderMaroonCenter(doc: ResumeDocument, theme: Theme): string {
  const parts = doc.name.trim().split(/\s+/)
  const first = parts[0] ?? doc.name
  const last = parts.slice(1).join(' ') || first
  const body = `<div class="page">
    <header style="text-align:center;margin-bottom:12px">
      <h1 style="font-size:21pt"><span>${escapeHtml(first)}</span> <span style="color:${theme.accent};font-weight:800">${escapeHtml(last.toUpperCase())}</span></h1>
      <p class="muted" style="margin-top:6px">${contactLine(doc)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin-top:8px" />
    </header>
    <section class="section"><h2 class="section-title" style="text-align:center;color:${theme.accent}">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
    <section class="section"><h2 class="section-title" style="text-align:center;color:${theme.accent}">Skills</h2>${skillsHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="text-align:center;color:${theme.accent}">Experience</h2>${experienceHtml(doc)}</section>
    <section class="section"><h2 class="section-title" style="text-align:center;color:${theme.accent}">Education</h2>${educationHtml(doc)}</section>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderBlueMargin(doc: ResumeDocument, theme: Theme): string {
  const section = (title: string, content: string) =>
    `<section class="section" style="display:grid;grid-template-columns:28mm 1fr;gap:10px">
      <h2 class="section-title" style="text-align:right;padding-top:2px">${title}</h2>
      <div>${content}</div>
    </section>`
  const body = `<div class="page">
    <header style="margin-bottom:10px">
      <h1 style="font-size:22pt;color:${theme.accent}">${escapeHtml(doc.name)}</h1>
      <p class="muted" style="margin-top:4px">${contactLine(doc)}</p>
    </header>
    ${section('Summary', `<p>${escapeHtml(doc.summary)}</p>`)}
    ${section('Skills', skillsHtml(doc))}
    ${section('Experience', experienceHtml(doc))}
    ${section('Education', educationHtml(doc))}
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderSlateColumns(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page" style="padding-top:10mm">
    <header style="display:grid;grid-template-columns:88px 1fr;gap:14px;align-items:center;border-bottom:3px solid ${theme.accent};padding-bottom:10px;margin-bottom:12px">
      ${photoBlock(doc)}
      <div>
        <h1 style="font-size:20pt;text-transform:uppercase">${escapeHtml(doc.name)}</h1>
        <p style="margin-top:4px;font-weight:600">${escapeHtml(doc.title)}</p>
        <p class="muted" style="margin-top:4px;font-size:9.5pt">${contactLine(doc)}</p>
      </div>
    </header>
    <div style="display:grid;grid-template-columns:32mm 1fr;gap:12px">
      <div></div>
      <div>
        <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
        <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc)}</section>
        <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
        <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
      </div>
    </div>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderGraySidebar(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page" style="display:grid;grid-template-columns:68mm 1fr;gap:0;padding:0;min-height:297mm">
    <aside style="background:#f3f4f6;padding:14mm 10mm;border-right:1px solid #e5e7eb">
      ${photoBlock(doc)}
      <section class="section"><h2 class="section-title">Contact</h2>
        ${doc.email ? `<p>${escapeHtml(doc.email)}</p>` : ''}
        ${doc.location ? `<p>${escapeHtml(doc.location)}</p>` : ''}
      </section>
      <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc, 1)}</section>
      <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
    </aside>
    <main style="padding:14mm 12mm">
      <h1 style="font-size:22pt;color:${theme.accent}">${escapeHtml(doc.name)}</h1>
      <p style="margin-top:4px;font-weight:600">${escapeHtml(doc.title)}</p>
      <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
      <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
      <section class="section"><h2 class="section-title">Top skills</h2>${topSkillsBars(doc, theme.accent)}</section>
    </main>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderMauveBanner(doc: ResumeDocument, theme: Theme): string {
  const section = (title: string, content: string) =>
    `<section class="section" style="display:grid;grid-template-columns:34mm 1fr;gap:10px">
      <h2 class="section-title muted" style="font-size:9pt">${title}</h2>
      <div>${content}</div>
    </section>`
  const body = `<div class="page" style="padding:0">
    <header style="background:${theme.accent};color:#fff;padding:12mm 16mm;display:flex;justify-content:space-between;align-items:center">
      <h1 style="font-size:20pt;font-family:Georgia,serif">${escapeHtml(doc.name.toUpperCase())}</h1>
      <div style="text-align:right;font-size:9pt;line-height:1.5">
        ${doc.email ? `<div>${escapeHtml(doc.email)}</div>` : ''}
        ${doc.location ? `<div>${escapeHtml(doc.location)}</div>` : ''}
      </div>
    </header>
    <div style="padding:12mm 16mm">
      ${section('Summary', `<p>${escapeHtml(doc.summary)}</p>`)}
      ${section('Skills', skillsHtml(doc))}
      ${section('Experience', experienceHtml(doc))}
      ${section('Education', educationHtml(doc))}
    </div>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderYellowSidebar(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page" style="display:grid;grid-template-columns:62mm 1fr;padding:0;min-height:297mm">
    <aside style="background:#fafafa;padding:14mm 10mm;border-right:4px solid ${theme.accent}">
      <h1 style="font-size:16pt;line-height:1.2">${escapeHtml(doc.name.toUpperCase())}</h1>
      <section class="section"><h2 class="section-title">Contact</h2>
        ${doc.email ? `<p style="font-size:9.5pt">${escapeHtml(doc.email)}</p>` : ''}
        ${doc.location ? `<p style="font-size:9.5pt">${escapeHtml(doc.location)}</p>` : ''}
      </section>
      <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
    </aside>
    <main style="padding:14mm 12mm">
      <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
      <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc)}</section>
      <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
    </main>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderTealSidebar(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page" style="display:grid;grid-template-columns:70mm 1fr;padding:0;min-height:297mm">
    <aside style="background:${theme.accent};color:#fff;padding:14mm 10mm">
      ${photoBlock(doc)}
      <section class="section"><h2 class="section-title" style="color:#ecfdf5">Contact</h2>
        ${doc.email ? `<p style="font-size:9.5pt">${escapeHtml(doc.email)}</p>` : ''}
        ${doc.location ? `<p style="font-size:9.5pt">${escapeHtml(doc.location)}</p>` : ''}
      </section>
      <section class="section"><h2 class="section-title" style="color:#ecfdf5">Summary</h2><p style="font-size:9.5pt">${escapeHtml(doc.summary)}</p></section>
      <section class="section"><h2 class="section-title" style="color:#ecfdf5">Skills</h2><ul class="skills" style="color:#fff">${doc.skills.map((s) => `<li>${escapeHtml(s.name)}</li>`).join('')}</ul></section>
    </aside>
    <main style="padding:14mm 12mm">
      <h1 style="font-size:22pt;color:${theme.accent}">${escapeHtml(doc.name)}</h1>
      <p style="font-weight:600;margin-top:4px">${escapeHtml(doc.title)}</p>
      <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
      <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
    </main>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function renderTealPhoto(doc: ResumeDocument, theme: Theme): string {
  const body = `<div class="page" style="padding:12mm 14mm">
    <header style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:4px solid ${theme.accent};padding-bottom:10px">
      <div><h1 style="font-size:20pt;text-transform:uppercase">${escapeHtml(doc.name)}</h1><p style="margin-top:4px">${escapeHtml(doc.title)}</p></div>
      <div style="text-align:right">${photoBlock(doc)}</div>
    </header>
    <div style="display:grid;grid-template-columns:1fr 52mm;gap:14px;margin-top:12px">
      <div>
        <section class="section"><h2 class="section-title">Summary</h2><p>${escapeHtml(doc.summary)}</p></section>
        <section class="section"><h2 class="section-title">Experience</h2>${experienceHtml(doc)}</section>
        <section class="section"><h2 class="section-title">Education</h2>${educationHtml(doc)}</section>
      </div>
      <aside>
        <section class="section"><h2 class="section-title">Contact</h2>
          ${doc.email ? `<p style="font-size:9.5pt">${escapeHtml(doc.email)}</p>` : ''}
          ${doc.location ? `<p style="font-size:9.5pt">${escapeHtml(doc.location)}</p>` : ''}
        </section>
        <section class="section"><h2 class="section-title">Skills</h2>${skillsHtml(doc, 1)}</section>
        <section class="section"><h2 class="section-title">Proficiency</h2>${topSkillsBars(doc, theme.accent)}</section>
      </aside>
    </div>
  </div>`
  return wrapDocument(`${doc.name} — Resume`, theme, body)
}

function ratingDots(level: number, accent: string, max = 5): string {
  return Array.from({ length: max }, (_, i) => {
    const filled = i < level
    return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:3px;background:${filled ? accent : '#475569'}"></span>`
  }).join('')
}

function renderNavyOrangePro(doc: ResumeDocument, theme: Theme): string {
  const navy = '#0c2d4a'
  const orange = theme.accent
  const text = '#e2e8f0'
  const sectionTitle = (label: string) =>
    `<h2 style="font-size:11pt;color:${orange};text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid ${orange};padding-bottom:4px;margin-bottom:8px">${label}</h2>`

  const contactRows = [
    doc.phone ? `<p><strong>Phone</strong><br/>${escapeHtml(doc.phone)}</p>` : '',
    doc.email ? `<p><strong>Email</strong><br/>${escapeHtml(doc.email)}</p>` : '',
    doc.linkedIn ? `<p><strong>LinkedIn</strong><br/><span style="word-break:break-all;font-size:8.5pt">${escapeHtml(doc.linkedIn)}</span></p>` : '',
    doc.website ? `<p><strong>Website</strong><br/><span style="word-break:break-all;font-size:8.5pt">${escapeHtml(doc.website)}</span></p>` : '',
    doc.location ? `<p><strong>Location</strong><br/>${escapeHtml(doc.location)}</p>` : '',
  ]
    .filter(Boolean)
    .join('')

  const techSkills = doc.skills
    .map(
      (s) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:9pt">
        <span>${escapeHtml(s.name)}</span>
        <span>${ratingDots(s.proficiency, orange)}</span>
      </div>`,
    )
    .join('')

  const langSkills = doc.languages
    .map(
      (s) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:9pt">
        <span>${escapeHtml(s.name)}</span>
        <span>${ratingDots(s.proficiency, orange)}</span>
      </div>`,
    )
    .join('')

  const jobs = doc.experience
    .map((job) => {
      const bullets = descriptionBullets(job.description)
        .map((b) => `<li style="margin-bottom:4px">${escapeHtml(b)}</li>`)
        .join('')
      const range = formatExperienceRange(job.startDate, job.endDate, job.current)
      return `<article style="margin-bottom:12px">
        <h3 style="color:${orange};font-size:11pt;margin-bottom:2px">${escapeHtml(job.role)}</h3>
        <p style="font-weight:600;margin-bottom:2px">${escapeHtml(job.company)}</p>
        <p style="font-size:9pt;color:#94a3b8;margin-bottom:6px">${escapeHtml(range)}</p>
        <ul style="margin-left:16px;font-size:9.5pt;line-height:1.4">${bullets}</ul>
      </article>`
    })
    .join('')

  const edu = doc.education
    .map((ed) => {
      const range = [formatMonthYear(ed.startDate), formatMonthYear(ed.endDate)]
        .filter(Boolean)
        .join(' — ')
      return `<article style="margin-bottom:8px">
        <h3 style="color:${orange};font-size:10.5pt">${escapeHtml(ed.degree)}</h3>
        <p style="font-size:9.5pt">${escapeHtml(ed.institution)}</p>
        <p style="font-size:9pt;color:#94a3b8">${escapeHtml(range)}</p>
      </article>`
    })
    .join('')

  const certs = doc.certifications
    .map(
      (c) => `<article style="margin-bottom:8px">
        <h3 style="color:${orange};font-size:10.5pt">${escapeHtml(c.title)}</h3>
        <p style="font-size:9.5pt">${escapeHtml(c.institution)}${c.year ? ` · ${escapeHtml(c.year)}` : ''}</p>
      </article>`,
    )
    .join('')

  const personalBars = doc.personalSkills
    .map((s) => {
      const pct = proficiencyPercent(s.proficiency)
      return `<div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;font-size:9pt;margin-bottom:2px"><span>${escapeHtml(s.name)}</span></div>
        <div style="height:5px;background:#334155;border-radius:999px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${orange}"></div></div>
      </div>`
    })
    .join('')

  const hobbies = doc.hobbies
    .map(
      (h) =>
        `<span style="display:inline-block;border:1px solid #64748b;border-radius:999px;padding:3px 10px;font-size:8.5pt;margin:0 6px 6px 0">${escapeHtml(h)}</span>`,
    )
    .join('')

  const moreInfo = doc.moreInfo
    ? `<p style="font-size:9pt;line-height:1.5">
        ${doc.moreInfo.gender ? `<span><strong>Gender:</strong> ${escapeHtml(doc.moreInfo.gender)}</span><br/>` : ''}
        ${doc.moreInfo.dateOfBirth ? `<span><strong>Date of birth:</strong> ${escapeHtml(doc.moreInfo.dateOfBirth)}</span><br/>` : ''}
        ${doc.moreInfo.nationality ? `<span><strong>Nationality:</strong> ${escapeHtml(doc.moreInfo.nationality)}</span>` : ''}
      </p>`
    : ''

  const photo = doc.profileImageUrl
    ? `<img src="${escapeHtml(doc.profileImageUrl)}" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid ${orange}" />`
    : `<div style="width:96px;height:96px;border-radius:50%;background:#334155;border:3px solid ${orange}"></div>`

  const body = `<div class="page" style="background:${navy};color:${text};padding:12mm 14mm;min-height:297mm;font-family:${theme.font}">
    <header style="display:grid;grid-template-columns:100px 1fr;gap:14px;align-items:start;margin-bottom:14px">
      ${photo}
      <div>
        <h1 style="font-family:${theme.headingFont};font-size:22pt;color:${orange};line-height:1.15">${escapeHtml(doc.name)}</h1>
        <p style="color:${orange};font-weight:600;margin-top:4px;font-size:11pt">${escapeHtml(doc.title)}</p>
        <p style="margin-top:8px;font-size:9.5pt;line-height:1.45;color:#cbd5e1">${escapeHtml(doc.summary)}</p>
      </div>
    </header>
    <div style="display:grid;grid-template-columns:34% 1fr;gap:14px">
      <aside>
        <section style="margin-bottom:12px">${sectionTitle('Contact')}${contactRows}</section>
        <section style="margin-bottom:12px">${sectionTitle('Skills')}${techSkills}</section>
        <section style="margin-bottom:12px">${sectionTitle('Languages')}${langSkills || '<p style="font-size:9pt;color:#94a3b8">—</p>'}</section>
        ${moreInfo ? `<section style="margin-bottom:12px">${sectionTitle('More info')}${moreInfo}</section>` : ''}
        ${hobbies ? `<section style="margin-bottom:12px">${sectionTitle('Hobbies')}${hobbies}</section>` : ''}
      </aside>
      <main>
        <section style="margin-bottom:12px">${sectionTitle('Experience')}${jobs}</section>
        <section style="margin-bottom:12px">${sectionTitle('Education')}${edu}</section>
        ${certs ? `<section style="margin-bottom:12px">${sectionTitle('Certification')}${certs}</section>` : ''}
        ${personalBars ? `<section>${sectionTitle('Personal skills')}${personalBars}</section>` : ''}
      </main>
    </div>
  </div>`

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(doc.name)} — Resume</title>
<style>*{box-sizing:border-box;margin:0} body{margin:0;background:${navy}}</style></head>
<body>${body}</body></html>`
}

const RENDERERS: Record<ResumeTemplateId, (doc: ResumeDocument, theme: Theme) => string> = {
  'navy-orange-pro': renderNavyOrangePro,
  'white-classic': renderWhiteClassic,
  'white-serif': renderWhiteSerif,
  'white-minimal': renderWhiteMinimal,
  'teal-center': renderTealCenter,
  'maroon-center': renderMaroonCenter,
  'blue-margin': renderBlueMargin,
  'slate-columns': renderSlateColumns,
  'gray-sidebar': renderGraySidebar,
  'mauve-banner': renderMauveBanner,
  'yellow-sidebar': renderYellowSidebar,
  'teal-sidebar': renderTealSidebar,
  'teal-photo': renderTealPhoto,
}

export function renderResumeHtml(doc: ResumeDocument, templateId: ResumeTemplateId): string {
  const theme = THEMES[templateId]
  return RENDERERS[templateId](doc, theme)
}
