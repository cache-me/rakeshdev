import CyberPage from '@/features/cyber/cyber-page'
import ContactForm from './_components/contact-form'
import { createPageMetadata } from '@/lib/seo'
import { getSiteBrandName } from '@/lib/site-brand'

export const metadata = createPageMetadata({
  title: 'Contact — Rakesh',
  description: 'Get in touch for collaborations and opportunities.',
  path: '/contact',
})

export default async function ContactPage() {
  const brandName = await getSiteBrandName()

  return (
    <CyberPage brandName={brandName}>
      <div className="mx-auto max-w-lg px-4 pb-16 md:px-8">
        <p className="hud-label text-white/70">[ CONTACT // UPLINK ]</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Establish Contact</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--cyber-muted)]">
          Share a bit about your project, timeline, and goals.
        </p>

        <div className="hud-panel mt-8 p-6 md:p-8">
          <p className="hud-label text-[var(--cyber-accent)]">SECURE_FORM // v1</p>
          <ContactForm />
        </div>
      </div>
    </CyberPage>
  )
}
