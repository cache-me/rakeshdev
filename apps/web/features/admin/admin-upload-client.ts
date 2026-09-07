export async function uploadProjectCoverImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/admin/upload/project-image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  const body = (await res.json()) as {
    success?: boolean
    data?: { url?: string }
    message?: string
  }

  if (!res.ok) {
    throw new Error(body.message ?? `Upload failed (${res.status})`)
  }

  const url = body.data?.url
  if (!url) throw new Error('Upload response missing URL')
  return url
}
