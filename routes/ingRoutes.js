const express = require("express");
const {
  createIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingridientController");
const router = express.Router();

router.post("/ing", createIngredient);

router.get("/ing", getAllIngredients);

router.put("/ing/:id", updateIngredient);
router.delete("/ing/:id", deleteIngredient);

module.exports = router;
