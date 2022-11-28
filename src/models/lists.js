const { Schema, model } = require('mongoose');
const taskSchema = require('./task');



const listSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    task: [
        taskSchema
    ]
}, {
    timestamps: true,
});

const List = model("List", listSchema);

module.exports = List;
