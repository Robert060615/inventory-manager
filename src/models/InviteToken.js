/**
 * @file Mongoose model for user invite tokens.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 */

import mongoose from 'mongoose'

const inviteTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model('InviteToken', inviteTokenSchema)
