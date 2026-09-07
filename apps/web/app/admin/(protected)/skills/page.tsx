'use client'

import { SimpleAdminCrud } from '@/features/admin/simple-admin-crud'
import { adminClient } from '@/lib/api'

export default function AdminSkillsPage() {
  return (
    <SimpleAdminCrud
      moduleTag="SKILLS_MATRIX"
      secCode="SEC_COMPETENCY_SPECS"
      title="Skills matrix"
      listKey="skills"
      titleKey="name"
      subtitleKey="category"
      cloneSuffixKey="name"
      fields={[
        { key: 'name', label: 'Name', dockLabel: 'SPEC_NAME' },
        { key: 'category', label: 'Category', dockLabel: 'MATRIX_CLUSTER' },
        { key: 'proficiency', label: 'Proficiency (1-5)', type: 'number' },
        { key: 'sortOrder', label: 'Sort order', type: 'number' },
      ]}
      list={() => adminClient.listSkills()}
      create={(body) => adminClient.createSkill({ body: body as never })}
      update={(id, body) => adminClient.updateSkill({ params: { id }, body: body as never })}
      remove={(id) => adminClient.deleteSkill({ params: { id } })}
    />
  )
}
