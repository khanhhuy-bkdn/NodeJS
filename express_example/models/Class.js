const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let classSchema = new Schema({
    name: String,
    quality: Number
});

let Class = mongoose.model('Class', classSchema);

export default Class;