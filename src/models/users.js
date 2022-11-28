const { Schema, model } = require('mongoose');

const validator = require('validator');


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    token: { type: String },
    list: [{
        type: Schema.Types.ObjectId,
        ref: "List",
    }],
}, {
    timestamps: true,
});


const User = model("User", userSchema);

module.exports = User;

