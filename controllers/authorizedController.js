const Task = require("../models/taskModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");


exports.createTask = catchAsync(async (req, res) => {
    const userId = req.user.userId

    const {
        name,
        dateTime,
    } = req.body

    const task = new Task({
        userId,
        name,
        dateTime
    })

    await task.save()

    res.status(200).json({ status: "success", msg: "Task created", data: task})
})


exports.index = catchAsync (async (req, res) => {
    const userId = req.user.userId
    const user = await User.findOne({ _id: userId }, { password: 0 })
    const tasks = await Task.find({ userId })

    res.status(200).json({ status: 'success', msg: 'Contents Loaded', data: {
        user,
        tasks
    }})

})

exports.deleteTask = catchAsync(async (req, res) => {
    const userId = req.user.userId
    const taskId = req.query.taskId

    const task = await Task.findOne({ _id: taskId })

    if (task.userId !== userId) return res.status(401).json({ status: 'error', msg: 'Unauthorized' })
    
    await Task.deleteOne({ _id: taskId })

    res.status(200).json({ status: 'success', msg: 'Task Deleted' })
})

exports.completeTask = catchAsync( async (req, res) => {
    const userId = req.user.userId
    const taskId = req.query.taskId

    const task = await Task.findOne({ _id: taskId })

    if (task.userId !== userId) return res.status(401).json({ status: 'error', msg: 'Unauthorized' })

    await Task.updateOne({ _id: taskId }, { isComplete: true })

    res.status(200).json({ status: 'success', msg: 'Task Completed' })
})