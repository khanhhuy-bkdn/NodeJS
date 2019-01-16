import Message from '../models/messages'
import Group from '../models/Group';
import User from '../models/user'
const mongoose = require('mongoose');
import { ResponseHandle } from './../helpers'
import { messageRespository } from '../respositories'

const MessageController = {};

MessageController.getAll = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const messages = await messageRespository.getAll({
            limit,
            page,
            sort: {
                _id: -1
            },
            populate: [
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'group',
                    select: 'name members'
                }
            ],
            lean: true,
        });
        // const messages = await Message
        //     .find()
        //     .sort({ _id: -1 }) // -1: cba, 1: abc
        //     .populate([
        //         {
        //             path: 'author',
        //             select: 'email fullName'
        //         },
        //         {
        //             path: 'group',
        //             select: 'name members'
        //         }
        //     ])
        //     .skip((parseInt(page) - 1) * parseInt(limit))
        //     .limit(parseInt(limit));
        return ResponseHandle.returnSuccess(res, 'Success!', messages);
    } catch (err) {
        return next(err);
    }
};

MessageController.getMessageById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const message = await messageRespository.getOne({
            where: {
                _id: id
            },
            populate: [
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'group',
                    select: 'name'
                }
            ]
        });
        if (!message) {
            return res.status(404).json({
                isSuccess: true,
                message: "Message is not exist!"
            });
        }
        return ResponseHandle.returnSuccess(res, 'Success!', message);
    } catch (err) {
        return next(err);
    }
};

MessageController.addMessage = async (req, res, next) => {
    try {
        const { group, message } = req.body;
        const author = req.user._id;
        const objGroup = await Group.findOne({ _id: group, members: author });
        if (!objGroup) {
            return next(new Error('Author is not exist in group!'));
        }
        const objMessage = new Message({
            message,
            group,
            author
        });
        await objMessage.save();
        return ResponseHandle.returnSuccess(res, 'Success!', objMessage);
    } catch (err) {
        return next(err);
    }
}

MessageController.updateMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const objMessage = await Message.findOne({ _id: id, author: user._id }).select('group message author');
        if (!objMessage) {
            return next(new Error('Message is not exist!'));
        }
        objMessage.group = req.body.group ? req.body.group : objMessage.group;
        objMessage.message = req.body.message ? req.body.message : objMessage.message;
        await objMessage.save();
        return ResponseHandle.returnSuccess(res, 'Success!', null);
    } catch (err) {
        return next(err);
    }
};

MessageController.deleteMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const message = await Message.findOne({ _id: id, author: user._id }).select('deleteAt');
        if (!message) {
            return next(new Error('Message is not exist!'));
        }
        message.deleteAt = Date.now();
        await message.save();
        return ResponseHandle.returnSuccess(res, 'Success!', null);
    } catch (err) {
        return next(err);
    }
};

export default MessageController;