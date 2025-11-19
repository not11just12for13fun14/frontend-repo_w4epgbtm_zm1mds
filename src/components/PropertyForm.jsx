import { useState } from 'react'

export default function PropertyForm({ onSubmit }) {
  const [form, setForm] = useState({
    owner_name: '',
    owner_email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'single_family',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    asking_price: '',
    arv: '',
    repair_cost: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        sqft: form.sqft ? Number(form.sqft) : null,
        asking_price: Number(form.asking_price || 0),
        arv: form.arv ? Number(form.arv) : null,
        repair_cost: form.repair_cost ? Number(form.repair_cost) : 0,
      }
      await onSubmit(payload)
    } catch (err) {
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-2 text-sm text-red-100 bg-red-600/60 rounded">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <input name="owner_name" placeholder="Owner name" className="input" onChange={handleChange} value={form.owner_name} required />
        <input name="owner_email" placeholder="Owner email" className="input" onChange={handleChange} value={form.owner_email} />
        <input name="address" placeholder="Address" className="input md:col-span-2" onChange={handleChange} value={form.address} required />
        <input name="city" placeholder="City" className="input" onChange={handleChange} value={form.city} required />
        <input name="state" placeholder="State" className="input" onChange={handleChange} value={form.state} required />
        <input name="zip_code" placeholder="ZIP" className="input" onChange={handleChange} value={form.zip_code} required />
        <select name="property_type" className="input" onChange={handleChange} value={form.property_type}>
          <option value="single_family">Single Family</option>
          <option value="multi_family">Multi Family</option>
          <option value="condo">Condo</option>
          <option value="townhome">Townhome</option>
          <option value="land">Land</option>
        </select>
        <input name="bedrooms" placeholder="Beds" className="input" onChange={handleChange} value={form.bedrooms} />
        <input name="bathrooms" placeholder="Baths" className="input" onChange={handleChange} value={form.bathrooms} />
        <input name="sqft" placeholder="Sqft" className="input" onChange={handleChange} value={form.sqft} />
        <input name="asking_price" placeholder="Asking Price" className="input" onChange={handleChange} value={form.asking_price} required />
        <input name="arv" placeholder="ARV" className="input" onChange={handleChange} value={form.arv} />
        <input name="repair_cost" placeholder="Repair Cost" className="input" onChange={handleChange} value={form.repair_cost} />
        <textarea name="notes" placeholder="Notes" className="input md:col-span-2" onChange={handleChange} value={form.notes} />
      </div>
      <button disabled={loading} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
        {loading ? 'Analyzing…' : 'Submit Property'}
      </button>
      <style>{`
        .input { @apply bg-slate-900/50 border border-slate-700/60 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50;}
      `}</style>
    </form>
  )
}
