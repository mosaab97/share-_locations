const express = require('express');
const { check } = require('express-validator');

const { getAllUsers, signup, login } = require('../controllers/users');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.get('/', getAllUsers);

router.post('/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ], signup);

router.post('/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ], login);

module.exports = router;