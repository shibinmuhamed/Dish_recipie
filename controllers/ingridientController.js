const Ingredient = require("../models/Ingredient");

// Add a new ingredient
exports.createIngredient = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const ingredient = new Ingredient({ name, quantity });
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: "Error creating ingredient", error });
  }
};

// Get all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ingredients", error });
  }
};

//update ingredient
exports.updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByIdAndUpdate(id, req.body);

    if (!ingredient) {
      return res.status(404).json({ message: "`ingreident not found" });
    }

    const updatedIngredient = await Ingredient.findById(id);
    res.status(200).json(updatedIngredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete ingreidient
exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByIdAndDelete(id);

    if (!ingredient) {
      return res.status(404).json({ message: "`ingreident not found" });
    }

    res.status(200).json({ message: "Ingredient deleted succefully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
