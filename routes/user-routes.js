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
router.post('/users', createUser);

// Get all users
router.get('/users', getUsers);

// Get a single user by ID
router.get('/users/:id', getUserById);

// Update a user by ID
router.put('/users/:id', updateUserById);

// Delete a user by ID
router.delete('/users/:id', deleteUserById);

module.exports = router;
