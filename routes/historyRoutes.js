const express = require("express");
const {
    getDishHistory,
    clearAllHistory,

} = require("../controllers/historyController")
const router = express.Router();


router.get('/history',getDishHistory)
router.delete("/history/clear", clearAllHistory);

module.exports = router;

