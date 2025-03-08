const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
        ? process.env.MONGO_URI
        : "mongodb://localhost:27017/Auroa"
    );
    console.log("Connect to MongoDB successfully");
  } catch (error) {
    console.error(`Connect to MongoDB failed: ${error}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
