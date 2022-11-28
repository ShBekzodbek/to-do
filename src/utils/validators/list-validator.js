const Joi = require('joi');

const listValidator = (data, error) => {

    const listSchema = Joi.object({
        owner: Joi.string().min(15).max(250).required().id(),
        title: Joi.string().min(3).max(250).required(),
        task: Joi.string(),
    })
    if (error) {
        console.log(error.message);
        throw new Error(`List Validation error : ${error.message}`)
    }
    return listSchema.validate(data);

};

module.exports = listValidator;


