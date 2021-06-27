const mongoose = require('mongoose');

const hashtag_model = new mongoose.Schema(
    {
        hashtag: {
            type: String,
            required: true
        },
        hashtagID: {
            type: String,
            required: true
        },
        dateOfIntoduction: {
            type: Date,
            required: true
        }

    },

    { collection: "hashtag" }
);






module.exports = mongoose.model("hashtag_model", hashtag_model);