import mongoose from 'mongoose';
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

groupSchema.pre('find', function () {
    const query = this.getQuery();
    query['$or'] = [
        {
            deleteAt: null
        }
    ]
});

groupSchema.pre('findOne', function () {
    const query = this.getQuery();
    query['$or'] = [
        {
            deleteAt: null
        }
    ]
});

let Group = mongoose.model('Group', groupSchema);
export default Group;