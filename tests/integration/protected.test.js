/**
 * @file Integrationstester för skyddade routes.
 *
 * Verifierar att requireAuth-middleware omdirigerar oautentiserade anrop
 * till /auth/login för alla skyddade endpoints.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../app.js'

// Hjälpfunktion: skicka GET utan auth-cookie och verifiera redirect.
async function expectLoginRedirect(path) {
  const res = await request(app).get(path)
  expect(res.status).toBe(302)
  expect(res.headers.location).toBe('/auth/login')
}

describe('Skyddade routes — omdirigerar till /auth/login utan auth', () => {
  it('GET /products omdirigerar till /auth/login', async () => {
    await expectLoginRedirect('/products')
  })

  it('GET /history omdirigerar till /auth/login', async () => {
    await expectLoginRedirect('/history')
  })

  it('GET /invite omdirigerar till /auth/login', async () => {
    await expectLoginRedirect('/invite')
  })

  it('GET / (dashboard) omdirigerar till /auth/login', async () => {
    await expectLoginRedirect('/')
  })
})
