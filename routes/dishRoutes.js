const express = require("express");
const {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
  //updateDishWithHistory,
  startCooking,
  stopCooking,
  getAllDishesHistory,
  addIngredientsAndUpdateStock
} = require("../controllers/dishController");
const router = express.Router();

router.post("/dish", createDish);
router.get("/dishes", getAllDishes);

router.get("/dish/:Id", getDishById);
router.put("/dish/:Id", updateDish);
router.delete("/dish/:Id", deleteDish);

//router.put('/dishes/:dishId',updateDishWithHistory);
router.put('/dishes/:dishId/start',startCooking);
router.put('/dishes/:dishId/stop', stopCooking);
router.get('/dishes/history',getAllDishesHistory);


router.put('/dishes/:dishId/add-ing', addIngredientsAndUpdateStock);



module.exports = router;
