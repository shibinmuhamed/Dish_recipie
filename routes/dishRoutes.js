<<<<<<< HEAD
const express = require('express');
const {
  createDish,
  getDishes,
  getDishById,
  setIngredientQuantities,
} = require('../controllers/dishController');

const router = express.Router();

router.post('/', createDish);
router.get('/', getDishes);
router.get('/:id', getDishById);
router.post('/:id/quantities', setIngredientQuantities); // Set quantities for ingredients when the chef selects a dish
=======
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
>>>>>>> f3bf3d1 (Initial commit)

module.exports = router;
