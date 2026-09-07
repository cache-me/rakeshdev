import AdminLoginForm from '@/features/admin/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="cyber-page cyber-grid-bg min-h-screen px-4 py-16">
      <p className="mx-auto max-w-md text-center font-mono text-[10px] uppercase tracking-wider text-[var(--cyber-muted)]">
        <span className="text-[var(--cyber-muted)]">[</span>
        DEV ARCHITECT.IO
        <span className="text-[var(--cyber-muted)]">]</span>
        <span className="text-[var(--cyber-muted)]"> // </span>
        SECURE_ADMIN_PORT
      </p>
      <AdminLoginForm />
    </div>
  )
}
