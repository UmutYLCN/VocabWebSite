import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{ className?: string }>

export default function GlassCard({ className = '', children }: Props) {
  return <div className={`glass ${className}`}>{children}</div>
}

