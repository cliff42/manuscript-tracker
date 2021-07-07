const mongoose = require('mongoose');


const ManuscriptSchema = mongoose.Schema({
    name: {type: String, required: true},
    author: String,
    earlyDate: Number,
    lateDate: Number,
    info: String,
    sources: Array,
    children: Array
}, { collection : 'manuscript-collection' });

const Manuscript = mongoose.model("Manuscript", ManuscriptSchema);
module.exports = Manuscript;