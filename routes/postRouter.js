const postController = require("../controllers/postController.js");
const router = require('express').Router()
router.post("/add-post",postController.addPost);
module.exports = router
