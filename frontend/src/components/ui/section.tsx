import { ReactNode } from 'react'

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="section">
      <div className="container space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-2 text-base-200">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
