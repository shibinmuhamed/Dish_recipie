const asyncHandler = require("express-async-handler");
const User = require("../models/loginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password,role } = req.body;
  if (!username || !email || !password || !role ) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvilable = await User.findOne({ email });
  if (userAvilable) {
    res.status(400);
    throw new Error("user already registerd");
  }
 
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password:", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  console.log(`user created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("user data us not valid");
  }

  res.json({ message: "Register the user" });
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  const user = await User.findOne({ email: email.trim() });
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("password", password);

    return res.status(401).json({ message: "Email or password is not valid" });
  }
  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECERT,
    { expiresIn: "15m" }
  );

  console.log("Access Token:", accessToken);
  return res.status(200).json({ accessToken });
});



const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { getUsers, registerUser, loginUser, currentUser };
