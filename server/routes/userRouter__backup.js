const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Adjust the path as per your actual file structure
const {
    getCurrentUser,
    loginUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
} = require('../controllers/userController'); // Adjust the path as per your actual file structure

// Apply authMiddleware to routes that need authentication
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUserById);
router.delete('/:id', authMiddleware, deleteUserById);

// Other routes (login, register, etc.)
router.post('/login', loginUser);
router.post('/register', createUser);
router.get('/', getAllUsers);


module.exports = router;
