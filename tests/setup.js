/**
 * @file Vitest global setup — startar MongoMemoryServer, kopplar Mongoose,
 *       rensar collections och river ner databasen ordentligt.
 *
 * Körs som setupFile i varje worker innan respektive testfil laddas,
 * vilket garanterar att MongoDB-anslutningen finns på plats när
 * beforeEach/afterEach i testfilerna exekveras.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { beforeAll, afterEach, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongod

// Starta en in-memory MongoDB och koppla Mongoose till den.
// Timeout är satt högt (60 s) eftersom binären kan behöva laddas ner
// första gången tester körs i en ny miljö.
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
}, 60000)

// Rensa alla collections efter varje test så att tester är oberoende av
// varandra och inte påverkas av testdata från föregående test.
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// Koppla ner Mongoose och stäng MongoMemoryServer-processen när alla
// tester i filen är klara.
afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})
