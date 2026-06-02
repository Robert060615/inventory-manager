/**
 * @file Integrationstester för product CRUD-routes.
 *
 * Auth sköts med en JWT signerad med samma hemlighet som Vitest sätter via
 * env.JWT_SECRET ('test-secret'). Cookien skickas som header i varje anrop.
 *
 * Testdata skapas i beforeEach och rensas av afterEach i setup.js.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../app.js'
import Product from '../../src/models/Product.js'

// Generera en giltig JWT-cookie en gång för alla tester i filen.
// JWT_SECRET sätts till 'test-secret' av vitest.config.js env-sektionen.
let authCookie

beforeAll(() => {
  const token = jwt.sign(
    { id: 'test-user-id', email: 'product-tester@spiik.se' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  authCookie = `token=${token}`
})

describe('POST /products', () => {
  it('med giltiga värden och auth — skapar produkt och redirectar till /products', async () => {
    const res = await request(app)
      .post('/products')
      .set('Cookie', authCookie)
      .type('form')
      .send({ name: 'Testmärke', category: 'Märke', size: 'L', quantity: '3' })

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/products')

    // Verifiera att produkten verkligen lagrades i databasen
    const saved = await Product.findOne({ name: 'Testmärke' })
    expect(saved).not.toBeNull()
    expect(saved.category).toBe('Märke')
    expect(saved.quantity).toBe(3)
  })

  it('utan name för icke-Overall-kategori och med auth — visar felmeddelande (ingen redirect)', async () => {
    const res = await request(app)
      .post('/products')
      .set('Cookie', authCookie)
      .type('form')
      .send({ category: 'Märke', quantity: '5' }) // name saknas

    // Controllern renderar formuläret igen med felmeddelande (200, inte 302)
    expect(res.status).toBe(200)
    expect(res.text).toContain('Namn är obligatoriskt')
  })

  it('med negativt quantity och auth — visar felmeddelande', async () => {
    const res = await request(app)
      .post('/products')
      .set('Cookie', authCookie)
      .type('form')
      .send({ name: 'Negativ', category: 'Tröja', quantity: '-1' })

    expect(res.status).toBe(200)
    expect(res.text).toContain('Antal måste vara 0 eller mer')
  })

  it('utan auth — omdirigerar till /auth/login', async () => {
    const res = await request(app)
      .post('/products')
      .type('form')
      .send({ name: 'Ingen auth', category: 'Overall', quantity: '1' })

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')
  })
})

describe('POST /products/:id/update', () => {
  it('uppdaterar produkten och redirectar till /products', async () => {
    const product = await Product.create({
      name: 'Gammalt namn',
      category: 'Overall',
      quantity: 1,
    })

    const res = await request(app)
      .post(`/products/${product._id}/update`)
      .set('Cookie', authCookie)
      .type('form')
      .send({ name: 'Nytt namn', category: 'Overall', quantity: '7' })

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/products')

    // Verifiera att de nya värdena sparades i databasen
    const updated = await Product.findById(product._id)
    expect(updated.name).toBe('Nytt namn')
    expect(updated.quantity).toBe(7)
  })

  it('med ogiltigt id — omdirigerar till /products utan krasch', async () => {
    const res = await request(app)
      .post('/products/ogiltigt-id/update')
      .set('Cookie', authCookie)
      .type('form')
      .send({ name: 'X', category: 'Overall', quantity: '0' })

    // Controllern fångar felet och redirectar
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/products')
  })
})

describe('POST /products/:id/delete', () => {
  it('raderar produkten och verifiera att den inte längre finns i databasen', async () => {
    const product = await Product.create({
      name: 'Ska tas bort',
      category: 'Övrigt',
      quantity: 2,
    })

    const res = await request(app)
      .post(`/products/${product._id}/delete`)
      .set('Cookie', authCookie)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/products')

    const deleted = await Product.findById(product._id)
    expect(deleted).toBeNull()
  })

  it('utan auth — omdirigerar till /auth/login', async () => {
    const product = await Product.create({
      name: 'Skyddad radering',
      category: 'Overall',
      quantity: 0,
    })

    const res = await request(app).post(`/products/${product._id}/delete`)

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')
  })
})
