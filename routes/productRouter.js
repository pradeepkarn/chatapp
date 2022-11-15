const productController = require("../controllers/productController.js");

const router = require('express').Router()

router.post("/add",productController.addProduct)
router.get("/get",productController.getAllProducts)
router.get("/published",productController.getPublishedProduct)
router.get("/:id",productController.getOneProduct)
router.put("/:id",productController.updateProduct)
router.delete("/:id",productController.deleteProduct)

module.exports = router
