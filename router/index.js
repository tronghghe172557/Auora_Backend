const express = require("express");
const userRouter = require("./user.router");
const imageRouter = require("./image.router");
const router = express.Router();
// API routes
router.use("/api/auth", userRouter);
router.use("/api/image", imageRouter);

module.exports = router;
