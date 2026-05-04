import jwt from 'jsonwebtoken'

function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.redirect('/auth/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.locals.user = decoded
    next()
  } catch {
    res.clearCookie('token')
    res.redirect('/auth/login')
  }
}

export default requireAuth
