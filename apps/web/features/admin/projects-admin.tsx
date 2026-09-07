'use client'

import { projectBodyFromForm } from '@/features/admin/admin-api-helpers'
import { CyberMutationCrud } from '@/features/admin/cyber-mutation-crud'
import { projectCrudUi } from '@/features/admin/cyber-crud-ui'
import { adminClient } from '@/lib/api'

type ProjectRow = {
  id: string
  title: string
  slug: string
  summary: string
  body: string
  featured: boolean
  status: 'published' | 'draft'
  technologies: string[]
  sortOrder: number
  coverImageUrl: string | null
}

export default function ProjectsAdmin() {
  return (
    <CyberMutationCrud
      moduleTag="PROJECT_ARCHIVE"
      secCode="SEC_DEPLOYMENT_NODES"
      listKey="projects"
      titleKey="title"
      subtitleKey="slug"
      cloneSuffixKey="title"
      fields={[
        { key: 'title', label: 'Title', dockLabel: 'PROJECT_NAME', span: 2 },
        { key: 'slug', label: 'Slug', dockLabel: 'SLUG / CANONICAL', span: 2 },
        {
          key: 'summary',
          label: 'Summary',
          dockLabel: 'ARCHITECTURAL_SYNOPSIS',
          type: 'textarea',
          span: 2,
        },
        {
          key: 'body',
          label: 'Body',
          dockLabel: 'DETAILED_BREAKDOWN',
          type: 'textarea',
          span: 2,
        },
        {
          key: 'coverImageUrl',
          label: 'Cover',
          type: 'coverImage',
          span: 2,
        },
        {
          key: 'technologies',
          label: 'Technologies',
          dockLabel: 'TECH_STACK_TAGS (CSV)',
          span: 2,
        },
        {
          key: 'status',
          label: 'Site visibility',
          dockLabel: 'SITE_VISIBILITY',
          type: 'select',
          options: [
            { value: 'published', label: 'Published (visible on /projects)' },
            { value: 'draft', label: 'Draft (hidden from public)' },
          ],
        },
        {
          key: 'featured',
          label: 'Home page',
          dockLabel: 'HOME_PORTFOLIO_ARCHIVES',
          type: 'select',
          options: [
            { value: 'no', label: 'Hide from home featured section' },
            { value: 'yes', label: 'Show on home [ PORTFOLIO_ARCHIVES ]' },
          ],
        },
        { key: 'sortOrder', label: 'Sort order', dockLabel: 'SORT_INDEX', type: 'number' },
      ]}
      list={() => adminClient.listProjects()}
      create={(body) => adminClient.createProject({ body: body as never })}
      update={(id, body) => adminClient.updateProject({ params: { id }, body: body as never })}
      remove={(id) => adminClient.deleteProject({ params: { id } })}
      ui={{
        ...projectCrudUi,
        headerStats: (rows) => {
          const home = rows.filter((r) => r.featured && r.status === 'published').length
          return `${rows.length} TOTAL · ${home} ON HOME · ${rows.length - home} OFF HOME`
        },
      }}
      toBody={projectBodyFromForm}
      fromRow={(row) => {
        const p = row as unknown as ProjectRow
        return {
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          body: p.body,
          coverImageUrl: p.coverImageUrl ?? '',
          technologies: (p.technologies ?? []).join(', '),
          status: p.status === 'draft' ? 'draft' : 'published',
          featured: p.featured ? 'yes' : 'no',
          sortOrder: String(p.sortOrder ?? 0),
        }
      }}
    />
  )
}
