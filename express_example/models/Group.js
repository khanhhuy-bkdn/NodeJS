import mongoose from 'mongoose';
import User from './user'
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is require!'],
        maxlength: [255, 'Name is too long!']
    },
    deleteAt: {
        type: Date,
        default: null
    },
    lastMessage: mongoose.Schema.Types.ObjectId,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is require!']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});

function checkDeleted(_this) {
    const query = _this.getQuery();
    query['$or'] = [
        {
            deleteAt: null
        }
    ]
}

groupSchema.pre('find', function () {
    checkDeleted(this);
});

groupSchema.pre('findOne', function () {
    checkDeleted(this);
});

groupSchema.pre('findById', function () {
    checkDeleted(this);
});

groupSchema.pre('save', async function (next) {
    const user = await User.findOne({ _id: this.author });
    let users = await User.find({ _id: this.members });
    if (!user) {
        return next(new Error('author is not exits'));
    };
    if (users.length !== this.members.length) {
        return next(new Error('member is not exits'));
    }
});

let Group = mongoose.model('Group', groupSchema);
export default Group;