const express = require('express');
const {
  signup,
  login,
  getCurrentUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createContact,
  getContactsByUser,
  deleteContactByUser
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new user
router.post('/signup', signup);

// login
router.post('/login', login);

// get current user (Protected route)
router.get('/currentUser', authenticate, getCurrentUser);

// Get all users
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', updateUserById);

// Delete a user by ID
router.delete('/:id', deleteUserById);

// Create a new contact
router.post('/contactBetween/:id/:cid', createContact);

// Get all contacts by user ID
router.get('/:id/contacts', getContactsByUser);

// Contact is delete with their related messages.
router.delete('/:id/contact/:cid', deleteContactByUser);

module.exports = router;
