const postController = require("../controllers/postController.js");
const router = require('express').Router()
const path = require("path")
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // if (!req.file) {
      //   return;
      // }
      cb(null, './static/media/posts')
    },
    filename: function (req, file, cb) {
      var extname = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + "-"+ Date.now()+extname)
  
      }
  })
  var upload = multer({ storage: storage })


router.post("/add-post",upload.single('post_image'),postController.addPost);
router.get("/get/:id",postController.getPost);
router.get("/get",postController.getAllPost);
module.exports = router
