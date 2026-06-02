/**
 * @file Mongoose model for product change history (BR-2).
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import mongoose from 'mongoose'

// Evaluated mongoose-history and mongoose-history-plugin, but both rely on
// document-level hooks (pre save/remove) that are bypassed by the query-level
// methods used in productController (findByIdAndUpdate, findByIdAndDelete).
// They also lack clean built-in userId tracking. A custom model gives us
// full control over the schema, explicit userId capture, and a clean snapshot
// field for the undo feature.

const changeSchema = new mongoose.Schema({
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
}, { _id: false })

const productHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Cached so deleted products still have a readable name/size in the history log.
  productName: {
    type: String,
    default: '',
  },
  productSize: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete'],
    required: true,
  },
  performedBy: {
    userId: String,
    email: String,
  },
  // Populated for 'update' entries — only fields that actually changed.
  changes: [changeSchema],
  // Full document snapshot saved on 'delete' to support future undo.
  snapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, { timestamps: true })

export default mongoose.model('ProductHistory', productHistorySchema)
