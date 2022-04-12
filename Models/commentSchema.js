const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const userSchema = db.model('Comment', schema);
module.exports = userSchema;