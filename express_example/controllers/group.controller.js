import Group from '../models/Group';
import User from '../models/user'
const mongoose = require('mongoose');
import { ResponseHandle } from './../helpers'

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
        return ResponseHandle.returnSuccess(res, 'Success!', groups);
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
        return ResponseHandle.returnSuccess(res, 'Success!', group);
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
        let typeGroup = '';
        if (addedMember.length > 2) {
            typeGroup = 'PUBLIC';
        }
        else {
            typeGroup = 'PRIVATE';
            const groupMembers = await Group.findOne({ members: { $all: addedMember } }).select('members').lean(); //[1,2] === [2,1]
            if (groupMembers) {
                if (addedMember.length === groupMembers.members.length) {
                    return next(new Error('Group is exist in DB!'));
                }
            }
        }
        const group = new Group({
            name,
            members: addedMember,
            author,
            type: typeGroup
        });
        await group.save();
        return ResponseHandle.returnSuccess(res, 'Success!', group);
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
        return ResponseHandle.returnSuccess(res, 'Update success!', null);
    } catch (err) {
        return next(err);
    }
};

GroupController.deleteGroup = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await Group.findOne({ _id: id, author: req.user._id }).select('deleteAt').lean(true);
        if (!group) {
            return next(new Error('Group is not exist!'));
        }
        group.deleteAt = Date.now();
        await Group.update({ _id: id }, group);
        return ResponseHandle.returnSuccess(res, 'Delete success!', null);
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
        return ResponseHandle.returnSuccess(res, 'Add members success!', null);
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
        return ResponseHandle.returnSuccess(res, 'Delete member success!', null);
    } catch (err) {
        return next(err);
    }
};

export default GroupController;