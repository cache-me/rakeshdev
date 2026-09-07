import { apiClient } from '@/lib/api'

export async function getSiteBrandName() {
  const res = await apiClient.site.getSettings()
  if (res.status === 200 && res.body.success && res.body.data?.name) {
    return res.body.data.name
  }
  return 'Rakesh'
}
