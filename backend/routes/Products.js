const express = require("express");
const router = express.Router();
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require("../controller/Product");
const { productModel } = require("../model/Product");

// products is already added in base path
router
.post("/",createProduct)
.get("/",fetchAllProducts)
.get("/:id",fetchProductById)
.patch("/:id",updateProduct)

exports.router = router;