/**
 * @file Root router — dashboard route.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.2.0
 */

import { Router } from 'express'
import requireAuth from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, (req, res) => {
  res.render('pages/dashboard', { title: 'Dashboard' })
})

export default router
