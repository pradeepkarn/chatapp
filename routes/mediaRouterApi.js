const mediaController = require("../controllers/mediaController.js");
const router = require('express').Router()

router.get("/app-banners",mediaController.getAllAppBannersForApi);

module.exports = router
