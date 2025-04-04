const imageModel = require("../models/image.model");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const createImage = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const userId = req.user.id; // Assuming this comes from your auth middleware

    console.log({ title, image, description, userId });
    if (!title || !image || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newImage = new imageModel({
      title,
      userId,
      image,
      description,
    });

    await newImage.save();

    return res.status(201).json({
      message: "Image created successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("Error creating image:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await imageModel
      .find()
      .populate("userId", "_id username email avatar")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Images retrieved successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error retrieving images:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getImagesByUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const images = await imageModel
      .find({ userId: userId })
      .populate("userId", "_id username email avatar")
      .lean();

    return res.status(200).json({
      message: "Images retrieved successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error retrieving images:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const image = await imageModel
      .findById(id)
      .populate("userId", "username email")
      .lean();

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({
      message: "Image retrieved successfully",
      data: image,
    });
  } catch (error) {
    console.error("Error retrieving image:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming this comes from your auth middleware

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const image = await imageModel.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if the user is the owner of the image
    if (image.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own images" });
    }

    await imageModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Upload ảnh lên Cloudinary với kích thước tối ưu cho web
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên một file ảnh" });
    }

    // Upload lên Cloudinary với các tùy chọn tối ưu
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "aurora_app",
      use_filename: true,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Giới hạn kích thước tối đa
        { quality: "auto:good" }, // Tự động điều chỉnh chất lượng
        { fetch_format: "auto" } // Tự động chọn định dạng tối ưu (WebP cho các trình duyệt hỗ trợ)
      ]
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Upload ảnh thành công",
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi upload ảnh", error: error.message });
  }
};
module.exports = {
  createImage,
  getImages, // Note: renamed getImage -> getImages for clarity
  getById,
  deleteImage,
  getImagesByUsers,
  uploadImage,
};
