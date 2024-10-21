const express = require("express");
const {getUsers,
    //createUser,
    registerUser,
    loginUser,
    currentUser
} = require("../controllers/loginController");
const validateToken = require("../middleware/validationTokenHandler");
const router = express.Router();

router.get('/',getUsers);

//router.post('/',createUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current",validateToken,currentUser);
module.exports = router;
