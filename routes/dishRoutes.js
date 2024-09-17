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

module.exports = router;
