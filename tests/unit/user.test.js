/**
 * @file Enhetstester för User-modellen.
 *
 * Testar Mongoose-schemat direkt — utan att gå via controllers eller HTTP.
 * Databasen tillhandahålls av MongoMemoryServer (se tests/setup.js).
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { describe, it, expect } from 'vitest'
import User from '../../src/models/User.js'

describe('User-modellen', () => {
  it('skapar en användare med giltiga värden och sparar email och hashedPassword', async () => {
    const user = await User.create({
      email: 'test@spiik.se',
      hashedPassword: '$2a$10$hashedPasswordHash',
    })

    expect(user._id).toBeDefined()
    expect(user.email).toBe('test@spiik.se')
    expect(user.hashedPassword).toBe('$2a$10$hashedPasswordHash')
  })

  it('konverterar email till gemener (lowercase: true i schemat)', async () => {
    const user = await User.create({
      email: 'Caps@SPIIK.SE',
      hashedPassword: 'somehash',
    })

    expect(user.email).toBe('caps@spiik.se')
  })

  it('kastar valideringsfel när email saknas (email är required)', async () => {
    await expect(
      User.create({ hashedPassword: 'somehash' })
    ).rejects.toThrow()
  })

  it('kastar valideringsfel när hashedPassword saknas (hashedPassword är required)', async () => {
    await expect(
      User.create({ email: 'nopassword@spiik.se' })
    ).rejects.toThrow()
  })

  it('kastar duplicate key-fel när samma email skapas två gånger (unique: true)', async () => {
    await User.create({ email: 'dup@spiik.se', hashedPassword: 'hash1' })

    await expect(
      User.create({ email: 'dup@spiik.se', hashedPassword: 'hash2' })
    ).rejects.toThrow()
  })
})
