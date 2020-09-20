const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products.controller');

router.get('/products', ProductController.getAll);

router.get('/products/:id', ProductController.getById);

router.post('/products', ProductController.postNew);

router.put('/products/:id', ProductController.updateById);

router.delete('/products/:id', ProductController.removeById);

module.exports = router;
