const jwt = require('jsonwebtoken');



const userValidator = require('../utils/validators/user-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/users');


module.exports = class auth {

    static async register(req, res, next) {
        try {
            //joi validator 
            const { error } = userValidator(req.body);
            // console.log(error);

            if (error) {
                return res.status(400).send({
                    message: error.message
                })
            }

            const isValidEmail = await User.find({
                email: req.body.email
            });
            console.log(isValidEmail);
            if (isValidEmail.length > 0) {
                return res.status(400).send({
                    message: "Email already exits"
                });
            };
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({ ...req.body });
            user.password = encryptedPassword;
            const result = await user.save();

            const token = jwt.sign(
                { user_id: result._id, email: result.email },
                process.env.SECRET_KEY);

            user.token = token;
            await user.save();
            res.status(201).send({
                message: "User registered successfully",
                username: result.name,
                email: result.email,
                id: result._id,
                token
            });

            // console.log(result);
        } catch (error) {

            console.log('Error is in registreting endpoint' + error.message);
            return next(error);
            // res.status(500).send({
            //     message: "There may some technical errors during registering",

            // })
        }
    };
    static async logIn(req, res, next) {
        try {
            const { email, password } = req.body;
            //joi validator
            const user = await User.findOne({ email });
            if (!user || user.length <= 0) {
                return res.status(302).send({
                    message: "Email  or password invalid"
                })
            }
            const isValidPassword = bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(302).send({
                    message: "Email  or password invalid"
                })
            }
            const token = jwt.sign(
                {
                    user_id: user._id,
                    email
                },
                process.env.SECRET_KEY
            );

            user.token = token;
            await user.save();

            res.status(200).send({
                username: user.name,
                email,
                token
            })

        } catch (error) {
            console.log('Error is in log in endpoint' + error.message);
            return next(error);
            // res.status(500).send({
            //     message: "There may some technical errors during loging in",
            //     error: error.message
            // })
        }
    };
    static async logOut(req, res, next) {
        try {
            const id = req.params.id;
            console.log(id);
            const isValidId = await User.findById(id);
            // console.log(isValidId);
            if (!isValidId || isValidId.length <= 0) {
                return res.status(400).send({
                    message: "Invalid Id",
                })
            }
            const result = await User.findByIdAndDelete(id).select(
                "_id name email"
            );
            // console.log(result);
            return res.status(200).send({
                message: "Logged out",
                result
            })
        } catch (error) {
            console.log('Error is in log out endpoint' + error.message);
            return next(error);
        }
    };
    static async getUsers(req, res, next) {
        try {
            const users = await User.find()
                .select('_id name token');
            return res.status(200).send({
                message: "Users are ",
                users

            })
        } catch (error) {
            console.log('Error is in getting users endpoint' + error.message);
            return next(error);
            // return res.status(500).send({
            //     message: "There may some technical errors during getting users",
            //     error: error.message
            // })
        }
    };
    static async editUser(req, res, next) {
        try {
            const id = req.params.id;
            let response = {};
            const { name, email, password } = req.body;
            if (name) {
                const result = await User.findByIdAndUpdate(id, {
                    $set: {
                        name: name
                    }
                })
                await result.save();
                response.name = result.name;
            }
            if (email) {
                const result = await User.findByIdAndUpdate(id, {
                    $set: {
                        email: email
                    }
                })
                await result.save();
                response.email = result.email;
            }
            if (password) {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const result = await User.findByIdAndUpdate(id, {
                    $set: {
                        password: encryptedPassword
                    }
                })
                await result.save();
                response.password = result.password;
            }
            return res.status(200).send({
                message: "Updated things :",
                name: response.name,
                email: response.email,
                password: response.password
            })
        } catch (error) {
            console.log('Error is in editing user endpoint' + error.message);
            return next(error);
            // res.status(500).send({
            //     message: "There may some technical errors during updating user",
            //     error: error.message
            // })
        }
    }

}