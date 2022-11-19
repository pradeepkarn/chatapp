const roomController = require("../controllers/roomController.js");
const router = require('express').Router()
// router.post("/add-room",roomController.addRoom);
router.get("/get",roomController.getAllRooms);
router.get("/get/:id",roomController.getRoom);
module.exports = router
