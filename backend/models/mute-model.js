const mongoose = require("mongoose");

const mute_model = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        mutedID: {
            type: String,
            required: true
        }
    },

    { collection: "mute" }
);






module.exports = mongoose.model("mute_model", mute_model);