'use client'

import { SimpleAdminCrud } from '@/features/admin/simple-admin-crud'
import { adminClient } from '@/lib/api'

export default function AdminServicesPage() {
  return (
    <SimpleAdminCrud
      moduleTag="SERVICES_GRID"
      secCode="SEC_OFFERING_NODES"
      title="Services grid"
      listKey="services"
      titleKey="title"
      subtitleKey="description"
      cloneSuffixKey="title"
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', type: 'textarea', span: 2 },
        { key: 'iconKey', label: 'Icon key' },
        { key: 'sortOrder', label: 'Sort order', type: 'number' },
      ]}
      list={() => adminClient.listServices()}
      create={(body) => adminClient.createService({ body: body as never })}
      update={(id, body) => adminClient.updateService({ params: { id }, body: body as never })}
      remove={(id) => adminClient.deleteService({ params: { id } })}
    />
  )
}
