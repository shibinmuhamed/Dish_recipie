const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true }, // Unit can be gram, ml, etc.
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
