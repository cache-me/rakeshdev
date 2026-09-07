'use client'

import { Download, ExternalLink } from 'lucide-react'

import type { EducationRecord, EducationSemester } from '@portfolio/validation'

import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'

const TYPE_LABELS: Record<EducationRecord['qualificationType'], string> = {
  matric: 'School',
  intermediate: 'Higher Secondary',
  undergraduate: 'Undergraduate',
  postgraduate: 'Postgraduate',
  professional: 'Professional',
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return '—'
  return `${start ?? '?'} — ${end ?? '?'}`
}

function fmtNum(value: number | undefined) {
  return value === undefined ? '—' : String(value)
}

function SemesterMarksheet({ semester }: { semester: EducationSemester }) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--cyber-accent)]">
          {semester.name}
        </h3>
        <p className="font-mono text-[10px] text-white/60">
          Credits {semester.credits} · Total {semester.totalMarks} · SGPA {semester.sgpa}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[9px] uppercase text-white/50">
              <th className="py-2 pr-2">Subject / Paper</th>
              <th className="py-2 pr-2 text-right">Cr</th>
              <th className="py-2 pr-2 text-right">Int max</th>
              <th className="py-2 pr-2 text-right">Ext max</th>
              <th className="py-2 pr-2 text-right">Int</th>
              <th className="py-2 pr-2 text-right">Ext</th>
              <th className="py-2 pr-2 text-right">Total</th>
              <th className="py-2 pr-2 text-right">CP</th>
              <th className="py-2 text-right">Gr</th>
            </tr>
          </thead>
          <tbody>
            {semester.papers.map((paper) => (
              <tr key={`${semester.name}-${paper.subject}`} className="border-b border-white/5">
                <td className="py-2 pr-2 text-white/90">{paper.subject}</td>
                <td className="py-2 pr-2 text-right text-[var(--cyber-muted)]">{fmtNum(paper.credits)}</td>
                <td className="py-2 pr-2 text-right text-[var(--cyber-muted)]">{fmtNum(paper.maxInternal)}</td>
                <td className="py-2 pr-2 text-right text-[var(--cyber-muted)]">{fmtNum(paper.maxFinal)}</td>
                <td className="py-2 pr-2 text-right">{fmtNum(paper.marksInternal)}</td>
                <td className="py-2 pr-2 text-right">{fmtNum(paper.marksFinal)}</td>
                <td className="py-2 pr-2 text-right font-medium text-[var(--cyber-accent)]">
                  {fmtNum(paper.total)}
                </td>
                <td className="py-2 pr-2 text-right">{fmtNum(paper.creditPoints)}</td>
                <td className="py-2 text-right font-mono">{paper.grade ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QualificationCard({ item }: { item: EducationRecord }) {
  const semesters = item.metrics?.semesters ?? []
  const hasSemesterSheets = semesters.length > 0
  const hasMarksTable =
    !hasSemesterSheets && item.subjects.some((s) => s.marks !== undefined || s.grade)

  return (
    <article className="hud-panel overflow-hidden">
      <div className="border-b border-[var(--cyber-border)] px-5 py-4 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--cyber-accent)]">
          [ {TYPE_LABELS[item.qualificationType]} ]
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white md:text-2xl">{item.degree}</h2>
        <p className="mt-1 text-sm text-[var(--cyber-muted)]">{item.institution}</p>
        {item.boardOrIssuer ? (
          <p className="mt-1 text-xs text-white/60">{item.boardOrIssuer}</p>
        ) : null}
        <p className="mt-2 font-mono text-xs text-[var(--cyber-accent)]">
          {formatPeriod(item.startDate, item.endDate)}
        </p>
        {item.resultSummary ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--cyber-muted)]">
            {item.resultSummary}
          </p>
        ) : null}
        {item.metrics ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.metrics.cgpa !== undefined ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                CGPA {item.metrics.cgpa}
              </span>
            ) : null}
            {item.metrics.totalMarks !== undefined && item.metrics.maxMarks !== undefined ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                {item.metrics.totalMarks} / {item.metrics.maxMarks}
              </span>
            ) : null}
            {item.metrics.certificateId ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                ID {item.metrics.certificateId}
              </span>
            ) : null}
            {item.metrics.learningHours ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                {item.metrics.learningHours} hrs
              </span>
            ) : null}
            {item.metrics.rollNumber ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                Roll {item.metrics.rollNumber}
              </span>
            ) : null}
            {item.metrics.stream ? (
              <span className="rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/80">
                {item.metrics.stream} · {item.metrics.coreSubject}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {hasSemesterSheets ? (
        <div className="border-b border-[var(--cyber-border)] px-5 py-4 md:px-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/50">
            Semester-wise marksheet
          </p>
          {semesters.map((sem) => (
            <SemesterMarksheet key={sem.name} semester={sem} />
          ))}
          {item.metrics?.categoryTotals ? (
            <div className="mt-4 rounded border border-white/10 bg-black/20 p-3">
              <p className="mb-2 font-mono text-[10px] uppercase text-white/50">Category totals</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.metrics.categoryTotals).map(([key, val]) => (
                  <span
                    key={key}
                    className="font-mono text-[10px] text-[var(--cyber-muted)]"
                  >
                    {key}: <span className="text-white/90">{val}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasMarksTable ? (
        <div className="overflow-x-auto px-5 py-4 md:px-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-white/50">
            Subject marks & grades
          </p>
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase text-white/50">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Subject</th>
                <th className="py-2 pr-3 text-right">Max</th>
                <th className="py-2 text-right">Secured</th>
              </tr>
            </thead>
            <tbody>
              {item.subjects.map((subject) => (
                <tr key={`${subject.code ?? ''}-${subject.name}`} className="border-b border-white/5">
                  <td className="py-2 pr-3 font-mono text-xs text-[var(--cyber-muted)]">
                    {subject.code ?? '—'}
                  </td>
                  <td className="py-2 pr-3 text-white/90">{subject.name}</td>
                  <td className="py-2 pr-3 text-right text-[var(--cyber-muted)]">
                    {subject.maxMarks ?? (subject.grade ? 'Grade' : '—')}
                  </td>
                  <td className="py-2 text-right font-medium text-[var(--cyber-accent)]">
                    {subject.marks ?? subject.grade ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {item.description ? (
        <p className="border-t border-[var(--cyber-border)] px-5 py-3 text-xs text-[var(--cyber-muted)] md:px-6">
          {item.description}
        </p>
      ) : null}

      {item.certificateUrl ? (
        <div className="flex flex-wrap gap-3 border-t border-[var(--cyber-border)] bg-black/20 px-5 py-4 md:px-6">
          <CyberPrimaryLink href={item.certificateUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            View certificate
          </CyberPrimaryLink>
          <CyberOutlineLink href={item.certificateUrl} download>
            <Download className="size-4" />
            Download certificate
          </CyberOutlineLink>
        </div>
      ) : (
        <div className="border-t border-[var(--cyber-border)] px-5 py-4 md:px-6">
          <p className="font-mono text-[10px] text-white/40">
            Certificate scan not uploaded for this entry yet.
          </p>
        </div>
      )}
    </article>
  )
}

export default function CyberEducationPage({ items }: { items: EducationRecord[] }) {
  const academic = items.filter((i) => i.qualificationType !== 'professional')
  const professional = items.filter((i) => i.qualificationType === 'professional')

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-12 md:px-8">
      <div className="mb-10">
        <p className="hud-label text-white/70">[ EDUCATION // CREDENTIALS ]</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          ACADEMIC &amp; PROFESSIONAL QUALIFICATIONS
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--cyber-muted)]">
          Verified qualifications with subject-wise marks where available, plus scanned certificates
          you can view or download.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--cyber-accent)]">
          Academic record
        </h2>
        <div className="space-y-8">{academic.map((item) => <QualificationCard key={item.id} item={item} />)}</div>
      </section>

      {professional.length > 0 ? (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--cyber-accent)]">
            Professional qualifications
          </h2>
          <div className="space-y-8">
            {professional.map((item) => (
              <QualificationCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap gap-3">
        <CyberOutlineLink href="/resume">Generate resume PDF</CyberOutlineLink>
        <CyberOutlineLink href="/experience">View experience</CyberOutlineLink>
      </div>
    </div>
  )
}
