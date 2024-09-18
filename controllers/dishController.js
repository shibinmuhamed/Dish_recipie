const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");

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

    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish", error });
  }
};
