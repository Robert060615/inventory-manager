import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const getLogin = (req, res) => {
  const error = req.flash('error')[0] || null
  res.render('pages/login', { title: 'Logga in', error })
}

export const postLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      req.flash('error', 'Felaktig e-postadress eller lösenord.')
      return res.redirect('/auth/login')
    }

    const match = await bcrypt.compare(password, user.hashedPassword)

    if (!match) {
      req.flash('error', 'Felaktig e-postadress eller lösenord.')
      return res.redirect('/auth/login')
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    })

    res.redirect('/')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Ett fel uppstod. Försök igen.')
    res.redirect('/auth/login')
  }
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.redirect('/auth/login')
}
