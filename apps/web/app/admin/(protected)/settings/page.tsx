'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { adminClient } from '@/lib/api'

import { AdminSubpage } from '@/features/admin/admin-subpage'

export default function AdminSettingsPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    heroIntro: '',
    email: '',
    location: '',
    availability: '',
    nowContent: '',
    seoTitle: '',
    seoDescription: '',
  })

  const settings = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const res = await adminClient.getSiteSettings()
      if (res.status !== 200 || !res.body.success) throw new Error('Failed')
      return res.body.data as typeof form
    },
  })

  useEffect(() => {
    if (settings.data) {
      setForm({
        name: settings.data.name ?? '',
        title: settings.data.title ?? '',
        tagline: settings.data.tagline ?? '',
        bio: settings.data.bio ?? '',
        heroIntro: settings.data.heroIntro ?? '',
        email: settings.data.email ?? '',
        location: settings.data.location ?? '',
        availability: settings.data.availability ?? '',
        nowContent: settings.data.nowContent ?? '',
        seoTitle: settings.data.seoTitle ?? '',
        seoDescription: settings.data.seoDescription ?? '',
      })
    }
  }, [settings.data])

  const save = useMutation({
    mutationFn: () =>
      adminClient.updateSiteSettings({
        body: { ...form, socialLinks: {}, profileImageUrl: null, resumeUrl: null },
      }),
    onSuccess: () => {
      toast.success('Settings updated')
      void qc.invalidateQueries({ queryKey: ['admin', 'settings'] })
    },
    onError: () => toast.error('Update failed'),
  })

  return (
    <AdminSubpage title="Site settings">
      <form
        className="grid max-w-2xl gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          save.mutate()
        }}
      >
        {(
          [
            ['name', 'Name'],
            ['title', 'Title'],
            ['tagline', 'Tagline'],
            ['email', 'Email'],
            ['location', 'Location'],
            ['availability', 'Availability'],
            ['seoTitle', 'SEO title'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="grid gap-2">
            <Label>{label}</Label>
            <Input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        {(
          [
            ['heroIntro', 'Hero intro'],
            ['bio', 'Bio'],
            ['nowContent', 'Now page content'],
            ['seoDescription', 'SEO description'],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="grid gap-2">
            <Label>{label}</Label>
            <Textarea
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <Button type="submit" disabled={save.isPending}>
          Save settings
        </Button>
      </form>
    </AdminSubpage>
  )
}
