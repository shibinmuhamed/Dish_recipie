const express = require("express");
const {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
} = require("../controllers/dishController");
const router = express.Router();

router.post("/dish", createDish);

router.get("/dishes", getAllDishes);

router.get("/dish/:Id", getDishById);

router.put("/dish/:Id", updateDish);
router.delete("/dish/:Id", deleteDish);

module.exports = router;
