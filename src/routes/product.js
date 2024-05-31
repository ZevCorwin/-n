// routes/product.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getListProduct);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/search', productController.searchProducts);
router.get('/paginate', productController.getPaginatedProducts);

module.exports = router;
