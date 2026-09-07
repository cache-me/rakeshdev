'use client'

import { SimpleAdminCrud } from '@/features/admin/simple-admin-crud'
import { adminClient } from '@/lib/api'

export default function AdminTestimonialsPage() {
  return (
    <SimpleAdminCrud
      moduleTag="SIGNAL_REVIEWS"
      secCode="SEC_TESTIMONIAL_FEED"
      title="Testimonials"
      listKey="testimonials"
      titleKey="author"
      subtitleKey="role"
      cloneSuffixKey="author"
      fields={[
        { key: 'author', label: 'Author' },
        { key: 'role', label: 'Role' },
        { key: 'quote', label: 'Quote', type: 'textarea', span: 2 },
        { key: 'sortOrder', label: 'Sort order', type: 'number' },
      ]}
      list={() => adminClient.listTestimonials()}
      create={(body) => adminClient.createTestimonial({ body: body as never })}
      update={(id, body) => adminClient.updateTestimonial({ params: { id }, body: body as never })}
      remove={(id) => adminClient.deleteTestimonial({ params: { id } })}
    />
  )
}
