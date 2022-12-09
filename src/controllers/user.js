const jwt = require('jsonwebtoken');


// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:
//     }
// }))



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
            // console.log(isValidEmail);
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
                { user_id: result._id },
                process.env.SECRET_KEY);

            user.token = token;
            await user.save();
            res.status(201).send({
                message: "User registered successfully",
                username: result.fullname,
                email: result.email,
                id: result._id,
                role: result.role,
                token
            });

            // console.log(result);
        } catch (error) {

            console.log('Error is in registreting endpoint' + error.message);
            return next(error);

        }
    };
    static async logIn(req, res, next) {
        try {
            const { email, password } = req.body;
            //joi validator
            const user = await User.findOne({ email: email });
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
                },
                process.env.SECRET_KEY
            );

            user.token = token;
            await user.save();

            res.status(200).send({
                username: user.fullname,
                email,
                token
            })

        } catch (error) {
            console.log('Error is in log in endpoint' + error.message);
            return next(error);

        }
    };
    static async logOut(req, res, next) {
        try {
            const id = req.params.id;
            // console.log(id);

            if (req.user._id == id) {
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
            } else {
                return res.status(400).send({
                    message: "User not found "
                })
            }
        } catch (error) {
            console.log('Error is in log out endpoint' + error.message);
            return next(error);
        }
    };
    static async getUsers(req, res, next) {
        try {
            const users = await User.find()
                .select('-__v');

            if (req.user.role == "admin") {
                return res.status(200).send({
                    message: "Users are ",
                    users

                })
            } else {
                return res.status(200).send({

                    user: req.user
                })
            }


        } catch (error) {
            console.log('Error is in getting users endpoint' + error.message);
            return next(error);
        }
    };
    static async editUser(req, res, next) {
        try {
            const id = req.params.id;
            if (req.user._id == id) {
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
            } else {
                return res.status(400).send({
                    message: "Don't try to enter to another person's profile"
                })
            }

        } catch (error) {
            console.log('Error is in editing user endpoint' + error.message);
            return next(error);

        }
    }

}