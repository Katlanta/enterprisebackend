const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
});

const userSchema = db.model('User', schema);
module.exports = userSchema;