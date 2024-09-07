const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', updateUserById);

// Delete a user by ID
router.delete('/:id', deleteUserById);

module.exports = router;
