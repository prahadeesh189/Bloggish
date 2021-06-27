const mongoose = require("mongoose");

const author_model = new mongoose.Schema(
    {
        dateOfJoining: {
            type: Date,
            require: true,
        },        
        uid: {
            type: String,
            required: true
        },
        lastPostDate: {
            type: Date,
            require: true,
        },
        lastLoginDate: {
            type: Date,
            require: true,
        },
        reputationLevel: {
            type: Number,
            require: true
        }

    },

    { collection: "author" }
);














module.exports = mongoose.model("author_model", author_model);
