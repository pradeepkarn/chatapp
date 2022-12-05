const followController = require("../controllers/followController.js");
const router = require('express').Router()
router.post("/request-follow",followController.requestFollow);
router.post("/request-unfollow",followController.unFollow);
router.post("/request-removefollower",followController.removeFollower);

module.exports = router
