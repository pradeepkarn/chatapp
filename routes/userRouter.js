const userController = require("../controllers/userController.js");

const router = require('express').Router()

// router.post("/add",productController.addProduct)
router.post("/login",userController.logIn)
router.post("/signin",userController.logIn)
router.post("/login-via-token",userController.logInViaToken)
router.post("/signup",userController.signUp)
router.post("/register",userController.signUp)
// router.post("/get",userController.signUp)
router.post("/update-profile",userController.profileEdit)
// router.get("/published",productController.getPublishedProduct)
// router.get("/:id",productController.getOneProduct)
// router.put("/:id",productController.updateProduct)
// router.delete("/:id",productController.deleteProduct)

module.exports = router
