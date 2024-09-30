const Dish = require("../models/dish");
const Ingredient = require("../models/ingredient");
const DishHistory = require("../models/dishHistory");
const mongoose = require("mongoose");
const ApiFeatures = require("../Utils/apiFeatures");

// Create a new dishes
exports.createDish = async (req, res) => {
  try {
    const { name, ingredients } = req.body;

    const ingredientIds = ingredients.map((i) => i.ingredient);
    const foundIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });

    if (foundIngredients.length !== ingredients.length) {
      return res
        .status(400)
        .json({ message: "Some ingredients are not valid" });
    }

    const dish = new Dish({ name, ingredients });
    await dish.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error creating dish", error });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate(
      "ingredients.ingredient",
      "name stockQuantity"
    );
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const { Id } = req.params;

    // Find the dish by its ID and populate the ingredients with both 'name' and 'stockQuantity'
    const dish = await Dish.findById(Id).populate(
      "ingredients.ingredient",
      "name stockQuantity" // Populating 'name' and 'stockQuantity' fields from the Ingredient model
    );

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish", error });
  }
};

// Update a dish
exports.updateDish = async (req, res) => {
  try {
    const { Id } = req.params;
    const updateData = req.body;
    const updatedDish = await Dish.findByIdAndUpdate(Id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish updated successfully", updatedDish });
  } catch (error) {
    res.status(500).json({ message: "Error updating dish", error });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const { Id } = req.params;

    const deletedDish = await Dish.findByIdAndDelete(Id);

    if (!deletedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish", error });
  }
};

// Update the dish and store history
// exports.updateDishWithHistory = async (req, res) => {
//   try {
//     const { dishId } = req.params;
//     const updateData = req.body; // The updated dish data (e.g., name, ingredients)

//     // Find the dish by ID
//     const dish = await Dish.findById(dishId);
//     if (!dish) {
//       return res.status(404).json({ message: "Dish not found" });
//     }

//     // Save current state to history before updating
//     const historyEntry = new DishHistory({
//       dishId: dish._id,
//       name: dish.name,
//       ingredients: dish.ingredients,
//       updatedAt: new Date(), // Save timestamp of update
//     });
//     await historyEntry.save();

//     // Update the dish with new data
//     Object.assign(dish, updateData); // Merge updated data with existing dish data
//     await dish.save();

//     res
//       .status(200)
//       .json({ message: "Cooking Started", dish });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating dish", error });
//   }
// };

// Start cooking and update multiple ingredients' quantities
exports.startCooking = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { ingredients } = req.body; // Array of ingredients with new quantities

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients,
      status: "cooking started",
      updatedAt: new Date(),
    });
    await historyEntry.save();

    // Loop through the ingredients in the request body to update their quantities
    for (const ing of ingredients) {
      const ingredientId = new mongoose.Types.ObjectId(ing.ingredientId); // Convert to ObjectId

      // Find the ingredient in the dish's ingredients array
      const ingredient = dish.ingredients.find((ingr) =>
        ingr.ingredient.equals(ingredientId)
      );
      if (!ingredient) {
        return res
          .status(404)
          .json({
            message: `Ingredient with id ${ingredientId} not found in this dish`,
          });
      }

      // Update the quantity for the found ingredient
      ingredient.quantity = ing.newQuantity;
    }

    // Save the updated dish
    await dish.save();

    res
      .status(200)
      .json({ message: "Cooking started, quantities updated", dish });
  } catch (error) {
    console.error("Error updating ingredients:", error);
    res.status(500).json({ message: "Error updating ingredients", error });
  }
};


// Stop cooking
exports.stopCooking = async (req, res) => {
  try {
    const { dishId } = req.params;

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Logic to stop cooking could include saving a final state or just sending a response
    // Save the current state as history, similar to the start cooking function
    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients,
      status: "cooking ended",
      updatedAt: new Date(), // Save timestamp of the stop action
    });
    await historyEntry.save();

    // Send "Cooking ended" message
    res.status(200).json({ message: "Cooking ended", dish });
  } catch (error) {
    res.status(500).json({ message: "Error stopping cooking process", error });
  }
};

