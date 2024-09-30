const Ingredient = require("../models/ingredient");

const ApiFeatures = require("../Utils/apiFeatures");



// Add a new ingredient
exports.createIngredient = async (req, res) => {
  try {
    const { name, stockQuantity } = req.body;

    // Check if the name or stockQuantity is missing
    if (!name || stockQuantity == null) {
      return res.status(400).json({ message: "Name and stockQuantity are required" });
    }

    // Create a new ingredient
    const ingredient = new Ingredient({
      name,
      stockQuantity: Number(stockQuantity), // Ensure stockQuantity is a number
    });

    // Save the ingredient to the database
    await ingredient.save();

    // Respond with the created ingredient
    res.status(201).json({ message: "Ingredient created successfully", ingredient });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error handling
      return res.status(400).json({
        message: `Ingredient with the name '${error.keyValue.name}' already exists`,
      });
    }
    
    // Catch any other errors
    console.error("Error creating ingredient:", error);
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
