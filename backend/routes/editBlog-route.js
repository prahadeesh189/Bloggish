const express = require('express');
const {v4 : uuidv4} = require('uuid');
const router = express.Router();
















router.get('/deletePost/:blogID', async (req, res) => {

    var hashtag_blog_model = require('../models/hashtag_Blog-model.js');
    var blog_model = require('../models/blog-model.js');


    await hashtag_blog_model.deleteMany({
        "blogID": req.params.blogID
    })
    .then(
        (resolve, rej) => {
            console.log( resolve );
        }
    );


    await blog_model.deleteOne({
        "blogID": req.params.blogID
    })
    .then(
        (resolve, rej) => {
            console.log( resolve );

            if (resolve.ok == 1) {  
                res.json({deleted: true});  
            }
            else {
                res.json({deleted: false});  
            }

        }
    );


    
});
































router.post("/updateblog", async (req, res) => {


    var hashtagsArr = req.body.hashtag.split(' ');  



    var hashTagObjBulkWriteArr = [];
    hashtagsArr.forEach( (Htag) => {

        var HtagID = 'hashtagId-'+uuidv4(Htag); 
        
        hashTagObjBulkWriteArr.push(
            {
                updateOne: {
                    "filter": {
                        hashtag: Htag
                    },
                    "update": {
                        $setOnInsert: {
                            hashtag: Htag,
                            hashtagID: HtagID,
                            dateOfIntoduction: Date.now(),
                        }
                    },
                    "upsert": true
                }
            }      
        );
    });


    var hashtag_model = require('../models/hashtag-model.js');

    await hashtag_model.bulkWrite( 
            
        hashTagObjBulkWriteArr
        
        , {
        ordered: false
    }).catch( (error) => {
        console.log(error);

        Errors = true;

    }).then( (res, rej) => {
        // console.log( res.result );
    });





    var blukReplaceEditedHashtagsArray = [];
    var hashtag_blog_model = require('../models/hashtag_Blog-model.js');


    await hashtag_blog_model.aggregate([{
 
        $facet: {
            "stage1": [{
                            $match: {
                                "blogID" : req.body.bid,   
                            }
                        } , {
                            $lookup: {
                                from: "hashtag",
                                foreignField: 'hashtagID',
                                localField: 'hashtagID',
                                as: "hashtagsInfoArray"
                            }
                        } , {
                            $addFields: {
                                "hashtagsInfo": {
                                    $arrayElemAt: ["$hashtagsInfoArray", 0]
                                }
                            }
                        } , {
                            $project: {
                                _id: 0,
                                "blogID": 1,
                                "hashtag": "$hashtagsInfo.hashtag"
                            }
                        } , {
                            $group: {
                                _id: {
                                    "blogID": "$blogID"
                                    
                                },
                                "hashtag_A": {
                                    $push: "$hashtag"
                                }
                            }
                        } , {
                            $project: {
                                _id: 0,
                                "blogID": "$_id.blogID",
                                "hashtag_A": 1,
                                
                                "removedHashtagsOnEdit": {
                                    "$setDifference": ["$hashtag_A", hashtagsArr]
                                }
                            }
                        } , {
                            $project: {
                                "removedHashtagsOnEdit": 1
                            }
                        } , {
                            $unwind: "$removedHashtagsOnEdit"
                        } , {
                            $lookup: {
                                from: "hashtag",
                                foreignField: "hashtag",
                                localField: "removedHashtagsOnEdit",
                                as: "removedHashtagsOnEdit_ID_ARRAY"
                            }
                        } , {
                            $addFields: {
                                "removedHashtagsOnEdit_ID": {
                                    $arrayElemAt: ["$removedHashtagsOnEdit_ID_ARRAY", 0]
                                }
                            }
                        } , {
                            $project: {
                                "removedHashtagsOnEdit_ID": "$removedHashtagsOnEdit_ID.hashtagID"
                            }
                        } , {
                            $group: {
                                _id: [],
                                "removedHashtagsOnEdit_IDs": {
                                    $push: "$removedHashtagsOnEdit_ID"
                                }
                            }
                        } , {
                            $project: {
                                _id: 0
                            }
                        } , {
                            $unwind: "$removedHashtagsOnEdit_IDs"
                        } , {
                            $addFields: {
                                "deleteOne": {
                                    "filter": {
                                        "hashtagID": "$removedHashtagsOnEdit_IDs",
                                        "blogID" : req.body.bid
                                    }
                                }
                            }
                        } , {
                            $project: {
                                "deleteOne": 1
                            }
                        }],
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
        
                        
            "stage2": [{
                            $match: {
                                "blogID" : req.body.bid,   
                            }
                        } , {
                            $lookup: {
                                from: "hashtag",
                                foreignField: 'hashtagID',
                                localField: 'hashtagID',
                                as: "hashtagsInfoArray"
                            }
                        } , {
                            $addFields: {
                                "hashtagsInfo": {
                                    $arrayElemAt: ["$hashtagsInfoArray", 0]
                                }
                            }
                        } , {
                            $project: {
                                _id: 0,
                                "blogID": 1,
                                "hashtag": "$hashtagsInfo.hashtag"
                            }
                        } , {
                            $group: {
                                _id: {
                                    "blogID": "$blogID"
                                    
                                },
                                "hashtag_A": {
                                    $push: "$hashtag"
                                }
                            }
                        } , {
                            $project: {
                                _id: 0,
                                "blogID": "$_id.blogID",
                                "hashtag_A": 1,
                                
                                "addedHashtagsOnEdit": {
                                    "$setDifference": [ hashtagsArr, "$hashtag_A"]
                                }
                            }
                        }, {
                            $project: {
                                "addedHashtagsOnEdit": 1
                            }
                        }, {
                            $unwind: "$addedHashtagsOnEdit"
                        } , {
                            $lookup: {
                                from: "hashtag",
                                foreignField: "hashtag",
                                localField: "addedHashtagsOnEdit",
                                as: "addedHashtagsOnEdit_ID_ARRAY"
                            }
                        } , {
                            $addFields: {
                                "addedHashtagsOnEdit_ID": {
                                    $arrayElemAt: ["$addedHashtagsOnEdit_ID_ARRAY", 0]
                                }
                            }
                        } , {
                            $project: {
                                "addedHashtagsOnEdit_ID": "$addedHashtagsOnEdit_ID.hashtagID"
                            }
                        } , {
                            $group: {
                                _id: [],
                                "addedHashtagsOnEdit_IDs": {
                                    $push: "$addedHashtagsOnEdit_ID"
                                }
                            }
                        } , {
                            $project: {
                                _id: 0
                            }
                        } , {
                            $unwind: "$addedHashtagsOnEdit_IDs"
                        } , {
                        $addFields: {
                                updateOne: {
                                    filter: {
                                        "hashtagID": "$addedHashtagsOnEdit_IDs",
                                        "blogID": req.body.bid
                                    },
                                    update: {
                                        "\uFF04setOnInsert": {
                                            "hashtagID": "$addedHashtagsOnEdit_IDs",
                                            "blogID": req.body.bid
                                        }
                                    },
                                    "upsert": true
                                }
                            }
                    } , {
                        $project: {
                            "updateOne": 1
                        }
                    }]
        }
     
            
    }])    
    .then(
        (data) => {
             blukReplaceEditedHashtagsArray = data[0].stage1.concat( data[0].stage2 ) ;
        }
    )
    


    await hashtag_blog_model.bulkWrite( 
            
        blukReplaceEditedHashtagsArray

        , {
        ordered: false
    }).catch( (error) => {
        console.log(error);

        Errors = true;

    }).then( (res, rej) => {
        // console.log( res );

    });











    var newHastagIdsArray = []
    await hashtag_blog_model.aggregate([{
        $match: {
            "blogID": req.body.bid,
        }
    } , {
        $lookup: {
            from: "hashtag",
            foreignField: "hashtagID",
            localField: "hashtagID",
            as: "hashtagInfoArr"
        }
    } , {
        $addFields: {
            "hashtagInfo": {
                $arrayElemAt: ["$hashtagInfoArr", 0]
            }
        }
    } , {
        $project: {
            _id: 0,
            "blogID": 1,
            "hashtagID": "$hashtagInfo.hashtagID"
        }
    } , {
        $group: {
            _id: "$blogID",
            "hashtagIDs": {
                $push: "$hashtagID"
            }
        }
    }])
    .then(
        (data) => {
            newHastagIdsArray = data[0].hashtagIDs;
        }
    );












    var updateEditBlogObj = {};

    if (req.files != null) {
        updateEditBlogObj = {
            $set: {
                title: req.body.blogTitle,
                blog : req.body.content,
                thumbnailPic: {
                    imgName:    req.files.thumbnail.name,
                    data:       req.files.thumbnail.data,
                    size:       req.files.thumbnail.size,
                    mimetype:   req.files.thumbnail.mimetype,
                },
                dateOfPost: Date.now(),
                hashtagIds: newHastagIdsArray
            }
        };
    }
    else {
        updateEditBlogObj = {
            $set: {
                title: req.body.blogTitle,
                blog : req.body.content,
                hashtagIds: newHastagIdsArray
            }
        };
    }



        
    var blog_model = require('../models/blog-model.js');

    await blog_model.updateOne({
        blogID: req.body.bid
    } , 
        updateEditBlogObj
    )
    .catch( (error) => {
        console.log(error);

        Errors = true;

    }).then( (response, rej) => {

        var responseJson = response;
        responseJson['blogID'] = req.body.bid;

        res.json(responseJson);
    });











});









































module.exports = router;