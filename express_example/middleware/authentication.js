import User from '../models/user';
import JWT from 'jsonwebtoken';
import * as constant from './../constant';

export const verifyToken = async (req, res, next) => {
    try {
        const socket = req.socket;
        const token = req.query.token || req.headers.token || req.body.token;
        if (!token) {
            return next(new Error("Not found authentication!"));
        }
        const tokens = token.split('Bearer ');
        if (tokens.length !== 2 || tokens[0] !== '') {
            return next(new Error("Not authentication format!"));
        }
        const authToken = tokens[1];
        const data = await JWT.verify(authToken, constant.JWT_SECRET);
        const id = data._id;
        if (!id) {
            return next(new Error("Cannot get _id from jwt payload!"));
        }
        const user = await User.findOne({ _id: id }).select('password').lean(true);
        if (!user) {
            return next(new Error("User not found!"));
        }
        req.user = user;
        socket.user = user;
        return next();
    } catch (err) {
        return next(new Error("Invalid authentication!"));
    }
}

export const verifyTokenForgotPassword = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return next(new Error("Not found authentication!"));
        }
        const data = await JWT.verify(token, constant.JWT_SECRET_FORGOT_PASSWORD);
        const id = data._id;
        if (!id) {
            return next(new Error("Cannot get _id from jwt payload!"));
        }
        const user = await User.findOne({ _id: id }).select('password').lean(true);
        if (!user) {
            return next(new Error("User not found!"));
        }
        req.user = user;
        return next();
    } catch (err) {
        return next(new Error("Invalid authentication!"));
    }
}