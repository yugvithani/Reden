const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createContact,
  getContactsByUser,
  deleteContactByUser
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

// Create a new contact
router.get('/contactBetween/:id/:cid', createContact);

// Get all contacts by user ID
router.get('/:id/contacts', getContactsByUser);

// Contact is delete with their related messages.
router.delete('/:id/contact/:cid', deleteContactByUser);

module.exports = router;
