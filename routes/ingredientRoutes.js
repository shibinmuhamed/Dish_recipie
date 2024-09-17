const express = require('express');
const {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} = require('../controllers/ingredientController');

const router = express.Router();

router.post('/', createIngredient);
router.get('/', getIngredients);
router.get('/:id', getIngredientById);
router.put('/:id', updateIngredient);
router.delete('/:id', deleteIngredient);

module.exports = router;
