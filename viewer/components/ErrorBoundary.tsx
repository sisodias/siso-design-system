'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: unknown) => void
}

interface State {
  err: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { err: false }

  static getDerivedStateFromError(): State {
    return { err: true }
  }

  componentDidCatch(error: unknown) {
    if (this.props.onError) this.props.onError(error)
    else console.error('[ErrorBoundary] Render failed:', error)
  }

  render() {
    return this.state.err ? this.props.fallback : this.props.children
  }
}
