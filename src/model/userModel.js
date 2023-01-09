const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

   

    name: {
        type: String,
        required: true
    },

    phone: {
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

   gender: {
        type:String,
        enum: ["Male ", "Female"],
        required:true
    }
},
 { timesStamp: true })

module.exports = mongoose.model('User', userSchema)