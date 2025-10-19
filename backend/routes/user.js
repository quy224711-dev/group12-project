const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Khi server.js đã dùng '/users', ở đây chỉ cần '/' là đủ
router.get('/', userController.getUsers); 
router.post('/', userController.createUser);

// Tương tự, chỉ cần '/:id'
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
