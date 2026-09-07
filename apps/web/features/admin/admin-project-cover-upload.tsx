'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import { CyberOutlineButton } from '@/features/cyber/cyber-buttons'
import { cn } from '@/lib/utils'

import { uploadProjectCoverImage } from './admin-upload-client'

type Props = {
  value: string
  onChange: (url: string) => void
}

export function AdminProjectCoverUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      setUploading(true)
      try {
        const url = await uploadProjectCoverImage(file)
        onChange(url)
        toast.success('Cover image uploaded')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => void onDrop(files),
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  })

  return (
    <div className="mt-4 rounded border border-[var(--cyber-border)] bg-[#060a0f] p-3 sm:col-span-2">
      <p className="hud-label">PROJECT_COVER // IMAGE_UPLOAD</p>
      <div
        {...getRootProps()}
        className={cn(
          'mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[var(--cyber-border)] p-4 font-mono text-[9px] text-[var(--cyber-muted)] transition',
          isDragActive && 'border-[var(--cyber-accent)] bg-[var(--cyber-accent-dim)]',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <span className="text-[var(--cyber-accent)]">UPLOADING…</span>
        ) : isDragActive ? (
          <span className="text-[var(--cyber-accent)]">DROP_IMAGE_HERE</span>
        ) : (
          <>
            <span>DRAG & DROP or CLICK — JPG, PNG, WebP, GIF (max 5MB)</span>
          </>
        )}
      </div>
      {value ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Project cover preview"
            className="h-20 w-32 rounded border border-[var(--cyber-border)] object-cover"
          />
          <p className="max-w-xs truncate font-mono text-[9px] text-[var(--cyber-muted)]">
            {value}
          </p>
          <CyberOutlineButton
            type="button"
            className="text-[9px]"
            onClick={() => onChange('')}
          >
            CLEAR_COVER
          </CyberOutlineButton>
        </div>
      ) : null}
    </div>
  )
}
