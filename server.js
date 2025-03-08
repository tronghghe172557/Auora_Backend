const express = require("express");
const app = express();
const connectDb = require("./config/db");
const morgan = require("morgan");
const router = require("./router/index");

// Connect to MongoDB
connectDb();

//
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(router)

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
