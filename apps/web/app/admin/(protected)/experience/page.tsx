'use client'

import { SimpleAdminCrud } from '@/features/admin/simple-admin-crud'
import { experienceBodyFromForm } from '@/features/admin/admin-api-helpers'
import { experienceCrudUi } from '@/features/admin/cyber-crud-ui'
import { adminClient } from '@/lib/api'

export default function AdminExperiencePage() {
  return (
    <SimpleAdminCrud
      moduleTag="EXPERIENCE_CMS"
      secCode="SEC_CAREER_TIMELINE"
      listKey="experience"
      titleKey="company"
      subtitleKey="role"
      cloneSuffixKey="role"
      ui={experienceCrudUi}
      fields={[
        { key: 'role', label: 'Role', dockLabel: 'ROLE / TITLE_CLEARANCE', span: 2 },
        { key: 'company', label: 'Company', dockLabel: 'COMPANY_NAME', span: 2 },
        { key: 'location', label: 'Location', dockLabel: 'LOCATION / CAMPUS' },
        { key: 'startDate', label: 'Start date', dockLabel: 'START_DATE' },
        { key: 'endDate', label: 'End date', dockLabel: 'END_DATE (blank = present)' },
        {
          key: 'description',
          label: 'Description',
          dockLabel: 'MARKDOWN // ARCHITECTURAL BREAKDOWN',
          type: 'textarea',
          span: 2,
        },
        { key: 'sortOrder', label: 'Sort order', type: 'number' },
      ]}
      list={() => adminClient.listExperience()}
      create={(body) => adminClient.createExperience({ body: body as never })}
      update={(id, body) =>
        adminClient.updateExperience({ params: { id }, body: body as never })
      }
      remove={(id) => adminClient.deleteExperience({ params: { id } })}
      toBody={experienceBodyFromForm}
      fromRow={(row) => ({
        role: String(row.role ?? ''),
        company: String(row.company ?? ''),
        location: String(row.location ?? ''),
        startDate: String(row.startDate ?? ''),
        endDate: row.current ? '' : String(row.endDate ?? ''),
        description: String(row.description ?? ''),
        sortOrder: String(row.sortOrder ?? 0),
      })}
    />
  )
}
