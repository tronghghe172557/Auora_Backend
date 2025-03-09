const express = require("express");
const {
  createImage,
  getImages,
  getById,
  deleteImage,
} = require("../controllers/image.controller");
const authGuard = require("../middlewares/authGuard");
const imageRouter = express.Router();

imageRouter.get("/", authGuard, getImages);
imageRouter.get("/:id", authGuard, getById);
imageRouter.post("/", authGuard, createImage);
imageRouter.delete("/:id", authGuard, deleteImage);

module.exports = imageRouter;
