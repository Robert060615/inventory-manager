import { Router } from 'express'
import requireAuth from '../middleware/auth.js'
import {
  getProducts,
  getNewProduct,
  postProduct,
  getEditProduct,
  postUpdateProduct,
  postDeleteProduct
} from '../controllers/productController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getProducts)
router.get('/new', getNewProduct)
router.post('/', postProduct)
router.get('/:id/edit', getEditProduct)
router.post('/:id/update', postUpdateProduct)
router.post('/:id/delete', postDeleteProduct)

export default router
