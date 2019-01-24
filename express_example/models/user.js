const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    fullName: {
        first: {
            type: String,
            maxlength: [30, 'firstName is too long!']
        },
        last: {
            type: String,
            maxlength: [30, 'lastName is too long!'],
        }
    },
    email: {
        type: String,
        required: [true, 'email is require field!'],
        maxlength: [30, 'email is too long!'],
        // check trung email
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is require field!'],
        maxlength: [255, 'password is too long!'],
        minlength: [3, 'password is too short!']
    },
    gender: Boolean,
    // address: {
    //     type: [String],
    //     required: [true, 'address is require field!'],
    //     maxlength: [20, 'address is many!'],
    //     minlength: [2, 'address is short!']
    // },
    deleteAt: {
        type: Date,
        default: null
    },
    resetedAt: {
        type: Date,
        default: null
    },
    codeReset: {
        type: Number
    }
});

// userSchema.pre('find', function () {
//     const query = this.getQuery();
//     query['$or'] = [
//         {
//             deleteAt: null
//         }
//     ]
// });

// userSchema.pre('findOne', function () {
//     const query = this.getQuery();
//     query['$or'] = [
//         {
//             deleteAt: null
//         }
//     ]
// });

//Xử lý trùng email
userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        return next(new Error('this email has been using'));
    }
    return next(error);
});

//Cách 2
userSchema.pre('find', function() {
    preFindMiddleware(this);
});

userSchema.pre('findOne', function() {
    preFindMiddleware(this);
});

function preFindMiddleware(_this) {
    const query = _this.getQuery();
    _this.select('email fullName gender');
    return query.deletedAt = null;
}

let User = mongoose.model('User', userSchema);

export default User;