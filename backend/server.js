const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/api/type/:name', async (req, res) => {
  const type = req.params.name.toLowerCase()

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(type)}/`)

    if (!response.ok) {
      return res.status(response.status).json({ error: `PokéAPI could not find type "${type}".` })
    }

    const data = await response.json()
    res.json({
      half_damage_to: data.damage_relations.half_damage_to.map((type) => type.name),
      double_damage_from: data.damage_relations.double_damage_from.map((type) => type.name),
    })
  } catch (error) {
    console.error('PokéAPI request failed:', error)
    res.status(502).json({ error: 'Could not retrieve Pokémon type data.' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`)
})
