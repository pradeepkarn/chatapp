const userController = require("../controllers/userController.js");
const router = require('express').Router()
const path = require("path")
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/media/covers')
    },
    filename: function (req, file, cb) {
      var extname = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + "-"+ Date.now()+extname)
  
      }
  })
  var upload = multer({ storage: storage })

// router.post("/add",productController.addProduct)
router.post("/login",userController.logIn)
router.post("/signin",userController.logIn)
router.post("/login-via-token",userController.logInViaToken)
router.post("/signup",userController.signUp)
router.post("/register",userController.signUp)
router.post("/update-profile",userController.profileEdit)
router.post("/cover-upload", upload.single('cover_image'), userController.coverUpload)
router.post("/get-profile", userController.getProfileById)
// router.get("/published",productController.getPublishedProduct)
// router.get("/:id",productController.getOneProduct)
// router.put("/:id",productController.updateProduct)
// router.delete("/:id",productController.deleteProduct)

module.exports = router
