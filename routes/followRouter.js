const followController = require("../controllers/followController.js");
const router = require('express').Router()
router.post("/request-follow",followController.requestFollow);

module.exports = router
