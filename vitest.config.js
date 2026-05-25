/**
 * @file Vitest configuration.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Kör i Node.js-miljö (ingen DOM behövs)
    environment: 'node',

    // Körs i varje worker innan testfilen laddas:
    // – startar MongoMemoryServer
    // – kopplar Mongoose
    // – rensar collections mellan tester
    setupFiles: ['./tests/setup.js'],

    // Ge MongoMemoryServer gott om tid att ladda ner sin binär första gången
    testTimeout: 30000,
    hookTimeout: 60000,

    // Miljövariabler som sätts i workern innan NÅGON modul importeras.
    // app.js läser process.env.JWT_SECRET för express-session och
    // auth-middleware — 'test-secret' matchar den nyckel vi signerar
    // test-JWT:er med i integrationstesterna.
    env: {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test',
    },
  },
})
