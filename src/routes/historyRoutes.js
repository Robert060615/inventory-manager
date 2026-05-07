/**
 * @file History routes — endpoints for viewing the product change history log.
 * @author Robert Minushi <rm222xi@student.lnu.se>
 * @version v0.1.0
 */

import { Router } from 'express'
import requireAuth from '../middleware/auth.js'
import { getHistory, getProductHistory } from '../controllers/historyController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getHistory)
router.get('/product/:id', getProductHistory)

export default router
