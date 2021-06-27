const mongoose = require('mongoose');

const blog_model = new mongoose.Schema(
    {
        blogID: {
            type: String,
            required: true
    },
        thumbnailPic: {
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
            required: true
        },
        title: {
            type: String,
            required: true
        },
        blog: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        hashtagIds: [
            {
                type: String,
                required: true
            }
        ],
        dateOfPost: {
            type: Date,
            required: true,
            default: Date.now()
        }


    },

    { collection: "blogs" }
);



















module.exports = mongoose.model("blog_model", blog_model);