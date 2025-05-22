const { User } = require("../db/models/User");

const getUsers = async (req, res) => {
  try {
    // Get the current user to know their genderPreference and cheersTo
    const currentUser = await User.findById(req.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Current user not found" });
    }
    // Only show users matching the current user's genderPreference AND cheersTo AND who also want the current user's gender
    const users = await User.find({
      gender: currentUser.genderPreference,
      genderPreference: currentUser.gender, // Only show users who want my gender
      cheersTo: { $in: currentUser.cheersTo },
      _id: { $ne: req.id },
    });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToFav = async (req, res) => {
  const myId = req.id;
  const { id } = req.params;
  try {
    let user = await User.findByIdAndUpdate(
      { _id: myId },
      {
        $push: { favourites: id },
      }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Added to favourites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToDis = async (req, res) => {
  const myId = req.id;
  const { id } = req.params;
  try {
    let user = await User.findByIdAndUpdate(
      { _id: myId },
      {
        $push: { disliked: id },
      }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Added to disliked" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFromFav = async (req, res) => {
  const myId = req.id;
  try {
    let user = await User.findById({ _id: myId }).populate({
      path: "favourites",
      select: "name email profile _id",
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user.favourites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const reqId = req.id;
    const {
      name,
      email,
      password,
      profile,
      publicId,
      cheersTo,
      age,
      gender,
      genderPreference,
    } = req.body;
    const updateFields = {
      name,
      email,
      profile,
      publicId,
      cheersTo,
      age,
      gender,
      genderPreference,
    };
    if (password) {
      const bcrypt = require("bcrypt");
      updateFields.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(
      reqId,
      { $set: updateFields },
      { new: true, select: "-password" }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, addToDis, addToFav, getFromFav, updateProfile };
