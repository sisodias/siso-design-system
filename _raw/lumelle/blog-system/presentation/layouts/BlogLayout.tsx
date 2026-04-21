import type { ReactNode } from 'react'
import { MarketingLayout, type NavItem } from '@/layouts/MarketingLayout'

type BlogLayoutProps = {
  children: ReactNode
  navItems?: NavItem[]
  subtitle?: string
}

export const BlogLayout = ({ children, navItems = [], subtitle = 'Journal' }: BlogLayoutProps) => {
  return (
    <MarketingLayout navItems={navItems} subtitle={subtitle}>
      {children}
    </MarketingLayout>
  )
}

export default BlogLayout
