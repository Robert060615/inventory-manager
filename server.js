/**
 * @file Server entry point — laddar miljövariabler, kopplar upp mot databasen
 *       och startar HTTP-lyssnaren.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.4.0
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

await mongoose.connect(process.env.MONGODB_URI)
console.log('MongoDB connected')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`)
})
