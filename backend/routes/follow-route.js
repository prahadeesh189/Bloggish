const express = require('express');
const router = express.Router();







router.get('/loadMyFollowers/:offset/:limit', async(req, res) => {


    var follow_model = require('../models/follow-model');

    await follow_model.aggregate( [{
        $match: {
            "followingId": req.session.userID
        }
    } , {
        $lookup: {
            from: "users-credentials",
            foreignField: "uid",
            localField: "uid",
            as: "usersCredInfoArray"
        }
    } , {
        $addFields: {
            "usersCredInfo": {
                $arrayElemAt: ["$usersCredInfoArray", 0]
            }
        }
    } , {
        $project: {
            _id: 1,
            "profilePic":    {
                                "mimetype": {
                                    $concat: ['data:', "$usersCredInfo.profilePic.mimetype", ";base64,"]
                                },
                                "data": "$usersCredInfo.profilePic.data"
                            },
            "uid":          "$usersCredInfo.uid",
            "userName":     "$usersCredInfo.userName"
        }
    }]).sort({"_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(
        (data) => {

            var ejs = require('ejs');
            var path = require('path');

            var templatePath = path.resolve(__dirname, '../../views/views.inc/followersAuthorCard.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            

            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataElement) => {


                        var t = template(
                            {
                                profileImg: (dataElement.profilePic.mimetype + dataElement.profilePic.data.toString('base64')),
                                authorID: dataElement.uid,
                                userName: dataElement.userName
                            }
                        )                                     
                        
                        processedData += t;
                    }
                );

                res.json( { processedDataLength: data.length , processedDataString: processedData} );

            }
            else {
                res.json( { processedDataLength: data.length} );
            }




        }
    )
    .catch((error)=>{console.log(error);});



});

router.get('/loadAccountFollowers/:offset/:limit/:accountID', async(req, res) => {


    var follow_model = require('../models/follow-model');

    await follow_model.aggregate( [{
        $match: {
            "followingId": req.params.accountID
        }
    } , {
        $lookup: {
            from: "users-credentials",
            foreignField: "uid",
            localField: "uid",
            as: "usersCredInfoArray"
        }
    } , {
        $addFields: {
            "usersCredInfo": {
                $arrayElemAt: ["$usersCredInfoArray", 0]
            }
        }
    } , {
        $project: {
            _id: 1,
            "profilePic":    {
                                "mimetype": {
                                    $concat: ['data:', "$usersCredInfo.profilePic.mimetype", ";base64,"]
                                },
                                "data": "$usersCredInfo.profilePic.data"
                            },
            "uid":          "$usersCredInfo.uid",
            "userName":     "$usersCredInfo.userName"
        }
    }]).sort({"_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(
        (data) => {

            var ejs = require('ejs');
            var path = require('path');

            var templatePath = path.resolve(__dirname, '../../views/views.inc/authorCard.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            

            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataElement) => {


                        var t = template(
                            {
                                profileImg: (dataElement.profilePic.mimetype + dataElement.profilePic.data.toString('base64')),
                                authorID: dataElement.uid,
                                userName: dataElement.userName
                            }
                        )                                     
                        
                        processedData += t;
                    }
                );

                res.json( { processedDataLength: data.length , processedDataString: processedData} );

            }
            else {
                res.json( { processedDataLength: data.length} );
            }




        }
    )
    .catch((error)=>{console.log(error);});



});























































router.get('/loadMyFollowing/:offset/:limit', async(req, res) => {



    var follow_model = require('../models/follow-model');

    await follow_model.aggregate( [{
        $match: {
            "uid": req.session.userID
        }
    } , {
        $lookup: {
            from: "users-credentials",
            foreignField: "uid",
            localField: "followingId",
            as: "usersCredInfoArray"
        }
    } , {
        $addFields: {
            "usersCredInfo": {
                $arrayElemAt: ["$usersCredInfoArray", 0]
            }
        }
    }  , {
        $project: {
            _id: 1,
            "uid": 1,
            "profilePic":    {
                                "mimetype": {
                                    $concat: ['data:', "$usersCredInfo.profilePic.mimetype", ";base64,"]
                                },
                                "data": "$usersCredInfo.profilePic.data"
                            },
            "followingID":          "$usersCredInfo.uid",
            "userName":     "$usersCredInfo.userName"
        }
    } , {
        
        $lookup: {
            from: "mute",
            let: {
                "u_id": "$uid",
                "following_id": "$followingID"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$uid","$$u_id"]
                    }
                }
            } , {
                $match: {
                    $expr: {
                        $eq: ["$mutedID", "$$following_id"]
                    }
                }
            }],
            as: "muteInfoArray"
        }
    } , {
        $project: {
            "_id": 1,
            "uid": 1,
            "profilePic": 1,
            "followingID": 1,
            "userName": 1,
            "muted": {
                $size: "$muteInfoArray"
            }
        }
    }])
    .sort({"_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(
        (data) => {

            var ejs = require('ejs');
            var path = require('path');

            var templatePath = path.resolve(__dirname, '../../views/views.inc/followingAuthorCard.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            

            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataElement) => {


                        var t = template(
                            {
                                profileImg: (dataElement.profilePic.mimetype + dataElement.profilePic.data.toString('base64')),
                                authorID: dataElement.followingID,
                                userName: dataElement.userName,
                                muted: ((dataElement.muted > 0) ? true : false),
                            }
                        )                         
                        
                        processedData += t;
                    }
                );

                res.json( { processedDataLength: data.length , processedDataString: processedData} );
            }
            else {
                res.json( { processedDataLength: data.length} );
            }




        }
    )
    .catch((error)=>{console.log(error);});



});


router.get('/loadAccountFollowing/:offset/:limit/:accountID', async(req, res) => {



    var follow_model = require('../models/follow-model');

    await follow_model.aggregate( [{
        $match: {
            "uid": req.params.accountID
        }
    } , {
        $lookup: {
            from: "users-credentials",
            foreignField: "uid",
            localField: "followingId",
            as: "usersCredInfoArray"
        }
    } , {
        $addFields: {
            "usersCredInfo": {
                $arrayElemAt: ["$usersCredInfoArray", 0]
            }
        }
    }  , {
        $project: {
            _id: 1,
            "uid": 1,
            "profilePic":    {
                                "mimetype": {
                                    $concat: ['data:', "$usersCredInfo.profilePic.mimetype", ";base64,"]
                                },
                                "data": "$usersCredInfo.profilePic.data"
                            },
            "followingID":          "$usersCredInfo.uid",
            "userName":     "$usersCredInfo.userName"
        }
    }])
    .sort({"_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(
        (data) => {

            var ejs = require('ejs');
            var path = require('path');

            var templatePath = path.resolve(__dirname, '../../views/views.inc/authorCard.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            

            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataElement) => {


                        var t = template(
                            {
                                profileImg: (dataElement.profilePic.mimetype + dataElement.profilePic.data.toString('base64')),
                                authorID: dataElement.followingID,
                                userName: dataElement.userName,
                            }
                        )                         
                        
                        processedData += t;
                    }
                );

                res.json( { processedDataLength: data.length , processedDataString: processedData} );
            }
            else {
                res.json( { processedDataLength: data.length} );
            }




        }
    )
    .catch((error)=>{console.log(error);});



});






















































module.exports = router;