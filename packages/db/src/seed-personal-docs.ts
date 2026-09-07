import { copyFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Database } from './index.js'
import { personalDocuments } from './schema/personal-documents.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')
const storageRoot = path.join(repoRoot, 'apps/api/storage/personal')

const ASSET_MAP: Record<string, string[]> = {
  'aadhaar.png': [
    path.join(
      repoRoot,
      '.cursor/projects/home-user-Prodios-portfolio/assets/adhar-c9cc5283-b250-4632-a9a3-6d9c0408449e.png',
    ),
    path.join(
      process.env.HOME ?? '',
      '.cursor/projects/home-user-Prodios-portfolio/assets/adhar-c9cc5283-b250-4632-a9a3-6d9c0408449e.png',
    ),
  ],
  'pan.png': [
    path.join(
      repoRoot,
      '.cursor/projects/home-user-Prodios-portfolio/assets/pancard-16050c4d-5089-447e-b7a0-7b541a7ab265.png',
    ),
    path.join(
      process.env.HOME ?? '',
      '.cursor/projects/home-user-Prodios-portfolio/assets/pancard-16050c4d-5089-447e-b7a0-7b541a7ab265.png',
    ),
  ],
  'bank-passbook.png': [
    path.join(
      repoRoot,
      '.cursor/projects/home-user-Prodios-portfolio/assets/bank_passbook-b471d1bd-a417-4aa8-8d91-6801c5df2b31.png',
    ),
    path.join(
      process.env.HOME ?? '',
      '.cursor/projects/home-user-Prodios-portfolio/assets/bank_passbook-b471d1bd-a417-4aa8-8d91-6801c5df2b31.png',
    ),
  ],
}

async function copyFirstAvailable(filename: string, candidates: string[]) {
  await mkdir(storageRoot, { recursive: true })
  const dest = path.join(storageRoot, filename)
  for (const src of candidates) {
    if (!src) continue
    try {
      await access(src)
      await copyFile(src, dest)
      return true
    } catch {
      /* try next */
    }
  }
  console.warn('[seed] personal doc asset not found for', filename)
  return false
}

export async function seedPersonalDocuments(db: Database) {
  const existing = await db.select().from(personalDocuments).limit(1)
  if (existing.length > 0) return

  for (const [filename, sources] of Object.entries(ASSET_MAP)) {
    await copyFirstAvailable(filename, sources)
  }

  await db.insert(personalDocuments).values([
    {
      docType: 'aadhaar',
      title: 'Aadhaar Card',
      description: 'Government of India identity document.',
      storagePath: 'aadhaar.png',
      sortOrder: 1,
    },
    {
      docType: 'pan',
      title: 'PAN Card',
      description: 'Income Tax Department permanent account number card.',
      storagePath: 'pan.png',
      sortOrder: 2,
    },
    {
      docType: 'bank',
      title: 'Bank Passbook',
      description: 'Canara Bank account passbook.',
      storagePath: 'bank-passbook.png',
      sortOrder: 3,
    },
  ])
}
