const mongoose = require('mongoose');

const hashtag_blog_model = new mongoose.Schema(
    {
        hashtagID: {
            type: String,
            required: true
        },
        blogID: {
            type: String,
            required: true
        }
    },

    { collection: "hashtag-blog" }
);









module.exports = mongoose.model("hashtag_blog_model", hashtag_blog_model);