const express = require('express');
const router = express.Router();
const {v4 : uuidv4} = require('uuid');



var blog_model = require('../models/blog-model.js');
var hashtag_model = require('../models/hashtag-model.js');
var hashtag_blog_model = require('../models/hashtag_Blog-model.js');
var author_model = require('../models/author-model.js');







router.post('/newpost',
    async (req, res) => {


        var Errors = false;

        var newBlogId = "BlogID-"+uuidv4();

        var hashTagObjBulkWriteArr = [];

        var hashtagArr = (req.body.hashtag).split(' ');
        hashtagArr.forEach( (Htag) => {

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


    
        var bulkWriteHashTagBlogArray = [];

        var hashtagIDArr = [];
        await hashtag_model.aggregate([{
            $facet: {
                stage1: [{
                    $match: {
                        hashtag: {
                            $in: hashtagArr
                        }
                    }
                } , {
                    $project: {
                        _id: 0,
                        "hashtagID": 1
                    }
                } , {
                    $group: {
                        _id: [],
                        "hashtagIDs": {
                            $push: "$hashtagID"   
                        }
                    }
                } , {
                    $project: {
                        _id: 0
                    }
                }],
                
                
                stage2: [{
                    
                    $match: {
                        hashtag: {
                            $in: hashtagArr
                        }
                    }
                
                } , {
                    $project: {
                        _id: 0,
                        "hashtagID": 1
                    }
                } ,  {
                        $addFields: {
                            "blogID": newBlogId
                    }
                } , {
                    $addFields: {
                            updateOne: {
                                filter: {
                                    "hashtagID": "$hashtagID",
                                    "blogID": "$blogID"
                                },
                                update: {
                                    "\uFF04setOnInsert": {
                                        "hashtagID": "$hashtagID",
                                        "blogID": "$blogID"
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
                hashtagIDArr = data[0].stage1[0].hashtagIDs;
                bulkWriteHashTagBlogArray = data[0].stage2;
            }
        )
        .catch(
            (error) => {
                Errors = true;
            }
        );


        

        await hashtag_blog_model.bulkWrite( 
            
            bulkWriteHashTagBlogArray
            
            , {
            ordered: false
        }).catch( (error) => {
            console.log(error);

            Errors = true;

        }).then( (res, rej) => {
            // console.log( res.result );
        });














        


        var new_blog_model = new blog_model({
            blogID: newBlogId,
            thumbnailPic: {
                imgName:    req.files.thumbnail.name,
                data:       req.files.thumbnail.data,
                size:       req.files.thumbnail.size,
                mimetype:   req.files.thumbnail.mimetype,
            },
            title: req.body.blogTitle,
            blog: req.body.content,
            uid: req.session.userID,
            hashtagIds: hashtagIDArr,
            dateOfPost: Date.now()
        });


        await author_model.updateOne(({
            "uid": req.session.userID
        } , {
            $set: {
                "lastPostDate": Date.now()
            }
        }));



        

        await new_blog_model.save( (error, product, naffected) => {
            // console.log(product);
            if (error != null) {
                console.log( ">>>>>> ", Errors = true);
                console.log(error);
                res.json( {writtenSuccessfully: false} );
            }
            else {
                res.json( {
                    writtenSuccessfully: true,
                    BlogId: product.blogID
                });
            }
        });




        console.log(Errors);
        if (Errors == false) {
            // res.json( {writtenSuccessfully: true} );
        }






    }
);








































module.exports = router;