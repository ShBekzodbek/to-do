const { Schema, model } = require('mongoose');

const validator = require('validator');


const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "fullname not provided"]
    },
    email: {
        type: String,
        required: [true, "Email not provided"],
        unique: [true, "Email already exists in database"],
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        },

    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        default: "normal",
        required: [true, "Please specify user role"]
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

