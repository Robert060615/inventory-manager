import { Router } from 'express'
import requireAuth from '../middleware/auth.js'
import {
  getInvite,
  postInvite,
  getAcceptInvite,
  postAcceptInvite
} from '../controllers/inviteController.js'

const router = Router()

router.get('/accept/:token', getAcceptInvite)
router.post('/accept/:token', postAcceptInvite)

router.get('/', requireAuth, getInvite)
router.post('/', requireAuth, postInvite)

export default router
