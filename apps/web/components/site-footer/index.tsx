import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Rakesh. Crafted with performance and care.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/resume" className="text-muted-foreground hover:text-foreground">
            Resume
          </Link>
          <Link href="/now" className="text-muted-foreground hover:text-foreground">
            Now
          </Link>
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
