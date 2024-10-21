const Ingredient = require("../models/ingredient");
const DishHistory = require("../models/dishHistory");
const mongoose = require("mongoose");
const Dish = require("../models/Dish");

exports.getDishHistory = async (req, res) => {
  try {
    const { name, status, startDate, endDate } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name.trim(), $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.updatedAt = {};

      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start)) {
          return res.status(400).json({ message: "Invalid startDate format" });
        }
        query.updatedAt.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end)) {
          return res.status(400).json({ message: "Invalid endDate format" });
        }
        query.updatedAt.$lte = end;
      }
    }

    const historyEntries = await DishHistory.find(query)
      .populate("ingredients.ingredient", "name")
      .sort({ updatedAt: -1 });

    console.log(query, "Query executed");
    console.log(historyEntries, "History entries found");

    if (!historyEntries.length) {
      return res
        .status(404)
        .json({ message: "No matching history entries found." });
    }

    res.status(200).json({
      message: "Dish history retrieved successfully",
      history: historyEntries,
    });
  } catch (error) {
    console.error("Error fetching or filtering dish history:", error);
    res.status(500).json({
      message: "Error fetching or filtering dish history",
      error: error.message || "An unknown error occurred",
      stack: error.stack,
    });
  }
};

exports.clearAllHistory = async (req, res) => {
  try {
    const result = await DishHistory.deleteMany({});

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No history records found to delete." });
    }

    res.status(200).json({ message: "All dish history cleared successfully." });
  } catch (error) {
    console.error("Error clearing dish history:", error);
    res.status(500).json({ message: "Error clearing dish history", error });
  }
};
