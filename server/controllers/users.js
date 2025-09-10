const { validationResult } = require("express-validator");
const HttpError = require("../models/httpError");
const User = require("../models/user")

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

    const newUser = new User({
        name,
        email,
        image: "https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=",
        password,
        places: []
    })

    try {
        await newUser.save();
    } catch(err) {
        return next(new HttpError("Something went wrong, please try again", 500))
    }
    res.status(201).json({ user: newUser.toObject({ getters: true }) });
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
        return next(new HttpError("Something went wrong, please try again"))
    }
    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    res.json({ user: existingUser.toObject({ getters: true }) });
}

module.exports = {
    getAllUsers,
    signup,
    login
};