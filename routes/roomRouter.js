const roomController = require("../controllers/roomController.js");
const router = require('express').Router()
router.post("/add-room",roomController.addRoom)
module.exports = router
