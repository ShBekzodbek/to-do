const Joi = require('joi');

const userValidator = (data, error) => {

    const userSchema = Joi.object({
        fullname: Joi.string().min(3).max(250).required(),
        email: Joi.string().min(3).max(250).required(),
        role: Joi.string().default("normal"),
        password: Joi.string().min(4).max(100).required().trim(),
    })
    if (error) {
        console.log(error.message);
        throw new Error(`User Validation error : ${error.message}`)
    }
    return userSchema.validate(data);

};

module.exports = userValidator;


