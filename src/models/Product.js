/**
 * @file Mongoose model for inventory products.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 *
 * Change history (BR-2): Both mongoose-history and mongoose-history-plugin were
 * evaluated. Neither was adopted because they rely on document-level hooks
 * (pre save / pre remove) that are silently bypassed by the query-level methods
 * used in productController (findByIdAndUpdate, findByIdAndDelete), and neither
 * offers clean built-in support for capturing the authenticated userId.
 * Instead, change events are logged explicitly in productController via the
 * ProductHistory model, which gives full control over the diff, the userId, and
 * the full-document snapshot needed for the future undo feature.
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
