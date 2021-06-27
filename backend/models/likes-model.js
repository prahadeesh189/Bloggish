const mongoose = require("mongoose");

const likes_model = new mongoose.Schema(
    {
        blogID: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        }
    },

    { collection: "likes" }
);






module.exports = mongoose.model("likes_model" ,likes_model);