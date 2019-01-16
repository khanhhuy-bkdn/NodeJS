import md5 from 'md5';
import JWT from 'jsonwebtoken';
import * as constant from './../constant';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import { ResponseHandle } from './../helpers';
import { userRespository } from '../respositories';

const UserController = {};
const salt = bcrypt.genSaltSync(10);

UserController.getAll = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        const users = await userRespository.getAll({
            limit,
            page,
            sort: {
                _id: -1
            },
            lean: true,
        });
        //const users = await User.find().sort('-dateAdded').lean(true);
        // return res.status(200).json({
        //     isSuccess: true,
        //     users,
        // });
        return ResponseHandle.returnSuccess(res, 'Success!', users);
    } catch (err) {
        return next(err);
    }
};

UserController.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userRespository.getOne({
            where: {
                _id: id
            },
            lean: true
        });
        //const user = await User.findOne({ _id: id }).lean(true);
        if (!user) {
            return next(new Error("User not found!"));
        }
        return ResponseHandle.returnSuccess(res, 'Success!', user);
    } catch (err) {
        return next(err);
    }
};

UserController.addUser = async (req, res, next) => {
    try {
        const user = await userRespository.create(req.body, next);
        delete user._doc.password;
        return ResponseHandle.returnSuccess(res, 'Add success!', user);
    } catch (err) {
        return next(err);
    }
}

UserController.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await userRespository.update({ _id: id }, req.body, next);
        return ResponseHandle.returnSuccess(res, 'Update success!', null);
    } catch (err) {
        return next(err);
    }
};

UserController.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userRespository.getOne({
            where: {
                _id: id
            },
            lean: true,
            select: 'deleteAt'
        });
        if (!user) {
            return next(new Error('User is not exist!'));
        }
        await userRespository.softDelete({
            where: {
                _id: id
            }
        });
        return ResponseHandle.returnSuccess(res, 'Delete success!', null);
    } catch (err) {
        return next(err);
    }
};

UserController.login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await userRespository.getOne({
            where: {
                email
            },
            select: 'password',
            lean: true
        });
        //const user = await User.findOne({ email }).select('password').lean(true);
        if (!user) {
            return next(new Error('User is not found'));
        }
        //const isCorrectPassword = md5(password) === user.password;
        const isCorrectPassword = bcrypt.compareSync(password, user.password);
        if (!isCorrectPassword) {
            return next(new Error('password is not correct'));
        }
        delete user.password;
        //delete user._doc.deleteAt;
        const token = JWT.sign(user, constant.JWT_SECRET, { expiresIn: '3h' });
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
        const { currentPassword, newPassword, verifyPassword } = req.body;
        if (newPassword !== verifyPassword) {
            return next(new Error('verifyPassword is not correct!'));
        }
        const user = req.user;
        const isCorrectPassword = bcrypt.compareSync(currentPassword, user.password);
        if (!isCorrectPassword) {
            return next(new Error('password is not correct!'));
        }
        await userRespository.update({ _id: user._id }, { password: currentPassword }, next);
        return ResponseHandle.returnSuccess(res, 'Update password success!', null);
    } catch (err) {
        return next(err);
    }
};

UserController.upload = async (req, res, next) => {
    try {
        var form = new formidable.IncomingForm();
        form.uploadDir = "./uploads";
        form.maxFileSize = 200 * 1024 * 1024; //max 20MB
        form.multiples = true; //chọn nhiều
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.json({
                    isSuccess: false,
                    message: 'Cannot upload file!',
                    err
                });
            }
            let arrayOfFiles = files['files'];
            if (arrayOfFiles.length > 0) {
                let fileNames = [];
                arrayOfFiles.forEach((item) => {
                    fileNames.push(item.path.split('\\')[1]);
                });
                res.json({
                    isSuccess: true,
                    data: fileNames,
                    message: 'Upload success!'
                });
            } else {
                res.json({
                    isSuccess: false,
                    data: {},
                    message: 'No file is upload!'
                });
            }
            // res.writeHead(200, { 'content-type': 'text/plain' });
            // res.write('received upload:\n\n');
            // res.end(util.inspect({ fields: fields, files: files }));
        });
    } catch (err) {
        return next(err);
    }
};

export default UserController;