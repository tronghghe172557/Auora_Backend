const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
// API routes
router.use("/api/auth/", userModel);

module.exports = router;
