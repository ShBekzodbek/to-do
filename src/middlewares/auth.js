const jwt = require("jsonwebtoken");

const config = process.env;

const authentication = (req, res, next) => {

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
        console.log(decoded);
        if (!decoded) {
            return res.status(401).send("Invalid Token ");
        }
    } catch (err) {
        return res.status(401).send({
            message: "There may some technical error during authentication",
            error: err.message
        });
    }
    return next();
};

// const authentication = (req, res, next) => {
//     const token = req.headers.authorization.split(' ')[1];
//     if (token) {
//         return jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
//             if (err) {
//                 return res.send({
//                     success: false,
//                     message: "Failed to authenticate token.",
//                 });
//             }
//             req.user = decoded;
//             return next();
//         });
//     }
//     return res.unauthorized();
// };

module.exports = authentication;

//Atomic habits
//the power of self discipline
//Diqqat