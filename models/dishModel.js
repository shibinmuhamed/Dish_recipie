const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [
    {
      ingredient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingredient' 
      },
      quantity: { 
        type: Number, 
        default: null
      }
    }
  ]
});


module.exports = mongoose.model("Dish", dishSchema);
