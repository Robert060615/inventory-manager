/**
 * @file Authentication controller — handles login, logout, and session management.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.3.0
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Renders the login page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
export const getLogin = (req, res) => {
  const error = req.flash('error')[0] || null
  res.render('pages/login', { title: 'Logga in', error })
}

/**
 * Handles login form submission and issues a JWT cookie on success.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {void}
 */
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
      maxAge: 8 * 60 * 60 * 1000,
    })

    return res.redirect('/')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Ett fel uppstod. Försök igen.')
    return res.redirect('/auth/login')
  }
}

/**
 * Clears the JWT cookie and redirects to the login page.
 *
 * @param {object} _req - Express request object (unused).
 * @param {object} res - Express response object.
 */
export const logout = (_req, res) => {
  res.clearCookie('token')
  res.redirect('/auth/login')
}
