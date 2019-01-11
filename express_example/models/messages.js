const mongoose = require('mongoose');
import User from './user';
import Group from './Group';
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    deleteAt: {
        type: Date,
        default: null
    },
    message: {
        type: String,
        maxlength: [255, 'Name is too long!']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is require!']
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
}, { timestamps: true });
//{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

function checkDeleted(_this) {
    const query = _this.getQuery();
    query['$or'] = [
        {
            deleteAt: null
        }
    ]
}

messageSchema.pre('find', function () {
    checkDeleted(this);
});

messageSchema.pre('findOne', function () {
    checkDeleted(this);
});

messageSchema.pre('findById', function () {
    checkDeleted(this);
});

messageSchema.pre('findOneAndUpdate', function () {
    checkDeleted(this);
});

messageSchema.pre('findOneAndRemove', function () {
    checkDeleted(this);
});

messageSchema.pre('save', async function (next) {
    const user = await User.findOne({ _id: this.author });
    const group = await Group.findOne({ _id: this.group });
    if (!user) {
        return next(new Error(`author ${this.author} is not exits`));
    };
    if (!group) {
        return next(new Error(`group ${this.group} is not exits`));
    }
});

let Message = mongoose.model('Message', messageSchema);
export default Message;