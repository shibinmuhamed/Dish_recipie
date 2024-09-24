const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");
const DishHistory = require("../models/dishHistory");
const mongoose = require('mongoose');


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
      "name quantity"
    );
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const { Id } = req.params;

    const dish = await Dish.findById(Id).populate(
      "ingredients.ingredient",
      "name"
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
      return res.status(404).json({ message: 'Dish not found' });
    }

    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients,
      status: 'cooking started', 
      updatedAt: new Date() 
    });
    await historyEntry.save();

    // Loop through the ingredients in the request body to update their quantities
    for (const ing of ingredients) {
      const ingredientId = new mongoose.Types.ObjectId(ing.ingredientId); // Convert to ObjectId

      // Find the ingredient in the dish's ingredients array
      const ingredient = dish.ingredients.find(ingr => ingr.ingredient.equals(ingredientId));
      if (!ingredient) {
        return res.status(404).json({ message: `Ingredient with id ${ingredientId} not found in this dish` });
      }

      // Update the quantity for the found ingredient
      ingredient.quantity = ing.newQuantity;
    }

    // Save the updated dish
    await dish.save();

    res.status(200).json({ message: 'Cooking started, quantities updated', dish });
  } catch (error) {
    console.error('Error updating ingredients:', error)
    res.status(500).json({ message: 'Error updating ingredients', error });
  }
};


// Stop cooking
exports.stopCooking = async (req, res) => {
  try {
    const { dishId } = req.params;

    // Find the dish by ID
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // Logic to stop cooking could include saving a final state or just sending a response
    // Save the current state as history, similar to the start cooking function
    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients,
      status: 'cooking ended',
      updatedAt: new Date() // Save timestamp of the stop action
    });
    await historyEntry.save();

    // Send "Cooking ended" message
    res.status(200).json({ message: 'Cooking ended', dish });
  } catch (error) {
    res.status(500).json({ message: 'Error stopping cooking process', error });
  }
};







// Fetch the history of all dishes
exports.getAllDishesHistory = async (req, res) => {
  try {
    // Find all history entries across all dishes
    const history = await DishHistory.find()
      .sort({ updatedAt: -1 })
      .populate("ingredients.ingredient", "name");

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
    res
      .status(500)
      .json({ message: "Error fetching history of all dishes", error });
  }
};