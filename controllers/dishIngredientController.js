const Dish = require("../models/dish");
const Ingredient = require("../models/ingredient");


// Controller function to add ingredient to a dish
exports.addIngredientToDish = async (req, res) => {
  try {
    const { dishId } = req.params; // Dish ID from the URL
    const { ingredientId,quantity} = req.body; // Ingredient ID and quantity from the request body

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    // Check if the ingredient is already in the dish
    const existingIngredient = dish.ingredients.find((i) =>
      i.ingredient.equals(ingredientId)
    );

    if (existingIngredient) {
      // If ingredient exists, update its quantity
      existingIngredient.quantity += quantity;
    } else {
      // If ingredient doesn't exist, add it to the dish
      dish.ingredients.push({
        ingredient: ingredientId,
        quantity,
      });
    }

    // Save the updated dish
    await dish.save();

    res.status(200).json({ message: "Ingredient added to dish", dish });
  } catch (error) {
    console.error("Error adding ingredient to dish:", error);
    res.status(500).json({ message: "Error adding ingredient to dish", error });
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

