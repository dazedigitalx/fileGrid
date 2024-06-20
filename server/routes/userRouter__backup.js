const express = require('express');
const router = express.Router();
const {
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
    loginUser, // Import loginUser function from userController
} = require('../controllers/userController');





// Login route
router.post('/login', loginUser);

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:id', getUserById);

// // POST create new user
router.post('/register', createUser);

// PUT update user by ID
router.put('/:id', updateUserById);

// DELETE delete user by ID
router.delete('/:id', deleteUserById);

module.exports = router;
