const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt.utils");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("req.body", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExist = await userModel.findOne({ email }).lean();

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newCustomer = new userModel({
      username,
      email,
      password: hashedPass,
    });

    newCustomer.save();

    const user = newCustomer.toObject();
    delete user.password;

    return res.status(200).json({
      message: "Customer created",
      data: {
        ...user,
        accessToken: generateToken(
          { id: newCustomer._id, email: newCustomer.email },
          "1d"
        ),
        refreshToken: generateToken(
          { id: newCustomer._id, email: newCustomer.email },
          "7d"
        ),
      },
    });
  } catch (error) {
    console.log("Error creating customer:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  console.log('user', user)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password false" });
  }

  const userObj = user.toObject();
  delete userObj.password;

  return res.status(200).json({
    message: "Login success",
    data: {
      ...userObj,
      accessToken: generateToken({ id: user._id, email: user.email }, "1d"),
      refreshToken: generateToken({ id: user._id, email: user.email }, "7d"),
    },
  });
};

module.exports = { register, login };
