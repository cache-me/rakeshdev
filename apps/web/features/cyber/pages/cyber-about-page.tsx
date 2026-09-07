import { CyberOutlineLink, CyberPrimaryLink } from '@/features/cyber/cyber-buttons'

const exploringTags = [
  'AI SYSTEMS',
  '3D WEB',
  'FULL-STACK ARCHITECTURE',
  'CREATIVE DEVELOPMENT',
] as const

const aiSkillTags = [
  'LLM INTEGRATION',
  'RAG & VECTOR SEARCH',
  'AI ASSISTANTS',
  'PROMPT ENGINEERING',
  'AGENT WORKFLOWS',
  'EMBEDDINGS & SEMANTIC SEARCH',
] as const

type CyberAboutPageProps = {
  name: string
  location?: string | null
}

export default function CyberAboutPage({ name, location }: CyberAboutPageProps) {
  const basedIn = location?.trim() || 'INDIA'

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
      <header className="max-w-3xl">
        <p className="hud-label text-white/70">[ ABOUT // PROFILE ]</p>
        <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          I BUILD DIGITAL EXPERIENCES THAT FEEL ALIVE.
        </h1>
      </header>

      <div className="mt-10 max-w-3xl space-y-5 text-sm leading-relaxed text-[var(--cyber-muted)] md:text-base md:leading-relaxed">
        <p>
          I&apos;m {name}, a Full-Stack Developer and Creative Technologist focused on building
          fast, intelligent, and visually immersive digital products.
        </p>
        <p>
          I turn ideas into production-ready experiences — from scalable web applications and APIs
          to interactive 3D interfaces and AI-powered systems. I care about more than just making
          things work; I care about how they feel, perform, and scale.
        </p>
        <p>
          My approach sits at the intersection of engineering, design, and experimentation —
          combining clean architecture with modern technologies to create products that are
          purposeful, performant, and memorable.
        </p>
      </div>

      <section className="mt-12">
        <p className="hud-label text-white/80">CURRENTLY EXPLORING</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {exploringTags.map((tag) => (
            <span key={tag} className="cyber-tag">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10 hud-panel p-6 md:p-8">
        <p className="hud-label text-[var(--cyber-accent)]">[ AI // CAPABILITIES ]</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--cyber-muted)]">
          I design and ship AI features that sit naturally in products — grounded answers, safe
          boundaries, and UX that feels helpful rather than gimmicky.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {aiSkillTags.map((tag) => (
            <span
              key={tag}
              className="cyber-tag border-[var(--cyber-purple)]/40 text-[var(--cyber-purple)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[var(--cyber-accent)]">
        BASED IN {basedIn.toUpperCase()} · BUILDING FOR THE WEB
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <CyberPrimaryLink href="/projects">View Deployments</CyberPrimaryLink>
        <CyberOutlineLink href="/skills">Stack Matrix</CyberOutlineLink>
        <CyberOutlineLink href="/contact">Open Channel</CyberOutlineLink>
      </div>
    </div>
  )
}
