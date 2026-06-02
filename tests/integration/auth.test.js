/**
 * @file Integrationstester för auth-routes (/auth/login, /auth/logout).
 *
 * Använder supertest mot app-instansen (ingen riktig HTTP-port öppnas).
 * En testanvändare skapas i beforeEach med bcrypt-hashat lösenord och
 * rensas av afterEach i setup.js.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../../app.js'
import User from '../../src/models/User.js'

const TEST_EMAIL = 'auth-test@spiik.se'
const TEST_PASSWORD = 'Hemligt123!'

// Skapa testanvändaren inför varje test.
// afterEach i setup.js rensar collections automatiskt.
beforeEach(async () => {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
  await User.create({ email: TEST_EMAIL, hashedPassword })
})

describe('GET /auth/login', () => {
  it('returnerar 200 och renderar login-sidan', async () => {
    const res = await request(app).get('/auth/login')

    expect(res.status).toBe(200)
    expect(res.text).toContain('Logga in')
  })
})

describe('POST /auth/login', () => {
  it('med giltiga credentials — redirectar till / och sätter JWT-cookie', async () => {
    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/')

    // Verifiera att JWT-cookien finns i Set-Cookie-headern
    const cookies = res.headers['set-cookie'] ?? []
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies]
    const hasToken = cookieArr.some((c) => c.startsWith('token='))
    expect(hasToken).toBe(true)
  })

  it('med felaktigt lösenord — redirectar till /auth/login och sätter ingen JWT-cookie', async () => {
    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({ email: TEST_EMAIL, password: 'FelLösenord!' })

    expect(res.status).toBe(302)
    expect(res.headers.location).toContain('/auth/login')

    // Inget JWT-token ska sättas vid felaktig inloggning
    const cookies = res.headers['set-cookie'] ?? []
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies]
    const hasToken = cookieArr.some((c) => c.startsWith('token='))
    expect(hasToken).toBe(false)
  })

  it('med okänd e-post — redirectar till /auth/login och sätter ingen JWT-cookie', async () => {
    const res = await request(app)
      .post('/auth/login')
      .type('form')
      .send({ email: 'okand@spiik.se', password: TEST_PASSWORD })

    expect(res.status).toBe(302)
    expect(res.headers.location).toContain('/auth/login')

    const cookies = res.headers['set-cookie'] ?? []
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies]
    const hasToken = cookieArr.some((c) => c.startsWith('token='))
    expect(hasToken).toBe(false)
  })
})

describe('GET /auth/logout', () => {
  it('rensar JWT-cookien och redirectar till /auth/login', async () => {
    const res = await request(app).get('/auth/logout')

    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/auth/login')

    // clearCookie sätter en utgången cookie med tomt värde
    const cookies = res.headers['set-cookie'] ?? []
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies]
    const clearedToken = cookieArr.find((c) => c.startsWith('token='))
    // Antingen är token-cookien borttagen (expires i förfluten tid) eller saknas
    if (clearedToken) {
      expect(clearedToken).toMatch(/token=;|token= ;|Expires=Thu, 01 Jan 1970/i)
    }
  })
})
