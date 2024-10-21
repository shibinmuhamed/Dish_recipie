const mongoose = require("mongoose");
const { Schema } = mongoose;

const ingredientSchema = new mongoose.Schema({
  ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
  quantity: { type: Number, required: false }, 
});

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [ingredientSchema],
});

module.exports = mongoose.model("Dish", dishSchema);

