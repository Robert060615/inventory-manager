/**
 * @file Integrationstester för ångra-funktionen (BR-3).
 *
 * Testar POST /history/:id/undo för action-typerna 'update' och 'delete',
 * samt felfall med ogiltigt historik-id.
 *
 * Testdata (produkter + historikposter) skapas direkt i databasen inför
 * varje test och rensas av afterEach i setup.js.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import app from '../../app.js'
import Product from '../../src/models/Product.js'
import ProductHistory from '../../src/models/ProductHistory.js'

const PERFORMED_BY = { userId: 'undo-tester-id', email: 'undo-tester@spiik.se' }

let authCookie

beforeAll(() => {
  const token = jwt.sign(
    { id: PERFORMED_BY.userId, email: PERFORMED_BY.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  authCookie = `token=${token}`
})

describe('POST /history/:id/undo — action: update', () => {
  it('återställer produkten till värdet innan uppdateringen', async () => {
    // Skapa produkt i ursprungsläge
    const product = await Product.create({
      name: 'Originaltröja',
      category: 'Tröja',
      quantity: 5,
    })

    // Skapa en historikpost som registrerar quantity-ändringen 5 → 20
    const histEntry = await ProductHistory.create({
      productId: product._id,
      productName: 'Originaltröja',
      action: 'update',
      performedBy: PERFORMED_BY,
      changes: [{ field: 'quantity', oldValue: 5, newValue: 20 }],
      snapshot: null,
    })

    // Uppdatera produkten direkt i DB (simulerar det som controller redan gjort)
    await Product.findByIdAndUpdate(product._id, { quantity: 20 })

    // Ångra ändringen via HTTP
    const res = await request(app)
      .post(`/history/${histEntry._id}/undo`)
      .set('Cookie', authCookie)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/history')

    // Verifiera att quantity är återställt till 5
    const restored = await Product.findById(product._id)
    expect(restored.quantity).toBe(5)
  })

  it('skapar en ny historikpost för ångringen', async () => {
    const product = await Product.create({
      name: 'Ändringsprodukt',
      category: 'Overall',
      quantity: 2,
    })

    const histEntry = await ProductHistory.create({
      productId: product._id,
      productName: 'Ändringsprodukt',
      action: 'update',
      performedBy: PERFORMED_BY,
      changes: [{ field: 'quantity', oldValue: 2, newValue: 8 }],
      snapshot: null,
    })

    await Product.findByIdAndUpdate(product._id, { quantity: 8 })

    await request(app)
      .post(`/history/${histEntry._id}/undo`)
      .set('Cookie', authCookie)

    // Kontrollera att en ny 'update'-historikpost skapades (omvänd ändring)
    const reverseEntry = await ProductHistory.findOne({
      productId: product._id,
      action: 'update',
      'changes.0.oldValue': 8,
      'changes.0.newValue': 2,
    })
    expect(reverseEntry).not.toBeNull()
  })
})

describe('POST /history/:id/undo — action: delete', () => {
  it('återskapar den raderade produkten från snapshot', async () => {
    // Skapa och spara snapshot innan radering
    const product = await Product.create({
      name: 'Raderad produkt',
      category: 'Märke',
      quantity: 4,
    })
    const snapshot = product.toObject()

    // Radera produkten och skapa historikpost med snapshot
    await product.deleteOne()
    const histEntry = await ProductHistory.create({
      productId: product._id,
      productName: 'Raderad produkt',
      action: 'delete',
      performedBy: PERFORMED_BY,
      changes: [],
      snapshot,
    })

    // Ångra raderingen
    const res = await request(app)
      .post(`/history/${histEntry._id}/undo`)
      .set('Cookie', authCookie)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/history')

    // Produkten ska finnas i databasen igen
    const recreated = await Product.findOne({ name: 'Raderad produkt' })
    expect(recreated).not.toBeNull()
    expect(recreated.category).toBe('Märke')
    expect(recreated.quantity).toBe(4)
  })
})

describe('POST /history/:id/undo — felfall', () => {
  it('med ogiltigt id-format — redirectar till /history utan krasch', async () => {
    const res = await request(app)
      .post('/history/ogiltigt-id-format/undo')
      .set('Cookie', authCookie)

    // Controllern fångar CastError och redirectar med flash-fel
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/history')
  })

  it('med giltigt ObjectId-format men obefintlig post — redirectar till /history', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const res = await request(app)
      .post(`/history/${fakeId}/undo`)
      .set('Cookie', authCookie)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/history')
  })

  it('utan auth — omdirigerar till /auth/login', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()

    const res = await request(app).post(`/history/${fakeId}/undo`)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')
  })
})
