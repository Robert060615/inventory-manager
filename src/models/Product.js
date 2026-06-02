/**
 * @file Mongoose model for inventory products.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */
// BR-2: mongoose-history and mongoose-history-plugin were evaluated but not adopted.
// Both rely on document-level hooks (pre save/remove) that are bypassed by the
// query-level methods used in productController (findByIdAndUpdate, findByIdAndDelete),
// and neither supports capturing the authenticated userId cleanly.
// Change events are instead logged explicitly via ProductHistory in productController.

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
