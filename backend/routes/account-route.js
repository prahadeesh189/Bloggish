const express = require('express');
const router = express.Router();



router.post('/updateaccountinfo', async (req, res) => {



    var updateSetObject = {};

    if (req.body.userName != '') {
        updateSetObject["userName"] = req.body.userName;
    }

    if (req.body.bio != '') {
        updateSetObject["bio"] = req.body.bio;
    }

    if ( req.files != null ) {

        profile_img = {
            "imgName"     :   req.files['profile-img'].name,
            "data"        :   req.files['profile-img'].data,
            "size"        :   req.files['profile-img'].size,
            "mimetype"    :   req.files['profile-img'].mimetype,
        }

        updateSetObject["profilePic"] = profile_img;
    }








    var userCredentials_modal = require('../models/userCredentials-model');

    await userCredentials_modal.updateOne({
        "uid": req.session.userID
    } , {
        $set: updateSetObject
    })
    .then(
        (data) => {
            console.log(data);

            if ((data.nModified != 0) && (data.ok == 1) ) {
                res.json( {updated: true} );
            }
            else {
                res.json( {updated: false} );
            }

        }
    )
    .catch(
        (error) => {
            res.json( {updated: false} );
        }
    );


});





router.get('/getInsights', 

    async (req, res) => {



    }

);

















































































module.exports = router;