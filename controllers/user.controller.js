const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, addresses } = req.body;

    if (!name || !email || !password || !phone || !addresses) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newCustomer = new userModel({
      name,
      email,
      password: hashedPass,
      phone,
      addresses,
    });

    newCustomer.save();

    return res
      .status(200)
      .json({ message: "Customer created", data: newCustomer });
  } catch (error) {
    console.log("Error creating customer:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const customer = await userModel.findOne({ email });

  if (customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password false" });
  }

  return res.status(200).json({ message: "Login success" });
};

module.exports = { register, login };
