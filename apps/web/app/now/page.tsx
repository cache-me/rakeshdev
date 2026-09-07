import { apiClient } from '@/lib/api'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Now — Rakesh',
  description: 'What Rakesh is focused on right now.',
  path: '/now',
})

export default async function NowPage() {
  const res = await apiClient.now.get()
  const now = res.status === 200 && res.body.success ? res.body.data : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Now</h1>
      <p className="mt-8 leading-relaxed text-muted-foreground">{now?.content}</p>
    </div>
  )
}
