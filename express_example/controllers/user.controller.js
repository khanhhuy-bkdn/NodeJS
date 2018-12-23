import User from '../models/user';

const UserController = {};

UserController.getAll = async (req, res) => {
    try {
        const users = await User.find().sort('-dateAdded');
        if (!user) {
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
        return res.status(400).json({
            isSuccess: false,
            message: err.message,
            error: err
        });
    }
};

// UserController.addUser = async (req, res) => {
//     try {
//         const user = new User({
//             ...req.body
//         });
//         await user.save();
//         return res.json({
//             isSuccess: true,
//             user: user
//         })
//     } catch (err) {
//         return res.status(400).json({
//             isSuccess: false,
//             message: err.message,
//             error: err
//         });
//     }
// };

UserController.addUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, address, age } = req.body;
        if (!email) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Email is require!'
            });
        }
        if (!password) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Password is require!'
            });
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
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
}

UserController.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        const user = await User.findById(id);
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
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

UserController.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Email is require!'
            });
        }
        if (!password) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Password is require!'
            });
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
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

UserController.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        await User.findByIdAndRemove(id);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

export default UserController;
