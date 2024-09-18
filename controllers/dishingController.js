const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");

// update quantity of ingredient
exports.updateIngQuantity = async (req, res) => {
  try {
    const { dishId, ingredientId } = req.params;
    const { newQuantity } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const ingredientToUpdate = dish.ingredients.find(
      (ing) => ing.ingredient.toString() === ingredientId
    );
    if (!ingredientToUpdate) {
      return res
        .status(404)
        .json({ message: "Ingredient not found in this dish" });
    }

    ingredientToUpdate.quantity = newQuantity;

    await dish.save();

    res.status(200).json({ message: "Quantity updated successfully", dish });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
};

// Delete an ingredient from a dish
exports.deleteIngredientFromDish = async (req, res) => {
  try {
    const { dishId, ingredientId } = req.params;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const updatedIngredients = dish.ingredients.filter(
      (ingredient) => ingredient.ingredient.toString() !== ingredientId
    );

    if (updatedIngredients.length === dish.ingredients.length) {
      return res
        .status(404)
        .json({ message: "Ingredient not found in this dish" });
    }

    dish.ingredients = updatedIngredients;

    await dish.save();

    res.status(200).json({ message: "Ingredient removed successfully", dish });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ingredient from dish", error });
  }
};
