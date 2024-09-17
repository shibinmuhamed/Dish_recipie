const Dish = require('../models/dishModel');


// Create a new dish 
const createDish = async (req, res) => {
  try {
    const { name, ingredients } = req.body; 
    const dish = new Dish({ name, ingredients });
    await dish.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all dishes
const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({}, 'name');
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get dish by ID with ingredient details
const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('ingredients.ingredient');
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Set quantities for ingredients in a dish
const setIngredientQuantities = async (req, res) => {
  try {
    const { quantities } = req.body; // {ingredientId: quantity}
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    dish.ingredients.forEach((item) => {
      const quantity = quantities[item.ingredient.toString()];
      if (quantity) {
        item.quantity = quantity;
      }
    });
    await dish.save();
    res.status(200).json({
      message: 'Ingredient quantities updated successfully',
      dish,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createDish,
  getDishes,
  getDishById,
  setIngredientQuantities,
};
