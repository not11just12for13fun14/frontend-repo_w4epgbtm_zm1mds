import { useState } from 'react'
import Hero from './components/Hero'
import PropertyForm from './components/PropertyForm'
import DealPipeline from './components/DealPipeline'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [result, setResult] = useState(null)
  const [stage, setStage] = useState('submitted')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitProperty = async (payload) => {
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t)
      }
      const data = await res.json()
      setResult(data)
      setStage(data.rank ? 'matched' : 'submitted')
    } catch (e) {
      setError(e.message || 'Failed to submit property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.15),transparent),radial-gradient(40%_30%_at_20%_10%,rgba(16,185,129,0.1),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        {!showForm && !result && (
          <Hero onStart={() => setShowForm(true)} />
        )}

        {showForm && !result && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Submit a Property</h2>
              <PropertyForm onSubmit={submitProperty} />
              {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
              {loading && <p className="mt-3 text-sm text-blue-300">Analyzing your deal…</p>}
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">What you get</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Instant analysis (MAO, discount, spread)</li>
                <li>• Deal ranking (A–D)</li>
                <li>• Auto-matching to verified buyers</li>
                <li>• Simple pipeline: submitted → matched → reviewed → closed</li>
                <li>• Optional JV support and contracts</li>
              </ul>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Deal Created</h2>
                  <p className="text-slate-300 text-sm">ID: {result.deal_id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300">Rank</span>
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl font-bold ${result.rank === 'A' ? 'bg-emerald-600/40 text-emerald-200' : result.rank === 'B' ? 'bg-blue-600/40 text-blue-200' : result.rank === 'C' ? 'bg-amber-600/40 text-amber-200' : 'bg-slate-600/40 text-slate-200'}`}>{result.rank}</span>
                </div>
              </div>
              <div className="mt-6">
                <DealPipeline stage={stage} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
                <h3 className="text-lg font-semibold">Analysis</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(result.analysis || {}).map(([k, v]) => (
                    <div key={k} className="bg-slate-800/60 rounded-lg p-3">
                      <div className="text-slate-400 capitalize">{k.replaceAll('_',' ')}</div>
                      <div className="text-slate-100 font-semibold">{typeof v === 'number' ? (k.includes('pct') ? `${v}%` : `$${v.toLocaleString()}`) : String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
                <h3 className="text-lg font-semibold">Matched Buyers</h3>
                {result.matched_buyers?.length ? (
                  <ul className="mt-4 divide-y divide-slate-800/80">
                    {result.matched_buyers.map((b) => (
                      <li key={b.buyer_id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{b.name}</div>
                          <div className="text-xs text-slate-400">{b.email}</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-emerald-600/30 text-emerald-100">Score {b.score.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-slate-300 text-sm">No buyers matched yet. We’ll keep looking and notify you when we find a fit.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/70" onClick={() => { setResult(null); setShowForm(true); }}>Submit Another</button>
              <a className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/70" href="/test">Connection Test</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
