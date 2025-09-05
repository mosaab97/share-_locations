const HttpError = require("../models/httpError");

const { v4: uuidv4 } = require('uuid');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'John Doe',
        email: 'u1@gmail.com',
        password: 'password123'
    },
    {
        id: 'u2',
        name: 'Jane Smith',
        email: 'u2@gmail.com',
        password: 'mypassword'
    }
];

const getAllUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { name, email, password } = req.body;

    if (DUMMY_USERS.find(u => u.email === email)) {
        return next(new HttpError('User exists already, please login instead.', 422));
    }
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    };
    DUMMY_USERS.push(newUser);
    res.status(201).json({ user: newUser });
}

const login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { email, password } = req.body;
    const existingUser = DUMMY_USERS.find(u => u.email === email);
    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }
    res.json({ message: 'Logged in!' });
}

module.exports = {
    getAllUsers,
    signup,
    login
};