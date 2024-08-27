const User = require("../models/user");

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Update a user by ID
  const updateUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  // Delete a user by ID
  const deleteUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
  };