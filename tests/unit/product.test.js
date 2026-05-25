/**
 * @file Enhetstester för Product-modellen.
 *
 * Testar Mongoose-schemat direkt — utan att gå via controllers eller HTTP.
 * Databasen tillhandahålls av MongoMemoryServer (se tests/setup.js).
 *
 * OBS: Fältet `name` har required: false i schemat eftersom Overall-produkter
 * inte har ett fritext-namn. Namnvalidering sker i productController, inte i
 * Mongoose-schemat. Det testas i integrationstesterna.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { describe, it, expect } from 'vitest'
import Product from '../../src/models/Product.js'

describe('Product-modellen', () => {
  it('skapar en produkt med giltiga värden och sparar alla fält korrekt', async () => {
    const product = await Product.create({
      name: 'Teströja',
      category: 'Tröja',
      size: 'M',
      quantity: 10,
      image: 'https://example.com/img.jpg',
    })

    expect(product._id).toBeDefined()
    expect(product.name).toBe('Teströja')
    expect(product.category).toBe('Tröja')
    expect(product.size).toBe('M')
    expect(product.quantity).toBe(10)
    expect(product.image).toBe('https://example.com/img.jpg')
    expect(product.createdAt).toBeDefined()
    expect(product.updatedAt).toBeDefined()
  })

  // name har required: false i schemat — fältet är valfritt och defaultar till ''.
  // Namnkravet för icke-Overall-kategorier hanteras av productController.
  it('skapar en produkt utan name och sätter name till tom sträng (name är ej required i schemat)', async () => {
    const product = await Product.create({ category: 'Overall' })

    expect(product.name).toBe('')
  })

  it('kastar valideringsfel när category saknas (category är required)', async () => {
    await expect(
      Product.create({ name: 'Utan kategori', quantity: 5 })
    ).rejects.toThrow()
  })

  it('kastar valideringsfel när quantity är negativt (min: 0)', async () => {
    await expect(
      Product.create({ name: 'Negativ', category: 'Overall', quantity: -1 })
    ).rejects.toThrow()
  })

  it('sätter quantity till 0 som standardvärde när inget quantity anges', async () => {
    const product = await Product.create({ category: 'Overall' })

    expect(product.quantity).toBe(0)
  })
})
