const friendshipController = require("../controllers/friendController.js");
const router = require('express').Router()
router.post("/request-friendship",friendshipController.requestFriendship);
router.post("/response-friendship",friendshipController.responseFriendship);
router.post("/remove-friendship",friendshipController.removeFriendship);
router.post("/get-friendship-list",friendshipController.getFriendshipList);

module.exports = router
