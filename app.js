/**
 * @file Express application factory — configures middleware and routes.
 *       Exporterar app-instansen utan att koppla upp mot databasen eller
 *       starta en HTTP-lyssnare, så att supertest kan importera appen direkt.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import indexRouter from './src/routes/index.js'
import authRouter from './src/routes/auth.js'
import productRouter from './src/routes/productRoutes.js'
import inviteRouter from './src/routes/inviteRoutes.js'
import historyRouter from './src/routes/historyRoutes.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

// View engine
app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'src/views'))
app.use(expressLayouts)
app.set('layout', 'layouts/main')

// Body / cookie parsing
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Session + flash (secret läses från process.env, satt av server.js via dotenv
// eller av Vitest via test.env-konfigurationen)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(flash())

// Statiska filer
app.use(express.static(join(__dirname, 'public')))

// Routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)
app.use('/invite', inviteRouter)
app.use('/history', historyRouter)

export default app
