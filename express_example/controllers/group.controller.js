import Group from '../models/Group';

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
        const { name, author } = req.body;
        if (!name) {
            return next(new Error('Name is require!'));
        }
        if (!author) {
            return next(new Error('Author is require!'));
        }
        const group = new Group({
            ...req.body
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
        if (!id) {
            return next(new Error('Id is require!'));
        }
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
        if (!id) {
            return next(new Error('id is require!'));
        }
        const { name, author } = req.body;
        if (!name) {
            return next(new Error('Name is require!'));
        }
        if (!author) {
            return next(new Error('Author is require!'));
        }
        const group = new Group({
            ...req.body
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
        if (!id) {
            return next(new Error('id is require!'));
        }
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

export default GroupController;