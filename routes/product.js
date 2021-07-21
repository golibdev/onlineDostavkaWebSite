const express = require("express");
const productController = require("../controllers/product");
const orderController = require("../controllers/order")

const router = express.Router();

// router.post("/dashboard/product", productController.product);
router.post("/products", productController.order);
router.post("/delete/:id", productController.deleteProduct);
router.post("/deleted/:id", orderController.deleteOrder);

module.exports = router;
