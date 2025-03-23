const express = require("express");
const {
  createImage,
  getImages,
  getById,
  deleteImage,
  getImagesByUsers,
  uploadImage,
} = require("../controllers/image.controller");
const authGuard = require("../middlewares/authGuard");
const upload = require("../middlewares/upload");
const imageRouter = express.Router();

imageRouter.get("/", authGuard, getImages);
imageRouter.get("/users/:userId", authGuard, getImagesByUsers);
imageRouter.get("/:id", authGuard, getById);
imageRouter.post("/", authGuard, createImage);
imageRouter.delete("/:id", authGuard, deleteImage);

// Thêm route mới cho việc upload ảnh
imageRouter.post("/upload", upload.single("image"), uploadImage);
module.exports = imageRouter;
