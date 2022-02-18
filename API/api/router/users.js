const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const userController = require('../controller/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup',checkAuth, userController.users_signup );


router.post('/signin',checkAuth, userController.users_login);


router.delete('/:userId', checkAuth, userController.users_delete); 



module.exports = router;