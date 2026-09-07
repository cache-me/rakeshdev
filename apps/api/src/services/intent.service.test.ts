import { describe, expect, it } from 'vitest'

import { detectIntent } from './intent.service'

describe('detectIntent', () => {
  it('detects projects intent', () => {
    expect(detectIntent('Show me projects')).toBe('VIEW_PROJECTS')
  })

  it('detects resume intent', () => {
    expect(detectIntent('Where can I download the resume?')).toBe('VIEW_RESUME')
  })

  it('detects skills search', () => {
    expect(detectIntent('Does he know Three.js?')).toBe('SEARCH_SKILLS')
  })
})
