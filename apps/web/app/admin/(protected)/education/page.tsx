'use client'

import { educationBodyFromForm } from '@/features/admin/admin-api-helpers'
import { SimpleAdminCrud } from '@/features/admin/simple-admin-crud'
import { educationCrudUi } from '@/features/admin/cyber-crud-ui'
import { adminClient } from '@/lib/api'

export default function AdminEducationPage() {
  return (
    <SimpleAdminCrud
      moduleTag="EDUCATION_CMS"
      secCode="SEC_ACADEMIC_CREDENTIALS"
      listKey="education"
      titleKey="institution"
      subtitleKey="degree"
      cloneSuffixKey="degree"
      ui={educationCrudUi}
      fields={[
        { key: 'degree', label: 'Degree', dockLabel: 'DEGREE_OR_TITLE', span: 2 },
        {
          key: 'institution',
          label: 'Institution',
          dockLabel: 'INSTITUTION_NAME & DEPT',
          span: 2,
        },
        { key: 'startDate', label: 'Start date', dockLabel: 'START_DATE' },
        { key: 'endDate', label: 'End date', dockLabel: 'END_DATE (blank = present)' },
        {
          key: 'description',
          label: 'Description',
          dockLabel: 'THESIS / SYNOPSIS',
          type: 'textarea',
          span: 2,
        },
        { key: 'sortOrder', label: 'Sort order', type: 'number' },
      ]}
      list={() => adminClient.listEducation()}
      create={(body) => adminClient.createEducation({ body: body as never })}
      update={(id, body) =>
        adminClient.updateEducation({ params: { id }, body: body as never })
      }
      remove={(id) => adminClient.deleteEducation({ params: { id } })}
      toBody={educationBodyFromForm}
      fromRow={(row) => ({
        degree: String(row.degree ?? ''),
        institution: String(row.institution ?? ''),
        startDate: String(row.startDate ?? ''),
        endDate: row.endDate ? String(row.endDate) : '',
        description: String(row.description ?? ''),
        sortOrder: String(row.sortOrder ?? 0),
      })}
    />
  )
}
