const ProductModel = require('../models/ProductModel');

// Get All Products
module.exports.getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Something went wrong!" });
    }
};
