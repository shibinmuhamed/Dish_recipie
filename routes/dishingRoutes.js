const express = require("express");
const router = express.Router();
const dishingController = require("../controllers/dishingController");
router.put(
  "/dishes/:dishId/ingredients/:ingredientId",
  dishingController.updateIngQuantity
);

router.delete(
  "/dishes/:dishId/ingredients/:ingredientId",
  dishingController.deleteIngredientFromDish
);

module.exports = router;
