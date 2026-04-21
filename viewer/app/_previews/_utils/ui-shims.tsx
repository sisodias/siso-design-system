// Shims for third-party / cross-component imports that don't exist as 21st.dev folders.

import * as React from 'react'
import { cn } from './cn'

// tabs shim
export const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string }>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props} />
  )
)
Tabs.displayName = 'Tabs'

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-neutral-800 p-1 text-neutral-400', className)} {...props} />
  )
)
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-2 ring-offset-background focus-visible:outline-none', className)} {...props} />
  )
)
TabsContent.displayName = 'TabsContent'

// scroll-area shim
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('overflow-auto', className)} {...props} />
  )
)
ScrollArea.displayName = 'ScrollArea'

// separator shim
export const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        'shrink-0 bg-neutral-800',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'

// button shim
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn('inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium', className)} {...props} />
  )
)
Button.displayName = 'Button'
