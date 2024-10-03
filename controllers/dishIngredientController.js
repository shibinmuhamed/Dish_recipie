const Dish = require("../models/dish");
const Ingredient = require("../models/ingredient");


exports.addIngredientToDish = async (req, res) => {
  try {
    const { dishId } = req.params; 
    const { ingredientId,quantity} = req.body; 

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    const existingIngredient = dish.ingredients.find((i) =>
      i.ingredient.equals(ingredientId)
    );

    if (existingIngredient) {
      existingIngredient.quantity += quantity;
    } else {
      dish.ingredients.push({
        ingredient: ingredientId,
        quantity,
      });
    }

    await dish.save();

    res.status(200).json({ message: "Ingredient added to dish", dish });
  } catch (error) {
    console.error("Error adding ingredient to dish:", error);
    res.status(500).json({ message: "Error adding ingredient to dish", error });
  }
};


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

