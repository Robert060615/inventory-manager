import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'

const email = process.env.SEED_EMAIL
const password = process.env.SEED_PASSWORD

if (!email || !password) {
  console.error('Error: SEED_EMAIL and SEED_PASSWORD environment variables are required. Set them in .env before running seed.')
  process.exit(1)
}

/**
 * Seeds the database with an initial admin user from environment variables.
 */
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })

  const existing = await User.findOne({ email })

  if (existing) {
    console.log('Konto finns redan:', email)
    await mongoose.disconnect()
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  await User.create({ email, hashedPassword })

  console.log('Konto skapat:', email)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
