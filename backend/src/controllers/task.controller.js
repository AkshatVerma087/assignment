const taskModel = require('../models/task.model');
const mongoose = require('mongoose');

function getTaskIdFromRequest(req) {
    return req.params?.id || req.body?.taskId || req.query?.taskId;
}

async function createTask(req, res){
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        const {title, description} = req.body;
        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        const isTaskExist = await taskModel.findOne({title: title, user: req.user._id});
        if (isTaskExist) {
            return res.status(400).json({message: 'Task already exists'});
        }

        const task = await taskModel.create({
            title,
            description,
            user: req.user._id
        });
        res.status(201).json({
            message: 'Task created successfully',
            task: {
                _id: task._id,
                title: task.title,
                description: task.description
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task' });
    }
} 

async function getTasks(req, res){
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        const tasks = await taskModel.find({user: req.user._id}).sort({timestamp: -1});

        if(tasks.length === 0){
            return res.status(200).json({
                message: 'No tasks found',
                tasks: []
            });
        }
        res.status(200).json({
            message: 'Tasks fetched successfully',
            tasks: tasks.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status
            }))
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
}

async function updateTask(req, res){
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        const taskId = getTaskIdFromRequest(req);
        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Valid taskId is required' });
        }

        const {title, description, status} = req.body;
        const allowedStatus = ['pending', 'in-progress', 'completed'];

        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: 'Invalid task status'
            });
        }

        const task = await taskModel.findOne({_id: taskId, user: req.user._id});

        if(!task){
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task: {
                _id: task._id,
                title: task.title,
                description: task.description,
                status: task.status
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task' });
    }
}

async function deleteTask(req, res){
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        const taskId = getTaskIdFromRequest(req);
        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Valid taskId is required' });
        }

        const task = await taskModel.findOne({_id: taskId, user: req.user._id});
        if(!task){
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        await task.deleteOne();
        res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task' });
    }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
