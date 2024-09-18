const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  //quantity: { type: Number, required: true }  // Default quantity for the ingredient
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
