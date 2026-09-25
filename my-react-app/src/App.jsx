import { useState } from 'react'

function App() {
  const [result, setResult] = useState('')

  async function getMatchup(type) {
    try {
      const response = await fetch(`http://localhost:5001/api/type/${encodeURIComponent(type.toLowerCase())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not get Pokémon type data.')
      }

      const resistedTypes = data.half_damage_to.length
        ? data.half_damage_to.join(', ')
        : 'none'
      const superEffectiveTypes = data.double_damage_from.length
        ? data.double_damage_from.join(', ')
        : 'none'

      return `Against this ${type}-type Pokémon, your ${resistedTypes} attacks are resisted (deal half damage). Use ${superEffectiveTypes} attacks for double damage.`
    } catch (error) {
      console.error('Matchup request failed:', error)
      return error.message || 'Could not connect to the backend. Make sure it is running.'
    }
  }

  async function handleTypeClick(type) {
    const response = await getMatchup(type)
    setResult(response)
  }

  const types = [
    { name: 'Fire', color: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Water', color: 'bg-sky-500 hover:bg-sky-600' },
    { name: 'Grass', color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Ground', color: 'bg-amber-700 hover:bg-amber-800' },
  ]

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-12 text-slate-800">
      <section className="w-full max-w-lg rounded-3xl border-4 border-slate-800 bg-white p-8 text-center shadow-[0_8px_0_#1e293b] sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-800 bg-red-500 shadow-[inset_0_-6px_0_rgba(0,0,0,0.12)]">
          <span className="h-6 w-6 rounded-full border-4 border-slate-800 bg-white" aria-hidden="true" />
          <span className="sr-only">Poké Ball</span>
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-600">Trainer&apos;s guide</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pokémon Battle Assistant</h1>
        <p className="mt-3 text-slate-600">What type of Pokémon are you fighting?</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {types.map((type) => (
            <button
              className={`${type.color} rounded-xl border-2 border-slate-800 px-4 py-3 font-bold text-white shadow-[0_4px_0_#1e293b] transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_#1e293b] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-red-400 active:translate-y-1 active:shadow-none`}
              key={type.name}
              onClick={() => handleTypeClick(type.name)}
              type="button"
            >
              {type.name}
            </button>
          ))}
        </div>

        {result && (
          <p className="mt-6 font-semibold text-slate-700" aria-live="polite">
            {result}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
