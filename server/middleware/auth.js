const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) throw new Error(); 
        const decodedToken = jwt.verify(token, 'secret');
        req.user = decodedToken
        next();
    } catch(e) {
        return next(new HttpError("Auth Failed", 401));
    }
}