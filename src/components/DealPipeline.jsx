import { useMemo } from 'react'

export default function DealPipeline({ stage }) {
  const steps = useMemo(() => [
    { key: 'submitted', label: 'Submitted' },
    { key: 'matched', label: 'Matched' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'closed', label: 'Closed' },
  ], [])

  const currentIndex = steps.findIndex(s => s.key === stage)

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex-1">
          <div className={`h-2 rounded-full ${i <= currentIndex ? 'bg-green-500' : 'bg-slate-600'}`}></div>
          <div className={`mt-2 text-xs ${i <= currentIndex ? 'text-green-300' : 'text-slate-400'}`}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
