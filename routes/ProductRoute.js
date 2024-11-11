const { Router } = require('express');
const { getProducts, } = require('../controllers/ProductController');

const router = Router();

router.get('/getProducts', getProducts);

module.exports = router;
