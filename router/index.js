const express = require("express");
const userRouter = require("./user.router");
const router = express.Router();
// API routes
router.use("/api/auth", userRouter);

module.exports = router;
