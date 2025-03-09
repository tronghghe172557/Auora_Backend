const express = require("express");
const router = express.Router();
const imageRouter = require("./image.router");
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
 
// API routes
router.use("/api/image", imageRouter);
router.use("/api/user", userRouter);
// Auth routes
router.use("/api/auth", authRouter);

module.exports = router;
