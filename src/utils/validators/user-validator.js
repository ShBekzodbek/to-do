const Joi = require('joi');

const userValidator = (data, error) => {

    const userSchema = Joi.object({
        name: Joi.string().min(3).max(250).required(),
        email: Joi.string().min(3).max(250).required(),
        password: Joi.string().min(4).max(100).required().trim(),
    })
    if (error) {
        console.log(error.message);
        throw new Error(`User Validation error : ${error.message}`)
    }
    return userSchema.validate(data);

};

module.exports = userValidator;


