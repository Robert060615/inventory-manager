/**
 * @file Authentication routes — login and logout endpoints.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v1.0.0
 */

import { Router } from 'express'
import { getLogin, postLogin, logout } from '../controllers/authController.js'

const router = Router()

router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', logout)

export default router
