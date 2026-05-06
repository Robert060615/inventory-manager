/**
 * @file Mongoose model for inventory products.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 */

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    trim: true,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
