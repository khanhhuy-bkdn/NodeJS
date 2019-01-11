import Message from '../models/messages'
import Group from '../models/Group';
import User from '../models/user'
const mongoose = require('mongoose');

const MessageController = {};

MessageController.getAll = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const messages = await Message
            .find()
            .sort({ _id: -1 }) // -1: cba, 1: abc
            .populate([
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'group',
                    select: 'name members'
                }
            ])
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));
        return res.status(200).json({
            isSuccess: true,
            messages,
        });
    } catch (err) {
        return next(err);
    }
};

MessageController.getMessageById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const message = await Message.findOne({ _id: id })
            .populate([
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'group',
                    select: 'name'
                }
            ]);
        if (!message) {
            return res.status(404).json({
                isSuccess: true,
                message: "Message is not exist!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            message
        });
    } catch (err) {
        return next(err);
    }
};

MessageController.addMessage = async (req, res, next) => {
    try {
        const { group, message } = req.body;
        const author = req.user._id;
        const objMessage = new Message({
            message,
            group,
            author
        });
        await objMessage.save();
        return res.status(201).json({
            isSuccess: true,
            objMessage
        });
    } catch (err) {
        return next(err);
    }
}

MessageController.updateMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const objMessage = await Message.findById(id).select('group message author').lean(true);
        if (!objMessage) {
            return next(new Error('Message is not exist!'));
        }
        objMessage.set({ ...req.body, deleteAt: null });
        await Message.update({ _id: id }, objMessage);
        return res.status(200).json({
            isSuccess: true,
            message: 'Update success!',
        });
    } catch (err) {
        return next(err);
    }
};

MessageController.deleteMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const message = await Message.findById(id).select('deleteAt').lean(true);
        if (!message) {
            return next(new Error('Message is not exist!'));
        }
        message.deleteAt = Date.now();
        await Message.update({ _id: id }, message);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return next(err);
    }
};

export default MessageController;