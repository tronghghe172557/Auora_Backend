const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const user = await userModel
      .findById(newCustomer._id)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const accessToken = jwt.sign(
      { id: newCustomer._id, email: newCustomer.email },
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jwt.sign(
      { id: newCustomer._id, email: newCustomer.email },
      process.env.JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Customer created",
      data: { ...user, accessToken: accessToken, refreshToken: refreshToken },
    });
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
