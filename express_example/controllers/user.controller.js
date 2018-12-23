import User from '../models/user';

const UserController = {};

UserController.getAll = async (req, res) => {
    try {
        // Cái này mình có thể viết lại như này: const users = await User.find();
        // Catch error nó sẽ bắt hết tất cả eror trả về từ hàm của model như cái này .exec((err, users)
        //
        await User.find().sort('-dateAdded').exec((err, users) => {
            // Nên e không cần phải check error ở đây nữa nhé.
            if (err) {
                res.status(500).send(err);
            }
            return res.json({
                users,
            });
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
                // Định nghĩa lỗi cho rõ nhé: id is required
                // Chưa trả về isSucess
                message: 'Prams is null!'
            });
        }
        // Cái này tương tự. E có thể viết const user = await User.findById(id); Cho gọn.
        await User.findById(id).exec((err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({
                user: user
            });
        });
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }
};

UserController.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: 'Prams is null!'
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
        })// Thiếu chấm phẩy,
        // Tương tự.
        await User.findOneAndUpdate(id, user, { new: true }, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({
                message: 'Update success!',
                user: user
            });
        });
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }
};

UserController.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                // Định nghĩa rõ ra.
                message: 'Prams is null!'
            });
        }
        // Tương tự.
        await User.findByIdAndRemove(id, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({
                message: 'Delete success!'
            });
        });
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }
};

export default UserController;
