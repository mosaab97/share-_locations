const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require("../models/httpError");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        return next(new HttpError('Error Fetching users, please try again', 500));
    }
    res.json({ users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email})
    } catch(err) {
        return next(new HttpError("Sign up failed, try again later", 500));
    }
    if(existingUser) {
        return next(new HttpError("User exists already, login insted", 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch(e) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }
    const newUser = new User({
        name,
        email,
        image: req.file.path.replace(/\\/g, '/'),
        password: hashedPassword,
        places: []
    })

    try {
        await newUser.save();
    } catch(err) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }

    let token;
    try {
        token = jwt.sign({userId: newUser.id, email: newUser.email}, 'secret', {expiresIn: '1h'})
    } catch(e) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token });
}

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }

    if (!existingUser) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    let isValidPass = false;
    try {
        isValidPass = await bcrypt.compare(password, existingUser.password);
    } catch(e) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }

    if(!isValidPass) return next(new HttpError('Invalid credentials, could not log you in.', 401));

    let token;
    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, 'secret', {expiresIn: '1h'})
    } catch(e) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }

    res.status(200).json({ userId: existingUser.id, email: existingUser.email, token });

}

module.exports = {
    getAllUsers,
    signup,
    login
};