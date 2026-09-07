import type { ResumeTemplateId, ResumeTemplateMeta } from '@/features/resume/types'
import CyberPage from '@/features/cyber/cyber-page'
import { ResumeStudio } from '@/features/resume/resume-studio'
import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Resume',
  description: 'Preview and download your portfolio resume in multiple templates.',
  path: '/resume',
})

export default async function ResumePage() {
  const [brandName, metaRes, templatesRes] = await Promise.all([
    getSiteBrandName(),
    apiClient.resume.get(),
    apiClient.resume.listTemplates(),
  ])

  const meta = metaRes.status === 200 && metaRes.body.success ? metaRes.body.data : null
  const templates =
    templatesRes.status === 200 && templatesRes.body.success ? templatesRes.body.data : []

  return (
    <CyberPage brandName={brandName}>
      <ResumeStudio
        templates={templates as ResumeTemplateMeta[]}
        defaultTemplate={(meta?.defaultTemplate ?? 'navy-orange-pro') as ResumeTemplateId}
        updatedAt={meta?.updatedAt ?? null}
      />
    </CyberPage>
  )
}
