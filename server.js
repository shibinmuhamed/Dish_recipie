const express = require("express");
const connnectDb = require("./config/dbConnection");
const dishRoutes = require("./routes/dishRoutes");
const ingredientRoutes = require("./routes/ingRoutes");
const dishingRoutes = require("./routes/dishingRoutes");
const dotenv = require("dotenv").config();

connnectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());

app.use("/api", dishRoutes);
app.use("/api", ingredientRoutes);
app.use("/api", dishingRoutes);


app.listen(port, () => {
  console.log(`the server running on port ${port}`);
});
