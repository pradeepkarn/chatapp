const mediaController = require("../controllers/mediaController.js");
const router = require('express').Router()
const path = require("path")
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/media/gallery')
    },
    filename: function (req, file, cb) {
      var extname = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + "_"+ Date.now()+extname)
      }
  })
  var uploadIm = multer({ storage: storage })

router.post("/app-banner/ajax-upload",uploadIm.single('app_banner'),mediaController.addMedia);
router.get("/app-banner",mediaController.getAllAppBanners);
router.post("/app-banner/remove",mediaController.destroyMedia);
module.exports = router
