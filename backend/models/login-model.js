const mongoose = require('mongoose');


let  login_model = new mongoose.Schema(

    {
        uid: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },

    {collection: 'login' }
);




module.exports = mongoose.model("login_model" ,login_model);