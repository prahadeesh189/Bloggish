const mongoose = require("mongoose");

const views_model = new mongoose.Schema(
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

    { collection: "views" }
);






module.exports = mongoose.model("views_model", views_model);