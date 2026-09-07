import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { getAuthBaseUrl } from '@/lib/auth-base-url'

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string', required: false },
      },
    }),
  ],
})
