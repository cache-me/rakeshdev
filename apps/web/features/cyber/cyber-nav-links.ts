export const cyberNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/education', label: 'Education' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/ai', label: 'AI Copilot' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' },
] as const

export function cyberBrandLogo(brandName: string) {
  const first = brandName.split(' ')[0]?.toUpperCase() ?? 'DEV'
  return `${first} ARCHITECT.IO`
}
