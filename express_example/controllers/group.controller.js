import Group from '../models/Group';
import User from '../models/user'
const mongoose = require('mongoose');

const GroupController = {};

GroupController.checkExistMember = async (member) => {
    const user = await User.findOne({ _id: member }).select('email').lean(true);
    if (!user) {
        return false;
    }
    return true;
}

GroupController.getAll = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const groups = await Group
            .find()
            .sort({ _id: -1, name: -1 }) // -1: cba, 1: abc
            .populate([
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'members',
                    select: 'email fullName'
                }
            ])
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));
        return res.status(200).json({
            isSuccess: true,
            groups,
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.getGroupById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await Group.findOne({ _id: id })
            .populate([
                {
                    path: 'author',
                    select: 'email fullName'
                },
                {
                    path: 'members',
                    select: 'email fullName'
                }
            ]);
        if (!group) {
            return res.status(404).json({
                isSuccess: true,
                message: "Group is not exist!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            group
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.addGroup = async (req, res, next) => {
    try {
        const { members, name } = req.body;
        const author = req.user._id;
        const setOfMembers = new Set();
        members.push(author);
        for (const member of members) {
            setOfMembers.add(member);
        }
        const addedMember = Array.from(setOfMembers);
        const group = new Group({
            name,
            members: addedMember,
            author
        });
        await group.save();
        return res.status(201).json({
            isSuccess: true,
            group
        });
    } catch (err) {
        return next(err);
    }
}

GroupController.updateGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = new Group({
            ...req.body,
            deleteAt: null
        });
        group._id = id;
        await Group.findOneAndUpdate({ _id: id }, group, { new: true });
        return res.status(200).json({
            isSuccess: true,
            message: 'Update success!',
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.deleteGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await Group.findById(id).select('deleteAt').lean(true);
        if (!group) {
            return next(new Error('Group is not exist!'));
        }
        group.deleteAt = Date.now();
        await Group.update({ _id: id }, group);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.addMemberGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { members } = req.body;
        const group = await Group.findOne({ _id: id }).select('author members').lean(true);
        if (!group) {
            return next(new Error('Group is not exist!'));
        }
        // members.map((user, index) => {
        //     if (group.members.indexOf(mongoose.Types.ObjectId(user)) < 0) {
        //         group.members.push(user);
        //     } else {
        //         return next(new Error(`Members ${user} is exist!`));
        //     }
        // });
        const setOfMembers = new Set();
        for (const member of group.members) {
            setOfMembers.add(member.toString());
        }
        for (const member of members) {
            setOfMembers.add(member);
        }
        group.members = Array.from(setOfMembers);
        await Group.update({ _id: id }, group);
        return res.status(200).json({
            isSuccess: true,
            message: 'Add member success!',
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.deleteMemberGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const idmember = req.params.idmember;
        const group = await Group.findById(id);
        if (!group) {
            return next(new Error('Group is not exist!'));
        }
        let check = false;
        group.members.map((user, index) => {
            if (user.toString() === idmember) {
                group.members.splice(index, 1);
                check = true;
            }
        });
        if (!check) {
            return next(new Error('Member is not exist!'));
        }
        await Group.update({ _id: id }, group);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete member success!'
        });
    } catch (err) {
        return next(err);
    }
};

export default GroupController;