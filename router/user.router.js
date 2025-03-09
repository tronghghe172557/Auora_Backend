const express = require("express");
const { getUsers, getUserDetail, deleteUser, updateUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserDetail);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);

module.exports = userRouter;