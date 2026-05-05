/**
 * @file Product controller — handles CRUD operations for inventory products.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 */

import Product from '../models/Product.js'

const CATEGORIES = ['Overall', 'Märke', 'Tröja', 'Övrigt']
const SIZES = ['', 'XS', 'S', 'M', 'L', 'XL']

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
  if (!name || !name.trim()) errors.push('Namn är obligatoriskt.')
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
    await Product.create({
      name: name.trim(),
      category,
      size: size || '',
      quantity: Number(quantity),
      image: image || ''
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
  if (!name || !name.trim()) errors.push('Namn är obligatoriskt.')
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
    await Product.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      category,
      size: size || '',
      quantity: Number(quantity),
      image: image || ''
    })
    res.redirect('/products')
  } catch (err) {
    console.error(err)
    res.redirect('/products')
  }
}

export const postDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
  } catch (err) {
    console.error(err)
  }
  res.redirect('/products')
}
