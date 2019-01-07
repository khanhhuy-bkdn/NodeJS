import User from '../models/user';
import JWT from 'jsonwebtoken';
import * as constant from './../constant';

export const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.headers || req.params || req.body || req.query;
        if (!token) {
            return next(new Error("Not found authentication!"));
        }
        const data = await JWT.verify(token, constant.JWT_SECRET);
        const id = data._id;
        const user = await User.findOne({ _id: id });
        if (!user) {
            return next(new Error("User not found!"));
        }
    } catch (err) {
        return next(new Error("Invalid authentication!"));
    }
}