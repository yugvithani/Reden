const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  signup,
  login,
  getCurrentUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUserById,
  updateProfileById,
  deleteUserById,
  createContact,
  getContactsByUser,
  deleteContactByUser
} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Use path.join and __dirname
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File naming
  }
});

const upload = multer({ storage: storage });
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new user
router.post('/signup', upload.single('profilePicture'), signup); // Add `upload.single('profilePicture')` middleware

// login
router.post('/login', login);

// get current user (Protected route)
router.get('/currentUser', authenticate, getCurrentUser);

// Get all users
router.get('/', getUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Get user by username
router.get('/getUserByUsername/:username', getUserByUsername);

// Update a user by ID
router.put('/:id', upload.single('profilePicture'), updateUserById);

// Update Method for User Profile
router.put('/:id/profile', updateProfileById);

// Delete a user by ID
router.delete('/:id', deleteUserById);

// Create a new contact
router.get('/contactBetween/:id/:cid', createContact);

// Get all contacts by user ID
router.get('/:id/contacts', getContactsByUser);

// Contact is delete with their related messages.
router.delete('/:id/contact/:cid', deleteContactByUser);

module.exports = router;
