import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'

import indexRouter from './src/routes/index.js'
import authRouter from './src/routes/auth.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'src/views'))

app.use(expressLayouts)
app.set('layout', 'layouts/main')

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(express.static(join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/auth', authRouter)

await mongoose.connect(process.env.MONGODB_URI)
console.log('MongoDB connected')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`)
})
