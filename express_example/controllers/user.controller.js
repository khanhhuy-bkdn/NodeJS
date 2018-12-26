import User from '../models/user';

const UserController = {};

UserController.getAll = async (req, res, next) => {
    try {
        const users = await User.find(
            // {
            //     $or: [
            //         {
            //             isDelete: false
            //         },
            //         {
            //             isDelete: null
            //         }
            //     ]
            // }
        ).sort('-dateAdded');
        if (!users) {
            return res.status(200).json({
                isSuccess: true,
                message: "Users is empty!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            users,
        });
    } catch (err) {
        return next(err);
        // return res.status(400).json({
        //     isSuccess: false,
        //     message: err.message,
        //     error: err
        // });
    }
};

UserController.addUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, gender, address, age } = req.body;
        if (!email) {
            return next(new Error('Email is require!'));
            // return res.status(400).json({
            //     isSuccess: false,
            //     message: 'Email is require!'
            // });
        }
        if (!password) {
            return next(new Error('Password is require!'));
        }
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            gender,
            address,
            age
        });
        await user.save();
        return res.status(201).json({
            isSuccess: true,
            user: user
        });
    } catch (err) {
        return next(err);
    }
}

UserController.getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return next(new Error('Id is require!'));
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(200).json({
                isSuccess: true,
                message: "User is not exist!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            user: user
        });
    } catch (err) {
        return next(err);
    }
};

UserController.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return next(new Error('id is require!'));
        }
        const { email, password } = req.body;
        if (!email) {
            return next(new Error('Email is require!'));
        }
        if (!password) {
            return next(new Error('Password is require!'));
        }
        const user = new User({
            ...req.body
        });
        const users = await User.findByIdAndUpdate(id, user, { new: true });
        return res.status(200).json({
            isSuccess: true,
            message: 'Update success!',
            users: users
        });
    } catch (err) {
        return next(err);
    }
};

UserController.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return next(new Error('id is require!'));
        }
        //await User.findByIdAndRemove(id);
        const user = await User.findById(id);
        if (!user) {
            return next(new Error('User is not exist!'));
        }
        user.isDelete = true;
        await User.update({ _id: id }, user);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return next(err);
    }
};

export default UserController;