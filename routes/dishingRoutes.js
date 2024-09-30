const express = require("express");
const router = express.Router();
const dishingController = require("../controllers/dishingController");
router.put(
  "/dishes/:dishId/ingredients/:ingredientId",
  dishingController.updateIngQuantity
);

router.post('/dishes/:dishId/add-ingredient',dishingController.addIngredientToDish);

router.delete(
  "/dishes/:dishId/ingredients/:ingredientId",
  dishingController.deleteIngredientFromDish
);

module.exports = router;
