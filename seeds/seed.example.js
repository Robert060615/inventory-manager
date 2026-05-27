import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'

/**
 * Seeds the database with an initial admin user.
 *
 * INSTRUKTIONER:
 * 1. Kopiera den här filen till seed.js
 * 2. Byt ut exempelvärdena nedan mot riktiga uppgifter
 * 3. Kör: node seeds/seed.js
 *
 * OBS: seed.js är gitignorerad och ska INTE pushas till repot.
 */
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })

  const email = 'admin@example.com' // Byt till din admin-e-post
  const existing = await User.findOne({ email })

  if (existing) {
    console.log('Testkonto finns redan:', email)
    await mongoose.disconnect()
    return
  }

  const hashedPassword = await bcrypt.hash('byt-ut-detta-losenord', 12) // Byt till ett säkert lösenord
  await User.create({ email, hashedPassword })

  console.log('Testkonto skapat:', email)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
