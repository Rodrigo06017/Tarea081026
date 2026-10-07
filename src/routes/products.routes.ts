import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductPrice,
  deleteProduct
} from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.patch('/:id/price', updateProductPrice);
router.delete('/:id', deleteProduct);

export default router;
