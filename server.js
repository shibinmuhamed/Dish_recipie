<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const dishRoutes = require('./routes/dishRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/dishes', dishRoutes);
app.use('/api/ingredients', ingredientRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
       
=======
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
>>>>>>> f3bf3d1 (Initial commit)
