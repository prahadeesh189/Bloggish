const mongoose = require('mongoose');


const userCred = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            required: true
        },
        profilePic: {

            type: {
                imgName: {
                    type: String,
                    required: true
                },
                data: {
                    type: Buffer,
                    required: true
                },
                size: {
                    type: Number,
                    required: true
                },
                mimetype: {
                    type: String,
                    required: true
                } 
            },
            default: null
        }
        

    },

    { collection: "users-credentials" }
);










module.exports = mongoose.model("userCredentials_model" ,userCred);