const { Schema } = require('mongoose');




const taskSchema = new Schema({
    status: {
        type: String,
        enum: ['Doing', 'Important', "Needed", "I'll do later", "On plan"],
        default: 'On plan',

    },
    title: {
        type: String,
        default: '',
        trim: true,
        // required: 'Title cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    start: {
        type: Date,
        default: Date.now(),
        // required: 'Must have start date - default value is the created date'
    },
    end: {
        type: Date,
        default: Date.now() + 1, // Date in one week from now
        // required: 'Must have end date - default value is the created date + 1 day'
    },

});


module.exports = taskSchema;