// Fetch the history of all dishes
exports.getAllDishesHistory = async (req, res) => {
  try {
    let query = DishHistory.find().populate("ingredients.ingredient", "name");

    // Find all history entries across all dishes
    const historyQuery = new ApiFeatures(query, req.query)
      .sort()
      // .populate("ingredients.ingredient", "name")
      .filter()
      .limitFields()
      .paginate();

    const history = await historyQuery.query;

    if (!history.length) {
      return res
        .status(404)
        .json({ message: "No history found for any dishes" });
    }

    res.status(200).json({
      message: "History of all dishes retrieved successfully",
      history,
    });
  } catch (error) {
    console.error("Error fetching history of all dishes:", error);
    res
      .status(500)
      .json({
        message: "Error fetching history of all dishes",
        error: error.message || "An unknown error occurred",
        stack: error.stack,
      });
  }
};

// API to add ingredients to a dish and deduct from global stock
exports.addIngredientsAndUpdateStock = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { ingredients } = req.body; // Array of ingredients with their quantities

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Loop through each ingredient to add to the dish and deduct from stock
    for (const ing of ingredients) {
      const ingredientId = new mongoose.Types.ObjectId(ing.ingredientId);
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        return res
          .status(404)
          .json({ message: `Ingredient with id ${ingredientId} not found` });
      }

      // Check if there is enough stock to deduct
      if (ingredient.stockQuantity < ing.newQuantity) {
        return res
          .status(400)
          .json({
            message: `Insufficient stock for ingredient ${ingredient.name}`,
          });
      }

      // Deduct the quantity from the global stock
      ingredient.stockQuantity -= ing.newQuantity;
      await ingredient.save();

      // Add or update the ingredient in the dish's ingredient list
      const dishIngredient = dish.ingredients.find((i) =>
        i.ingredient.equals(ingredientId)
      );

      if (dishIngredient) {
        dishIngredient.quantity += ing.newQuantity; // Update the quantity if already present
      } else {
        // Add a new ingredient entry
        dish.ingredients.push({
          ingredient: ingredientId,
          quantity: ing.newQuantity,
        });
      }
    }

    // Save the updated dish
    await dish.save();

    res
      .status(200)
      .json({ message: "Ingredients added and stock updated", dish });
  } catch (error) {
    console.error("Error adding ingredients and updating stock:", error);
    res
      .status(500)
      .json({ message: "Error adding ingredients and updating stock", error });
  }
};

exports.startCookingAndUpdateStock = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { ingredients } = req.body; // Array of ingredients with new quantities

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients must be a non-empty array." });
    }

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Create a history entry before modifying the dish
    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients, // Store the current state of ingredients before modification
      status: "cooking started",
      updatedAt: new Date(),
    });
    await historyEntry.save();

    // Loop through each ingredient to update the dish and deduct from the stock
    for (const ing of ingredients) {
      const ingredientId = new mongoose.Types.ObjectId(ing.ingredientId); // Convert to ObjectId

      // Find the ingredient in the global ingredient collection
      const globalIngredient = await Ingredient.findById(ingredientId);
      if (!globalIngredient) {
        return res.status(404).json({ message: `Ingredient with id ${ingredientId} not found in global stock` });
      }

      // Check if there is enough stock to deduct
      if (globalIngredient.stockQuantity < ing.newQuantity) {
        return res.status(400).json({ message: `Insufficient stock for ingredient ${globalIngredient.name}` });
      }

      // Deduct the quantity from the global stock
      globalIngredient.stockQuantity -= ing.newQuantity;
      await globalIngredient.save();

      // Update or add the ingredient in the dish's ingredient list
      const dishIngredient = dish.ingredients.find(i => i.ingredient.equals(ingredientId));

      if (dishIngredient) {
        dishIngredient.quantity += ing.newQuantity; // Update the quantity if already present
      } else {
        // Add a new ingredient entry to the dish
        dish.ingredients.push({
          ingredient: ingredientId,
          quantity: ing.newQuantity,
        });
      }
    }

    // Save the updated dish
    await dish.save();

    // Return success response
    res.status(200).json({ message: "Cooking started, ingredients updated, and stock deducted", dish });
  } catch (error) {
    console.error("Error updating ingredients and stock:", error);
    res.status(500).json({ message: "Error updating ingredients and stock", error });
  }
};
