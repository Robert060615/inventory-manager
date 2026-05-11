/**
 * @file Mongoose model for application users.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.2.0
 */

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
})

export default mongoose.model('User', userSchema)
