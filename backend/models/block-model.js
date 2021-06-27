const mongoose = require("mongoose");

const block_model = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        BlockedId: {
            type: String,
            required: true
        }
    },

    { collection: "block" }
);






module.exports = mongoose.model("block_model" ,block_model);