const jwt = require("jsonwebtoken");

const User = require('../models/users');

const config = process.env;

const authentication = async (req, res, next) => {

    try {
        // console.log(req.headers.authorization);
        if (req.headers.authorization == undefined) {
            return res.status(403).send("A token is required for authentication");
        }
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token);
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        const decoded = jwt.verify(token, config.SECRET_KEY);
        if (!decoded || decoded.length <= 0) {
            req.user = undefined;
            return res.status(401).send("Invalid Token ");
        }
        // console.log(decoded.user_id);
        const user = await User.findById(decoded.user_id);
        if (!user || user.length <= 0) {
            req.user = undefined;
            return res.status(400).send("Invalid User id");
        }

        req.user = user;
        // console.log(decoded);

    } catch (err) {
        return res.status(401).send({
            message: "There may some technical error during authentication",
            error: err.message
        });
    }
    return next();
};


module.exports = authentication;

//Atomic habits
//the power of self discipline
//Diqqat