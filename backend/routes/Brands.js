const express = require("express");
const router = express.Router();
const { fetchBrands, createBrand } = require("../controller/Brand");

// brands is already added in base path
router
.get("/",fetchBrands)
.post("/",createBrand)

exports.router = router;