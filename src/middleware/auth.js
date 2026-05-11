/**
 * @file Authentication middleware — verifies JWT token from cookie and protects routes.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.2.0
 */

import jwt from 'jsonwebtoken'

/**
 * Verifies the JWT cookie and attaches the decoded user to res.locals.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function(): void} next - Express next middleware function.
 * @returns {void}
 */
function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.redirect('/auth/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.locals.user = decoded
    return next()
  } catch {
    res.clearCookie('token')
    return res.redirect('/auth/login')
  }
}

export default requireAuth
