const mongoose = require("mongoose");
const { Schema } = mongoose;

const dishHistorySchema = new Schema({
  dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  name: { type: String, required: true }, 
  ingredients: [
    {
      ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" }, 
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ['cooking started', 'cooking ended'], required: true }, // New field
   updatedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("DishHistory", dishHistorySchema);
