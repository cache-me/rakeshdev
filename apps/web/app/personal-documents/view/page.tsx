import CyberPage from '@/features/cyber/cyber-page'
import PersonalDocumentsViewer from '@/features/personal-docs/personal-documents-viewer'
import { getSiteBrandName } from '@/lib/site-brand'

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function PersonalDocumentsViewPage({ searchParams }: PageProps) {
  const brandName = await getSiteBrandName()
  const params = await searchParams
  const token = typeof params.token === 'string' ? params.token : ''

  return (
    <CyberPage brandName={brandName}>
      <PersonalDocumentsViewer initialToken={token} />
    </CyberPage>
  )
}
