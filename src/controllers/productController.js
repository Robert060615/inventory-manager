/**
 * @file Product controller — handles CRUD operations for inventory products.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 */

import Product from '../models/Product.js'
import ProductHistory from '../models/ProductHistory.js'

const TRACKED_FIELDS = ['name', 'category', 'size', 'quantity', 'image']

const CATEGORIES = ['Overall', 'Märke', 'Tröja', 'Övrigt']
const SIZES = ['', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.render('pages/products/index', {
      title: 'Produkter',
      products,
      selectedCategory: category || '',
      categories: CATEGORIES
    })
  } catch (err) {
    console.error(err)
    res.render('pages/products/index', {
      title: 'Produkter',
      products: [],
      selectedCategory: '',
      categories: CATEGORIES
    })
  }
}

export const getNewProduct = (req, res) => {
  const error = req.flash('error')[0] || null
  res.render('pages/products/new', {
    title: 'Ny produkt',
    error,
    values: {},
    categories: CATEGORIES,
    sizes: SIZES
  })
}

export const postProduct = async (req, res) => {
  const { name, category, size, quantity, image } = req.body

  const errors = []
  if (category !== 'Overall' && (!name || !name.trim())) errors.push('Namn är obligatoriskt.')
  if (!category || !category.trim()) errors.push('Kategori är obligatorisk.')
  if (quantity === undefined || quantity === '' || Number(quantity) < 0) {
    errors.push('Antal måste vara 0 eller mer.')
  }

  if (errors.length) {
    return res.render('pages/products/new', {
      title: 'Ny produkt',
      error: errors[0],
      values: { name, category, size, quantity, image },
      categories: CATEGORIES,
      sizes: SIZES
    })
  }

  try {
    const product = await Product.create({
      name: name ? name.trim() : '',
      category,
      size: size || '',
      quantity: Number(quantity),
      image: image || ''
    })
    await ProductHistory.create({
      productId: product._id,
      productName: product.name || product.category,
      action: 'create',
      performedBy: { userId: res.locals.user.id, email: res.locals.user.email },
      changes: [],
      snapshot: null
    })
    res.redirect('/products')
  } catch (err) {
    console.error(err)
    res.render('pages/products/new', {
      title: 'Ny produkt',
      error: 'Ett fel uppstod. Försök igen.',
      values: { name, category, size, quantity, image },
      categories: CATEGORIES,
      sizes: SIZES
    })
  }
}

export const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.redirect('/products')
    const error = req.flash('error')[0] || null
    res.render('pages/products/edit', {
      title: 'Redigera produkt',
      error,
      product,
      categories: CATEGORIES,
      sizes: SIZES
    })
  } catch (err) {
    console.error(err)
    res.redirect('/products')
  }
}

export const postUpdateProduct = async (req, res) => {
  const { name, category, size, quantity, image } = req.body

  const errors = []
  if (category !== 'Overall' && (!name || !name.trim())) errors.push('Namn är obligatoriskt.')
  if (!category || !category.trim()) errors.push('Kategori är obligatorisk.')
  if (quantity === undefined || quantity === '' || Number(quantity) < 0) {
    errors.push('Antal måste vara 0 eller mer.')
  }

  if (errors.length) {
    return res.render('pages/products/edit', {
      title: 'Redigera produkt',
      error: errors[0],
      product: {
        _id: req.params.id,
        name,
        category,
        size: size || '',
        quantity: quantity !== undefined ? quantity : 0,
        image: image || ''
      },
      categories: CATEGORIES,
      sizes: SIZES
    })
  }

  try {
    const existing = await Product.findById(req.params.id)
    if (!existing) return res.redirect('/products')

    const newValues = {
      name: name ? name.trim() : '',
      category,
      size: size || '',
      quantity: Number(quantity),
      image: image || ''
    }

    const changes = []
    for (const field of TRACKED_FIELDS) {
      const oldVal = existing[field]
      const newVal = newValues[field]
      if (oldVal !== newVal) {
        changes.push({ field, oldValue: oldVal, newValue: newVal })
      }
    }

    await Product.findByIdAndUpdate(req.params.id, newValues)

    if (changes.length) {
      await ProductHistory.create({
        productId: existing._id,
        productName: newValues.name || newValues.category,
        action: 'update',
        performedBy: { userId: res.locals.user.id, email: res.locals.user.email },
        changes,
        snapshot: null
      })
    }

    res.redirect('/products')
  } catch (err) {
    console.error(err)
    res.redirect('/products')
  }
}

export const postDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      await ProductHistory.create({
        productId: product._id,
        productName: product.name || product.category,
        action: 'delete',
        performedBy: { userId: res.locals.user.id, email: res.locals.user.email },
        changes: [],
        snapshot: product.toObject()
      })
      await product.deleteOne()
    }
  } catch (err) {
    console.error(err)
  }
  res.redirect('/products')
}
