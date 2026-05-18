/**
 * @file History controller — fetches and renders the product change history log.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.2.0
 */

import ProductHistory from '../models/ProductHistory.js'
import Product from '../models/Product.js'

/**
 * Renders the full product change history log, optionally filtered by product.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getHistory = async (req, res) => {
  try {
    const { productId } = req.query
    const filter = productId ? { productId } : {}
    const entries = await ProductHistory.find(filter).sort({ createdAt: -1 })
    const products = await Product.find({}).select('_id name category').sort({ category: 1, name: 1 })
    res.render('pages/history/index', {
      title: 'Ändringshistorik',
      entries,
      products,
      selectedProductId: productId || '',
      success: req.flash('success')[0] || null,
      error: req.flash('error')[0] || null,
    })
  } catch (err) {
    console.error(err)
    res.render('pages/history/index', {
      title: 'Ändringshistorik',
      entries: [],
      products: [],
      selectedProductId: '',
      success: null,
      error: null,
    })
  }
}

/**
 * Renders the change history for a single product.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params
    const entries = await ProductHistory.find({ productId: id }).sort({ createdAt: -1 })
    const products = await Product.find({}).select('_id name category').sort({ category: 1, name: 1 })
    res.render('pages/history/index', {
      title: 'Produkthistorik',
      entries,
      products,
      selectedProductId: id,
      success: req.flash('success')[0] || null,
      error: req.flash('error')[0] || null,
    })
  } catch (err) {
    console.error(err)
    res.render('pages/history/index', {
      title: 'Produkthistorik',
      entries: [],
      products: [],
      selectedProductId: req.params.id,
      success: null,
      error: null,
    })
  }
}

/**
 * Undoes a specific history entry (BR-3).
 *
 * - create → deletes the product that was created
 * - update → restores the changed fields to their previous values
 * - delete → recreates the product from the stored snapshot
 *
 * Each undo operation is itself logged as a new history entry so the
 * audit trail remains complete.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
export const undoChange = async (req, res) => {
  try {
    const entry = await ProductHistory.findById(req.params.id)
    if (!entry) {
      req.flash('error', 'Historik-entryn hittades inte.')
      return res.redirect('/history')
    }

    const performedBy = { userId: res.locals.user.id, email: res.locals.user.email }

    if (entry.action === 'create') {
      const product = await Product.findById(entry.productId)
      if (!product) {
        req.flash('error', 'Produkten finns inte längre.')
        return res.redirect('/history')
      }
      await ProductHistory.create({
        productId: product._id,
        productName: product.name || product.category,
        action: 'delete',
        performedBy,
        changes: [],
        snapshot: product.toObject(),
      })
      await product.deleteOne()

    } else if (entry.action === 'update') {
      const product = await Product.findById(entry.productId)
      if (!product) {
        req.flash('error', 'Produkten finns inte längre.')
        return res.redirect('/history')
      }
      const restore = {}
      const reverseChanges = []
      for (const change of entry.changes) {
        restore[change.field] = change.oldValue
        reverseChanges.push({ field: change.field, oldValue: change.newValue, newValue: change.oldValue })
      }
      await Product.findByIdAndUpdate(entry.productId, restore)
      await ProductHistory.create({
        productId: entry.productId,
        productName: product.name || product.category,
        action: 'update',
        performedBy,
        changes: reverseChanges,
        snapshot: null,
      })

    } else if (entry.action === 'delete') {
      if (!entry.snapshot) {
        req.flash('error', 'Ingen snapshot tillgänglig för återställning.')
        return res.redirect('/history')
      }
      const snapshot = { ...entry.snapshot }
      delete snapshot.__v
      delete snapshot.createdAt
      delete snapshot.updatedAt
      const product = await Product.create(snapshot)
      await ProductHistory.create({
        productId: product._id,
        productName: product.name || product.category,
        action: 'create',
        performedBy,
        changes: [],
        snapshot: null,
      })
    }

    req.flash('success', 'Ändringen har ångrats.')
    return res.redirect('/history')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Ett fel uppstod vid ångringen.')
    return res.redirect('/history')
  }
}
