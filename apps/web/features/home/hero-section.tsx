'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowDown, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/badge'

const HeroScene = dynamic(() => import('@/features/hero-3d/hero-scene'), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full rounded-2xl md:h-[420px]" />,
})

type HeroProps = {
  name: string
  title: string
  intro: string
}

export default function HeroSection({ name, title, intro }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="noise-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="size-3.5" />
            Available for select opportunities
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-semibold tracking-tight md:text-6xl"
          >
            Hi, I&apos;m {name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground md:text-xl"
          >
            {title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            {intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glow-ring relative min-h-[320px] overflow-hidden rounded-2xl border border-border bg-card/60 md:min-h-[420px]"
        >
          <HeroScene />
        </motion.div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl justify-center px-4">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
        >
          <span>Scroll</span>
          <ArrowDown className="size-4" />
        </motion.div>
      </div>
    </section>
  )
}
