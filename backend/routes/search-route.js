const express = require('express');
const router = express.Router();





router.get('/searchquery', async (req, res) => {

    var blogs_model = require('../models/blog-model');
    var userCredentials_modal = require('../models/userCredentials-model');
    var hashtag_modal = require('../models/hashtag-model');


    function checkchars(ch) {
        return (ch != ' ');
    }

    var queryString = req.query.q.toLowerCase().split('');
    queryString = queryString.filter(checkchars);


    queryString = '.*'+queryString.join('.*')+'.*'
    


 





    var blogSearchPromise =  blogs_model.aggregate([{
        $facet: {
            "blogIDs": [{
                $match: {
                    
                    "title": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
            
                    
                }   
            } , {
                $project: {
                    _id: 0,
                    "blogID": 1
                }
            } , {
                $group: {
                    _id: '',
                    'blogIDs': {
                        $addToSet: "$blogID"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
            
            
            "hashtagIDs": [{
                $match: {
                    
                    "title": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
                    
                }   
            } , {
                $unwind: "$hashtagIds"
            } , {
                $project: {
                    _id: 0,
                    "hashtagID": "$hashtagIds"
                }
            } , {
                $group: {
                    _id: '',
                    "hashtagIDs": {
                        $addToSet: "$hashtagID"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
            
            
            
            
            
            
            
            "uids": [{
                $match: {
                    
                    "title": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
                    
                }   
            } , {
                $project: {
                    _id: 0,
                    "uid": 1,
                }
            } , {
                $group: {
                    _id: "",
                    "uids": {
                        $addToSet: "$uid"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }]
            
        }
    }])








    var hashtagSearchPromise =  hashtag_modal.aggregate([{
        $facet: {
            "hashtagIDs": [{
                $match: {
                    
                    "hashtag": {
                        $regex: queryString,
                        $options: "i"
                    }
                    
                }
            }  , {
                $project: {
                    _id: 0,
                    "hashtagID": 1
                }
            }, {
                $group: {
                    _id: '',
                    "hashtagIDs": {
                        $addToSet: "$hashtagID"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
            
            
            "blogIDs": [{
                $match: {
                    
                    "hashtag": {
                        $regex: queryString,
                        $options: "i"
                    }
                    
                }   
            }  , {
                $project: {
                    _id: 0,
                    "hashtagID": 1
                }
            } , {
                $lookup: {
                    from: "hashtag-blog",
                    let: {
                        "hashtag_ID": "$hashtagID"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                    $eq: ['$hashtagID', "$$hashtag_ID"],    
                                }
                            }
                    } , {
                        $project: {
                            _id: 0,
                            "blogID": 1,
                        }
                    } , {
                        $lookup: {
                            from: "blogs",
                            foreignField: "blogID",
                            localField: "blogID",
                            as: "blogInfoArray"
                        }
                    } , {
                        $addFields: {
                            "blogInfo": {
                                $arrayElemAt: ["$blogInfoArray", 0]
                            }
                        }
                    } , {
                        $project: {
                            "blogID": 1,
                            "uid": "$blogInfo.uid",
                        }
                    } , {
                        $match: {
                            $expr: {
                                $not: {
                                    $eq: [ "$uid" , req.session.userID]
                                }
                            }   
                        }
                    } , {
                        $project: {
                            "blogID": 1
                        }
                    }],
                    as: "hashtagBlogInfoArray"
                }
            } , {
                $unwind: "$hashtagBlogInfoArray"
            } , {
                $project: {
                    "blogID": "$hashtagBlogInfoArray.blogID"
                }
            } , {
                $group: {
                    _id: '',
                    "blogIDs": {
                        $addToSet: "$blogID"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
                
            
            
            
            
            
            
            "uids": [{
                $match: {
                    
                    "hashtag": {
                        $regex: queryString,
                        $options: "i"
                    }
                    
                }   
            }  , {
                $project: {
                    _id: 0,
                    "hashtagID": 1
                }
            } , {
                $lookup: {
                    from: "hashtag-blog",
                    let: {
                        "hashtag_ID": "$hashtagID"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ['$hashtagID', "$$hashtag_ID"]
                            }
                        }
                    } , {
                        $project: {
                            _id: 0,
                            "blogID": 1
                        }
                    }],
                    as: "hashtagBlogInfoArray"
                }
            } , {
                $project: {
                    "hashtagBlogInfoArray": 1
                }
            } , {
                $unwind: "$hashtagBlogInfoArray"
            } , {
                $group: {
                    _id: "hashtagBlogInfoArray",
                    "blogIds": {
                        $addToSet: "$hashtagBlogInfoArray.blogID"
                    },
                    "count": {
                        $sum: 1
                    } 
                }
            } , {
                $project: {
                    _id: 0,
                    "blogIds": 1,
                }
            } , {
                $unwind: "$blogIds"
            } , {
                $project: {
                    "blogID": "$blogIds"
                }
            } , {
                $lookup: {
                    from: "blogs",
                    foreignField: "blogID",
                    localField: "blogID",
                    as: "blogInfoArray"
                }
            } , {
                $addFields: {
                    "blogInfo": {
                        $arrayElemAt: ["$blogInfoArray", 0]
                    }
                }
            } , {
                $project: {
                    "uid": "$blogInfo.uid"
                }
            } , {
                $match: {
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    } 
                }
            } , {
                $group: {
                    _id: "",
                    "uids": {
                        $addToSet: "$uid"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }]
            
            
            
            
        }
    }])
    







    var authorSearchPromise =  userCredentials_modal.aggregate([{
        $facet: {
            "uids": [{
                $match: {
                    
                    "userName": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
                    
                }   
            } , {
                $project: {
                    _id: 0,
                    "uid": 1
                }
            } , {
                $group: {
                    _id: "",
                    "uids": {
                        $addToSet: "$uid"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
            
            
            
            "blogIDs": [{
                $match: {
                    
                    "userName": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
                    
                }   
            } , {
                $project: {
                    _id: 0,
                    "uid": 1
                }
            } , {
                $lookup: {
                    from: "blogs",
                    let: {
                        "u_id": "$uid"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$uid", "$$u_id"]
                            }
                        }
                    } , {
                        $project: {
                            _id: 0,
                            "blogID": 1
                        }
                    }],
                    as: "blogInfoArray"
                }
            } , {
                $project: {
                    "blogInfoArray": 1
                }
            } , {
                $unwind: "$blogInfoArray"
            } , {
                $group: {
                    _id: "",
                    "blogIDs": {
                        $addToSet: "$blogInfoArray.blogID"
                    }
                }
            } , {
                $project: {
                    _id: 0
                }
            }],
            
            
            
            
            "hashtagIDs": [{
                $match: {
                    
                    "userName": {
                        $regex: queryString,
                        $options: "i"
                    },
                    
                    $expr: {
                        $not: {
                            $eq: [ "$uid" , req.session.userID]
                        }
                    }
                    
                }   
            } , {
                $project: {
                    _id: 0,
                    "uid": 1
                }
            } , {
                $lookup: {
                    from: "blogs",
                    let: {
                        "u_id": "$uid"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$uid", "$$u_id"]
                            }
                        }
                    } , {
                        $project: {
                            _id: 0,
                            "hashtagIds": 1
                        }
                    }],
                    as: "blogInfoArray"
                }
            } , {
                $project: {
                    "uid": 0
                }
            } , {
                $unwind: "$blogInfoArray"
            } , {
                $project: {
                    "hashtagIDArray": "$blogInfoArray.hashtagIds"
                }
            } , {
                $unwind: "$hashtagIDArray"
            } , {
                $group: {
                    _id: "hashtagIDArray",
                    "hashtagIDs": {
                        $addToSet: "$hashtagIDArray"
                    }
                }
            } , {
                $project: {
                    _id: 0,
                }
            }]
        
            
        }
    }])



















    



    await Promise.all([
        blogSearchPromise,
        hashtagSearchPromise,
        authorSearchPromise
    ])
    .then(
        async (result) => {
            var blogSearchResult = result[0][0];
            var hashtagSearchResult = result[1][0];
            var authorSearchResult = result[2][0];


        
            var blogSearch_setA = blogSearchResult.blogIDs[0].blogIDs;
            var blogSearch_setB = hashtagSearchResult.blogIDs[0].blogIDs;
            var blogSearch_setC = authorSearchResult.blogIDs[0].blogIDs ;

            var totalBlogSearchResult = blogSearch_setA.concat( blogSearch_setB , blogSearch_setC )
            var blogSearchResultIDs = [...new Set(totalBlogSearchResult)];



            var HashTagSearch_setA = hashtagSearchResult.hashtagIDs[0].hashtagIDs;
            var HashTagSearch_setB = blogSearchResult.hashtagIDs[0].hashtagIDs;
            var HashTagSearch_setC = authorSearchResult.hashtagIDs[0].hashtagIDs ;

            var totalHashTagSearchResult = HashTagSearch_setA.concat( HashTagSearch_setB , HashTagSearch_setC )
            var hashtagSearchResultIDs = [...new Set(totalHashTagSearchResult)];








            var userIDSearch_setA = authorSearchResult.uids[0].uids;
            var userIDSearch_setB = blogSearchResult.uids[0].uids;
            var userIDSearch_setC = hashtagSearchResult.uids[0].uids;

            var totalUidsSearchResult = userIDSearch_setA.concat( userIDSearch_setB , userIDSearch_setC )
            var uidsSearchResultIDs = [...new Set(totalUidsSearchResult)];



            var processedResultObj = {
                processedData_blogs : {},
                processedData_hashtags : {},
                processedData_authors : {},
            }


            await blogs_model.aggregate([{
                $facet: {
                    
                    
                    "stage1": [{
                        $group: {
                            _id: "",
                        }
                    } , {
                        $addFields: {
                            "blogIDsArray": blogSearchResultIDs
                        }
                    }]
                    
            
                    
                }   
            } , {
                $addFields: {
                    "blogIDs": {
                        $arrayElemAt: ["$stage1" , 0]
                    }
                }
            } , {
                $project: {
                    "blogIDs": "$blogIDs.blogIDsArray"
                }
            } , {
                $unwind: "$blogIDs"
            } , {
                $lookup: {
                    from: "blogs",
                    
                    let: {
                        "blog_ID": "$blogIDs"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$blogID", "$$blog_ID"]
                            }
                        }
                    }, {
                        
                        $lookup: {
                            from: "users-credentials",
                            foreignField: "uid",
                            localField: "uid",
                            as: "authorDetailsArray"
                        }
                    } , {
                        $addFields: {
                            "authorDetails": {
                                $arrayElemAt: ["$authorDetailsArray" , 0]
                            }
                        }
                    } , {
                
                        $lookup: {
                            from: "likes",
                            let: {
                                "blog_ID": "$blogID"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$blogID", "$$blog_ID" ]
                                    }
                                }
                            }],
                            as: "likesInfoArray"
                        }
                        
                        
                    } , {
                        
                        $lookup: {
                            from: "views",
                            let: {
                                "blog_ID": "$blogID"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$blogID", "$$blog_ID" ]
                                    }
                                }
                            }],
                            as: "viewsInfoArray"
                        }
                        
                        
                    } , {
                        
                        $project: {
                            "blogID": 1,
                            "thumbnailPic": {
                                "mimetype": {
                                    $concat: ['data:', "$thumbnailPic.mimetype", ";base64,"]
                                },
                                "data": "$thumbnailPic.data"
                            },
                            "title": 1,
                            "likes": {
                                $size: "$likesInfoArray"
                            },
                            "views": {
                                $size: "$viewsInfoArray"
                            },
                            "authorName": "$authorDetails.userName",
                            "authorImg": {
                                "mimetype": {
                                    $concat: ['data:', "$authorDetails.profilePic.mimetype", ";base64,"]
                                },
                                "data": "$authorDetails.profilePic.data"
                            },
                            
                            
                            "blogDesc": {
                                $substr: ["$blog", 0, 170]
                            } 
                        }
            
                        
                        
                    }],
                    as: "blogsInfoArray"
                }
            } , {
                $project: {
                    "blog": "$blogsInfoArray"
                }
            } , {
                $unwind: "$blog"
            }])
            .then (
                (data) => {
                    

                    var ejs = require('ejs');
                    var path = require('path');
    
                    var templatePath = path.resolve(__dirname, '../../views/views.inc/blog_card.inc.ejs');
                    var templateStr  = ejs.fileLoader(templatePath, 'utf8');
                    var template     = ejs.compile(templateStr, {filename: templatePath});
                    
    
                    if (data.length > 0) {
    
    
                        var processedData = ""
    
                        data.forEach(
                            (dataElement) => {



    
                                var t = template(
                                    {
                                        img: (dataElement.blog.thumbnailPic.mimetype + dataElement.blog.thumbnailPic.data.toString('base64')),
                                        desc: dataElement.blog.blogDesc,
                                        likes: UTILS.nFormatter(dataElement.blog.likes, 1),
                                        views: UTILS.nFormatter(dataElement.blog.views, 1),
                                        title: dataElement.title,
                                        authorName: dataElement.blog.authorName,
                                        authorImg: (dataElement.blog.authorImg.mimetype + dataElement.blog.authorImg.data.toString('base64')),
                                        blogId: dataElement.blog.blogID,
                                    }
                                )                                     
                                
                                processedData += t;
                            }
                        );
    
                        processedResultObj['processedData_blogs'] = { processedDataLength: data.length , processedDataString: processedData};
                    }
                    else {

                        processedResultObj['processedData_blogs'] = { processedDataLength: data.length}
                    }
    















                }
            )



            



            await userCredentials_modal.aggregate([{
                $facet: {
                    "stage1": [{
                        $group: {
                            _id: ''
                        }
                    } , {
                        $addFields: {
                            "uidsArray": uidsSearchResultIDs
                        }
                    }]
                }
                
                
                
            } , {
                $addFields: {
                    "uidsArrayInfo": {
                        $arrayElemAt: ["$stage1", 0]
                    } 
                }
            } , {
                $project: {
                    "uidsArray": "$uidsArrayInfo.uidsArray"
                }
            } , {
                $unwind: "$uidsArray"
            } , {
                $lookup: {
                    from: "users-credentials",
                    let: {
                        "u_id": "$uidsArray"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$uid", "$$u_id"]
                            }
                        }
                    }],
                    as: "usersCredInfoArr"
                }
            } , {
                $addFields: {
                    "usersCredInfo": {
                        $arrayElemAt: ["$usersCredInfoArr", 0]
                    }
                }
            } , {
                $project: {
                    "userName": "$usersCredInfo.userName",
                    "authorID": "$uidsArray",
                    "profileImg": {
                        
                        "mimetype": {
                            $concat: ['data:', "$usersCredInfo.profilePic.mimetype", ";base64,"]
                        },
                            
                        "data": "$usersCredInfo.profilePic.data"   
                    }
                }
            }])
            .then (
                (data) => {



                    if (data.length > 0) {

                        var ejs = require("ejs");
                        var path = require("path");
            
                        var templatePath = path.resolve(__dirname, '../../views/views.inc/authorCard.inc.ejs');
                        var templateStr  = ejs.fileLoader(templatePath, 'utf8');
                        var template     = ejs.compile(templateStr, {filename: templatePath});
                        
        
        
                        var processedData = "";
            
                        data.forEach(
                            (dataElement) => {
            
                                var t = template(
                                    {
                                        authorID: dataElement.authorID,
                                        profileImg: (dataElement.profileImg.mimetype + dataElement.profileImg.data.toString("base64")),
                                        userName: dataElement.userName
                                    }
                                )                                     
                                
                                processedData += t;
                            }
                        );
            
            
            
                        // res.json({processedDataLength: data.length, processedDataStr: processedData});
                        processedResultObj['processedData_authors'] = {processedDataLength: data.length, processedDataStr: processedData};
                    }
                    else {
                        // res.json({processedDataLength: data.length});
                        processedResultObj['processedData_authors'] = {processedDataLength: data.length};
                    }












                }
            )




















            await hashtag_modal.aggregate([{
                $facet: {
                    
                    
                    "stage1": [{
                        $group: {
                            _id: "",
                        }
                    } , {
                        $addFields: {
                            "hashtagIDsArray": hashtagSearchResultIDs
                        }
                    }]
                    
            
                    
                }   
            } , {
                $addFields: {
                    "hashtagIDs": {
                        $arrayElemAt: ["$stage1" , 0]
                    }
                }
            } , {
                $project: {
                    "hashtagIDs": "$hashtagIDs.hashtagIDsArray"
                }
            } , {
                $unwind: "$hashtagIDs"  
            } , {
                $lookup: {
                    from: "hashtag",
                    let: {
                        "hashtag_ID": "$hashtagIDs"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$hashtagID", "$$hashtag_ID"]
                            }
                        }
                    } , {
                        $project: {
                            "hashtag": 1,
                            _id: 0
                        }
                    }],
                    as: "hashtagInfoArray"
                }
            } , {
                $addFields: {
                    "hashtagInfoArray": {
                        $arrayElemAt: ["$hashtagInfoArray", 0]
                    }
                }
            } , {
                $project: {
                    "hashtagID": "$hashtagIDs",
                    "hashtag": "$hashtagInfoArray.hashtag"
                }
            }])
            .then (
                (data) => {
                


                    if (data.length > 0) {
                        var ejs = require("ejs");
                        var path = require("path");
            
                        var templatePath = path.resolve(__dirname, '../../views/views.inc/hashtag.inc.ejs');
                        var templateStr  = ejs.fileLoader(templatePath, 'utf8');
                        var template     = ejs.compile(templateStr, {filename: templatePath});
                        
            
                        var processedData = "";
            
                        data.forEach(
                            (dataElement) => {
            
                                var t = template(
                                    {
                                        hashtagID: dataElement.hashtagID,
                                        hashtag:   dataElement.hashtag
                                    }
                                )                                     
                                
                                processedData += t;
                            }
                        );
            
            
            
                    
                        processedResultObj['processedData_hashtags'] = {processedDataLength: data.length, processedDataStr: processedData};
                    }
                    else {
                        processedResultObj['processedData_hashtags'] = {processedDataLength: data.length}
                    }












                }
            )






            res.json(processedResultObj);

        }
    )

    

    

    

















});
































































module.exports = router;