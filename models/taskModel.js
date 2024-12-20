const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true

    },
    dateTime: {
        type: Date,
    },

    isComplete: {
        type: Boolean,
        default: false
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task