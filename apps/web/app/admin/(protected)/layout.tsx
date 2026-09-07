import AdminShell from '@/features/admin/admin-shell'

export default function AdminProtectedLayout({
  children,
}: React.PropsWithChildren) {
  return <AdminShell>{children}</AdminShell>
}
