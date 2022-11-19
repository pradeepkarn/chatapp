const postController = require("../controllers/postController.js");
const router = require('express').Router()
router.post("/add-post",postController.addPost);
router.get("/get/:id",postController.getPost);
router.get("/get",postController.getAllPost);
module.exports = router
