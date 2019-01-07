import User from '../models/user';
import md5 from 'md5';
import JWT from 'jsonwebtoken';
import * as constant from './../constant';
import bcrypt from 'bcrypt';

const UserController = {};
const salt = bcrypt.genSaltSync(10);

UserController.verifyToken = async (req, res, next) => {
    try {
        const { token } = req.headers || req.params || req.body || req.query;
        if (!token) {
            return next(new Error("Not found authentication!"));
        }
        const data = await JWT.verify(token, constant.JWT_SECRET);
        const id = data._id;
        const user = User.findOne({ _id: id });
        if (!user) {
            return next(new Error("User not found!"));
        }
    } catch (err) {
        return next(new Error("Invalid authentication!"));
    }
}

UserController.getAll = async (req, res, next) => {
    try {
        UserController.verifyToken(req, res, next);
        const users = await User.find().sort('-dateAdded');
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
    }
};

UserController.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        UserController.verifyToken(req, res, next);
        const user = await User.findOne({ _id: id });
        if (!user) {
            return next(new Error("User not found!"));
        }
        return res.status(200).json({
            isSuccess: true,
            user: user
        });
    } catch (err) {
        return next(err);
    }
};

UserController.addUser = async (req, res, next) => {
    try {
        const { fullName, email, password, gender } = req.body;
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({
            fullName,
            email,
            //password: md5(password),
            password: hash,
            gender
        });
        await user.save();
        delete user._doc.password;
        return res.status(201).json({
            isSuccess: true,
            user
        });
    } catch (err) {
        return next(err);
    }
}

UserController.updateUser = async (req, res, next) => {
    try {
        UserController.verifyToken(req, res, next);
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (req.body.password !== undefined) {
            //req.body.password = md5(req.body.password);
            req.body.password = bcrypt.hashSync(req.body.password, salt);
        }
        user.set({ ...req.body, deleteAt: null });
        await user.save();
        return res.status(200).json({
            isSuccess: true,
            message: 'Update success!'
        });
    } catch (err) {
        return next(err);
    }
};

UserController.deleteUser = async (req, res, next) => {
    try {
        UserController.verifyToken(req, res, next);
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return next(new Error('User is not exist!'));
        }
        user.deleteAt = Date.now();
        await user.save();
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return next(err);
    }
};

UserController.login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new Error('User is not found'));
        }
        //const isCorrectPassword = md5(password) === user.password;
        const isCorrectPassword = bcrypt.compareSync(password, user.password);
        if (!isCorrectPassword) {
            return next(new Error('password is not correct'));
        }
        delete user._doc.password;
        delete user._doc.deleteAt;
        const token = JWT.sign(user._doc, constant.JWT_SECRET);
        return res.json({
            isSuccess: true,
            user,
            token
        });
    } catch (e) {
        return next(e);
    }
};

UserController.updatePassword = async (req, res, next) => {
    try {
        UserController.verifyToken(req, res, next);
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        const { passwordOld, passwordNew, passwordVerify } = req.body;
        if (passwordOld === undefined || passwordNew === undefined || passwordVerify === undefined) {
            return next(new Error('password is error!'));
        }
        const isCorrectPassword = bcrypt.compareSync(passwordOld, user.password);
        if (!isCorrectPassword) {
            return next(new Error('password is not correct!'));
        }
        if (passwordNew !== passwordVerify) {
            return next(new Error('passwordVerify is not correct!'));
        }
        user.password = bcrypt.hashSync(passwordNew, salt);
        await user.save();
        return res.status(200).json({
            isSuccess: true,
            message: 'Update password success!'
        });
    } catch (err) {
        return next(err);
    }
};

export default UserController;