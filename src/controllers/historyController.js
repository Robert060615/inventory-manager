/**
 * @file History controller — fetches and renders the product change history log.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import ProductHistory from '../models/ProductHistory.js'
import Product from '../models/Product.js'

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
      selectedProductId: productId || ''
    })
  } catch (err) {
    console.error(err)
    res.render('pages/history/index', {
      title: 'Ändringshistorik',
      entries: [],
      products: [],
      selectedProductId: ''
    })
  }
}

export const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params
    const entries = await ProductHistory.find({ productId: id }).sort({ createdAt: -1 })
    const products = await Product.find({}).select('_id name category').sort({ category: 1, name: 1 })
    res.render('pages/history/index', {
      title: 'Produkthistorik',
      entries,
      products,
      selectedProductId: id
    })
  } catch (err) {
    console.error(err)
    res.render('pages/history/index', {
      title: 'Produkthistorik',
      entries: [],
      products: [],
      selectedProductId: req.params.id
    })
  }
}
