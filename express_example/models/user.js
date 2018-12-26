import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is require field!'],
        maxlength: [255, 'firstName is too long!']
    },
    lastName: {
        type: String,
        required: [true, 'lastName is require field!'],
        maxlength: [255, 'lastName is too long!'],
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: [true, 'email is require field!'],
        maxlength: [255, 'email is too long!']
    },
    password: {
        type: String,
        required: [true, 'password is require field!'],
        maxlength: [20, 'password is too long!'],
        minlength: [3, 'password is too short!']
    },
    gender: Boolean,
    address: {
        type: [String],
        required: [true, 'address is require field!'],
        maxlength: [20, 'address is many!'],
        minlength: [2, 'address is short!']
    },
    age: {
        type: Number,
        required: [true, 'age is require field!']
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('find', function () {
    const query = this.getQuery();
    query['$or'] = [
        {
            isDelete: false
        },
        {
            isDelete: null
        }
    ]
});

userSchema.pre('findOne', function () {
    const query = this.getQuery();
    query['$or'] = [
        {
            isDelete: false
        },
        {
            isDelete: null
        }
    ]
});

let User = mongoose.model('User', userSchema);

export default User;