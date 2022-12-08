const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const token = req.header("token");
    console.log(token);
    if(!token) {
        return res.status(403).json({ msg: "Authorization Denied" });
    }

    try {
        const verify = jwt.verify(token, process.env.jwtSecret);
        req.user = verify.user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};