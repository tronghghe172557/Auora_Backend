const imageModel = require("../models/image.model");
const mongoose = require("mongoose");

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
    const userId = req.user.id;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const images = await imageModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .populate("userId", "username email")
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

module.exports = {
  createImage,
  getImages, // Note: renamed getImage -> getImages for clarity
  getById,
  deleteImage,
};
