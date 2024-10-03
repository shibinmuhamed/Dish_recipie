const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  stockQuantity: { type: Number, required: true }  
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
