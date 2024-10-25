const Ingredient = require('../../models/ingredient');
const DishHistory = require("../models/dishHistory");
const mongoose = require("mongoose");
const ApiFeatures = require("../Utils/apiFeatures");
const Dish = require("../models/Dish");
//const tryCatch = require("../Utils/tryCatch");

exports.createDish = async (req, res) => {
  try {
    const { name, ingredients } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Dish name is required." });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one ingredient is required." });
    }

    const invalidIngredients = ingredients.filter(
      (i) => !i.ingredient || !mongoose.Types.ObjectId.isValid(i.ingredient)
    );

    if (invalidIngredients.length > 0) {
      return res
        .status(400)
        .json({ message: "Each ingredient must have a valid ID." });
    }

    const ingredientIds = ingredients.map((i) => i.ingredient);
    const foundIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });

    if (foundIngredients.length !== ingredients.length) {
      return res.status(400).json({
        message: "Some ingredients are not valid or do not exist in the stock.",
      });
    }

    const dish = new Dish({ name: name.trim(), ingredients });
    await dish.save();

    res.status(201).json(dish);
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ message: "Error creating dish", error });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const { searchQuery, page = 1, limit = 10 } = req.query;

    const query = {};

    if (searchQuery && searchQuery.trim() !== "") {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        {
          "ingredients.ingredientName": { $regex: searchQuery, $options: "i" },
        },
      ];
    }

    const dishes = await Dish.find(query)
      .populate("ingredients.ingredient", "name stockQuantity")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ name: 1 });

    if (dishes.length === 0) {
      return res.status(404).json({ message: "No matching dishes found." });
    }

    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const { Id } = req.params;

    const dish = await Dish.findById(Id).populate(
      "ingredients.ingredient",
      "name stockQuantity"
    );

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish", error });
  }
};

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

exports.startCooking = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "Ingredients must be a non-empty array." });
    }

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const historyIngredients = dish.ingredients.map((ing) => ({
      ingredient: ing.ingredient,
      quantity: ing.quantity || 0,
    }));

    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: historyIngredients,
      status: "cooking started",
      updatedAt: new Date(),
    });

    await historyEntry.save();

    for (const ing of ingredients) {
      const ingredientId = new mongoose.Types.ObjectId(ing.ingredientId);

      const globalIngredient = await Ingredient.findById(ingredientId);
      if (!globalIngredient) {
        return res
          .status(404)
          .json({
            message: `Ingredient with id ${ingredientId} not found in global stock`,
          });
      }

      const newQuantity = ing.newQuantity || 0;
      if (globalIngredient.stockQuantity < newQuantity) {
        return res
          .status(400)
          .json({
            message: `Insufficient stock for ingredient ${globalIngredient.name}`,
          });
      }

      globalIngredient.stockQuantity -= newQuantity;
      await globalIngredient.save();

      const dishIngredient = dish.ingredients.find((i) =>
        i.ingredient.equals(ingredientId)
      );

      if (dishIngredient) {
        dishIngredient.quantity = (dishIngredient.quantity || 0) + newQuantity;
      } else {
        dish.ingredients.push({
          ingredient: ingredientId,
          quantity: newQuantity,
        });
      }
    }

    await dish.save();

    res
      .status(200)
      .json({
        message: "Cooking started, ingredients updated, and stock deducted",
        dish,
      });
  } catch (error) {
    console.error("Error updating ingredients and stock:", error);
    res
      .status(500)
      .json({ message: "Error updating ingredients and stock", error });
  }
};

exports.stopCooking = async (req, res) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const historyEntry = new DishHistory({
      dishId: dish._id,
      name: dish.name,
      ingredients: dish.ingredients,
      status: "cooking ended",
      updatedAt: new Date(),
    });
    await historyEntry.save();

    res.status(200).json({ message: "Cooking ended", dish });
  } catch (error) {
    res.status(500).json({ message: "Error stopping cooking process", error });
  }
};
