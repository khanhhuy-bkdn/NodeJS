import Group from '../models/Group';
import mongoose from 'mongoose';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {
    try {
        const groups = await Group.find().sort('-dateAdded').populate('author');
        if (!groups) {
            return res.status(404).json({
                isSuccess: false,
                message: "Groups is empty!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            groups,
        });
    } catch (err) {
        return next(err);
    }
};

GroupController.addGroup = async (req, res, next) => {
    try {
        const group = new Group({
            ...req.body,
            deleteAt: null
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

GroupController.getGroupById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const group = await Group.findOne({ _id: id }).populate('author');
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
        const group = await Group.findById(id);
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
        let group = await Group.findOne({ _id: id });
        if (!group) {
            return next(new Error('Group is not exist!'));
        }
        members.map((user, index) => {
            if (group.members.indexOf(mongoose.Types.ObjectId(user)) < 0) {
                group.members.push(user);
            } else {
                return next(new Error(`Members ${user} is exist!`));
            }
        });
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