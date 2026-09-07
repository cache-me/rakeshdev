import { AdminSubpage } from '@/features/admin/admin-subpage'
import PersonalDocumentsAdmin from '@/features/admin/personal-documents-admin'

export default function AdminPersonalDocumentsPage() {
  return (
    <AdminSubpage title="Personal documents">
      <PersonalDocumentsAdmin />
    </AdminSubpage>
  )
}
