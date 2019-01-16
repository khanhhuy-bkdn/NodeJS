import User from '../models/user';
import BaseRespository from './base';
import bcrypt from 'bcrypt';
import { runInNewContext } from 'vm';

export default class UserRespository extends BaseRespository {
    constructor() {
        super(User);
    }

    async create(data, next) {
        try {
            const { fullName, email, password, gender } = data;
            const hash = bcrypt.hashSync(password, 10);
            const user = new User({
                fullName,
                email,
                password: hash,
                gender
            });
            return await user.save();
        } catch (e) {
            return next(e)
        }
    }

    async update(where = {}, data, next) {
        try {
            const user = await this.getOne({
                where,
                select: 'password'
            });
            if (!user) {
                return next(new Error('User is not exist!'));
            }
            if (data.password !== undefined) {
                data.password = bcrypt.hashSync(data.password, 10);
            }
            user.set({ ...data, deleteAt: null });
            return await user.save();
        } catch (e) {
            return next(e)
        }
    }
}