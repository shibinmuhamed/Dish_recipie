const express = require("express");
const cors = require("cors");

const connnectDb = require("./config/dbConnection");
const dishRoutes = require("./routes/dishRoutes");
const ingredientRoutes = require("./routes/ingRoutes");
const dishingRoutes = require("./routes/dishIngredientRoutes");
const user = require("./routes/loginRoutes");
const history = require("./routes/historyRoutes");
//const errorHandler = require("./middleware/errorHandler")
const dotenv = require("dotenv").config();
//const bcrypt = require('bcrypt');

connnectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({ origin: "*" }));
//app.use(errorHandler);


app.use("/api", dishRoutes);
app.use("/api", ingredientRoutes);
app.use("/api", dishingRoutes);
app.use("/api/user",user)
app.use("/api/dishes",history)


app.listen(port, () => {
  console.log(`the server running on port ${port}`);
});

