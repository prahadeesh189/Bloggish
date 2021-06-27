const mongoose = require("mongoose");

const follow_model = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        followingId: {
            type: String,
            required: true
        }
    },

    { collection: "follow" }
);






module.exports = mongoose.model("follow_model", follow_model);