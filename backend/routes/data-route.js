const express = require('express');
const router = express.Router();
const UTILS = require('../UTIL/UTILS.js');












router.get("/navinfo", async (req, res) => {
   
    
    var userCredentials_modal = require('../models/userCredentials-model');

    await userCredentials_modal.aggregate([{
        $match: {
            "uid" : req.session.userID
        }
    } , {
        $project: {
            _id: 0,
            "uid": 1,
            "userName": 1,
            "profilePic": 1
        }
    }])
    .then( (data) => {
        
        if (data.length != 0) {
            var profilePicBase64String = "data:" + data[0].profilePic.mimetype + ";base64," + data[0].profilePic.data.toString('base64');
            res.json( {userName: data[0].userName , ProfilePicBase64String: profilePicBase64String} );
        }
        else {
            res.send("cannot find nav info ...");
        }
        

    })
    .catch( (error) => {
        console.log(error);
    });

});





























router.get('/dailyblogs/:offset/:limit', 
    async (req, res) => {





        var noFollowingBlogs = false;
        var follow_model = require('../models/follow-model');

        await follow_model.aggregate([{
            $match: {
                "uid": req.session.userID
            }
        } , {
            
            $lookup: {
                from: "blogs",
                
                let: {
                    "following_ID": "$followingId"
                },
                pipeline:[{
                    $match: {
                        $expr: {
                            $eq: ["$$following_ID", "$uid"]
                        }
                    }
                } , {
                    
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
                }  , {
            
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
                    
                    
                } ,  {
                    $project: {
                        _id: 1,
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
                _id: 0,
                "blogsInfoArray": 1
            }
        } , {
            $unwind: "$blogsInfoArray"
        } , {
            $project: {
                "blog": "$blogsInfoArray"
            }
        }]).sort({"dateOfPost": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
        .then(
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
                                    likes: UTILS.nFormatter(dataElement.blog.likes, 1) ,
                                    views: UTILS.nFormatter(dataElement.blog.views, 1) ,
                                    title: dataElement.blog.title,
                                    authorName: dataElement.blog.authorName,
                                    authorImg: (dataElement.blog.authorImg.mimetype + dataElement.blog.authorImg.data.toString('base64')),
                                    blogId: dataElement.blog.blogID,
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
        .catch(
            (error) => {
                console.log(error);
            }
        );
        










        var blog_model = require('../models/blog-model.js');
        await blog_model.aggregate([{
            $match: {
                $expr: {
                    $not: {
                        $eq: ["$uid", req.session.userID]   
                    }
                }
            }
        } , {
            
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

            
            
        }]).sort({"dateOfPost": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
        .then(
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
                                    img: (dataElement.thumbnailPic.mimetype + dataElement.thumbnailPic.data.toString('base64')),
                                    desc: dataElement.blogDesc,
                                    likes: UTILS.nFormatter(dataElement.likes, 1) ,
                                    views: UTILS.nFormatter(dataElement.views, 1) ,
                                    title: dataElement.title,
                                    authorName: dataElement.authorName,
                                    authorImg: (dataElement.authorImg.mimetype + dataElement.authorImg.data.toString('base64')),
                                    blogId: dataElement.blogID,
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
        .catch(
            (error) => {
                console.log(error);
            }
        );




        


    }
);




















































router.get('/yourblogs/:offset/:limit' , 

    async (req, res) => {


        var blog_model = require('../models/blog-model.js');


        await blog_model.aggregate([{
            $match: {
                $expr: {
                    $eq: ["$uid", req.session.userID]   
                }
            }
        } , {
            
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

            
            
        }]).sort({"dateOfPost": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
        .then(

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
                                    img: (dataElement.thumbnailPic.mimetype + dataElement.thumbnailPic.data.toString('base64')),
                                    desc: dataElement.blogDesc,
                                    likes: UTILS.nFormatter(dataElement.likes, 1),
                                    views: UTILS.nFormatter(dataElement.views, 1),
                                    title: dataElement.title,
                                    authorName: dataElement.authorName,
                                    authorImg: (dataElement.authorImg.mimetype + dataElement.authorImg.data.toString('base64')),
                                    blogId: dataElement.blogID,
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
        .catch(
            (error) => {
                console.log(error);
            }
        );






    }
);







router.get('/accountblogs/:offset/:limit/:accountID' , 

    async (req, res) => {


        var blog_model = require('../models/blog-model.js');


        await blog_model.aggregate([{
            $match: {
                $expr: {
                    $eq: ["$uid", req.params.accountID]   
                }
            }
        } , {
            
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

            
            
        }]).sort({"dateOfPost": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
        .then(

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
                                    img: (dataElement.thumbnailPic.mimetype + dataElement.thumbnailPic.data.toString('base64')),
                                    desc: dataElement.blogDesc,
                                    likes: UTILS.nFormatter(dataElement.likes, 1),
                                    views: UTILS.nFormatter(dataElement.views, 1),
                                    title: dataElement.title,
                                    authorName: dataElement.authorName,
                                    authorImg: (dataElement.authorImg.mimetype + dataElement.authorImg.data.toString('base64')),
                                    blogId: dataElement.blogID,
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
        .catch(
            (error) => {
                console.log(error);
            }
        );






    }
);






































router.put('/viewPost/:blogID', async (req, res) => {

    var view_model = require('../models/views-model.js');

    var view_model = new view_model({
        "blogID": req.params.blogID,  
        "uid":    req.session.userID, 
    });

    await view_model.save( (error, product, naffected) => {

        if (error != null) {
            console.log(error);
            res.json( {viewAdded: false} );
        }
        else {
            res.json( {
                viewAdded: true,
            });
        }
    });
    
});




router.put('/likepost/:blogID' , async (req, res) => {

    // console.log( req.params.blogID , req.session.userID );


    // console.log( req.url.split('/')[2] );


    var likes_model = require('../models/likes-model.js');
    var result;

    await likes_model.updateOne({
        "blogID":   req.params.blogID,
        "uid":      req.session.userID
    } , {
        $setOnInsert: {
            "blogID":   req.params.blogID,
            "uid":      req.session.userID
        }
    } , {
        upsert: true
    })
    .then( 
        (data) => {
            result = data;
        }
    );


    if (result.upserted == null) {

        likes_model.remove({
            "blogID":   req.params.blogID,
            "uid":      req.session.userID
        })
        .then(  
            (data) => {
                res.json( {liked: false} );
            }
        );

    }
    else {
        res.json( {liked: true} );
    }




});





























router.get('/loadTopicHashtags/:offset/:limit' , async (req, res) => {
    

    var hashtag_model = require('../models/hashtag-model.js');

    await hashtag_model.aggregate([]).sort({"dateOfIntoduction": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(  
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
    
    
    
                res.json({processedDataLength: data.length, processedDataStr: processedData});
            }
            else {
                res.json({processedDataLength: data.length});
            }

        }
    )
    .catch(
        (error) => {console.log(error);}
    );


});































router.get('/loadAuthor/:offset/:limit', async (req, res) => {


    var author_model = require('../models/author-model.js');


    await author_model.aggregate([{
        $match: {
            $expr: {
                $not: {
                    $eq: ["$uid", req.session.userID]
                }
            }
        }
    } , {
        $lookup: {
            from: "users-credentials",
            foreignField: "uid",
            localField: "uid",
            as: "usersInfoArray"
        }
    } , {
        $addFields: {
            "usersInfo": {
                $arrayElemAt: ["$usersInfoArray", 0]
            }
        }
    } , {
        $project: {
            "_id": 1,
            "dateOfJoining": 1,
            "uid": 1,
            "lastPostDate": 1,
            "lastLoginDate": 1,
            "reputationLevel": 1,
            "userName": "$usersInfo.userName",
            "profilePic": {
                
                "mimetype": {
                    $concat: ['data:', "$usersInfo.profilePic.mimetype", ";base64,"]
                },
                "data": "$usersInfo.profilePic.data"
            },
        }
    }]).sort({"lastPostDate": -1, "lastLoginDate": -1,"dateOfJoining": -1 ,"_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
    .then(
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
                                authorID: dataElement.uid,
                                profileImg: (dataElement.profilePic.mimetype + dataElement.profilePic.data.toString("base64")),
                                userName: dataElement.userName
                            }
                        )                                     
                        
                        processedData += t;
                    }
                );
    
    
    
                res.json({processedDataLength: data.length, processedDataStr: processedData});

            }
            else {
                res.json({processedDataLength: data.length});
            }

        }
    )
    .catch( (error) => {
        console.log(error);
    });
});










































router.get('/trendblogs/:offset/:limit' , 

    async (req, res) => {

        var blog_model = require('../models/blog-model.js');

        await blog_model.aggregate([{
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

            
            
        }]).sort({"dateOfPost": -1, "_id": -1}).skip( parseInt(req.params.offset) ).limit( parseInt(req.params.limit) )
        .then(

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
                                    img: (dataElement.thumbnailPic.mimetype + dataElement.thumbnailPic.data.toString('base64')),
                                    desc: dataElement.blogDesc,
                                    likes: UTILS.nFormatter(dataElement.likes, 1),
                                    views: UTILS.nFormatter(dataElement.views, 1),
                                    title: dataElement.title,
                                    authorName: dataElement.authorName,
                                    authorImg: (dataElement.authorImg.mimetype + dataElement.authorImg.data.toString('base64')),
                                    blogId: dataElement.blogID,
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
        .catch(
            (error) => {
                console.log(error);
            }
        );






    }
);



































































router.get('/hashtag/:offset/:limit/:hashtagID' , async (req, res) => {



    var hashtagBlog_model = require('../models/hashtag_Blog-model.js');

    await hashtagBlog_model.aggregate([{
        $match: {
            "hashtagID": req.params.hashtagID
        }
    } , {
        $project: {
            _id: 0,
            "blogID": 1
        }
    } , {
        $lookup: {
            from: "blogs",
            let: {
                "blog_ID": "$blogID"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$blogID", "$$blog_ID"]   
                    }
                }
            } , {
                
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
                    },
                    
                    "dateOfPost": 1
                }
            
                        
                        
            }],
            as: "BlogArray"
        }
    } , {
        $unwind: "$BlogArray"
    } , {
        $project: {
            "blogID": 0,
        }
    }]).sort({"BlogArray.dateOfPost": -1, "BlogArray._id": -1}).skip( parseInt( req.params.offset ) ).limit( parseInt( req.params.limit ) )    
    .then(
        (data) => {





            var ejs = require('ejs');
            var path = require('path');


            var templatePath = path.resolve(__dirname, '../../views/views.inc/blog_card.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            
            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataelement) => {


                        var t = template(
                            {
                                img: (dataelement.BlogArray.thumbnailPic.mimetype + dataelement.BlogArray.thumbnailPic.data.toString('base64')),
                                desc:   dataelement.BlogArray.blogDesc,
                                likes:  UTILS.nFormatter(dataelement.BlogArray.likes, 1),
                                views:  UTILS.nFormatter(dataelement.BlogArray.views, 1),
                                title:  dataelement.BlogArray.title,
                                authorName: dataelement.BlogArray.authorName,
                                authorImg: (dataelement.BlogArray.authorImg.mimetype + dataelement.BlogArray.authorImg.data.toString('base64')),
                                blogId: dataelement.BlogArray.blogID,
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
    .catch( (error) => {console.log(error);} );        






});
























router.get('/likedblogs/:offset/:limit' , async (req, res) => {


    var likes_model = require('../models/likes-model.js');



    await likes_model.aggregate([{
        $match: {
            "uid": req.session.userID
        }
    } , {
        $project: {
            _id: 0,
            "blogID": 1
        }
    } , {
        $lookup: {
            from: "blogs",
            let: {
                "blog_ID": "$blogID"
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $eq: ["$blogID", "$$blog_ID"]   
                    }
                }
            } , {
                
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
                    },
                    
                    "dateOfPost": 1
                }
            
                        
                        
            }],
            as: "BlogArray"
        }
    } , {
        $unwind: "$BlogArray"
    } , {
        $project: {
            "blogID": 0,
        }
    }]).sort({"BlogArray.dateOfPost": -1, "BlogArray._id": -1}).skip( parseInt( req.params.offset ) ).limit( parseInt( req.params.limit ) )    
    .then(
        (data) => {

            var ejs = require('ejs');
            var path = require('path');


            var templatePath = path.resolve(__dirname, '../../views/views.inc/blog_card.inc.ejs');
            var templateStr  = ejs.fileLoader(templatePath, 'utf8');
            var template     = ejs.compile(templateStr, {filename: templatePath});
            
            if (data.length > 0) {

                var processedData = ""

                data.forEach(
                    (dataelement) => {


                        var t = template(
                            {
                                img: (dataelement.BlogArray.thumbnailPic.mimetype + dataelement.BlogArray.thumbnailPic.data.toString('base64')),
                                desc:   dataelement.BlogArray.blogDesc,
                                likes:  UTILS.nFormatter(dataelement.BlogArray.likes, 1),
                                views:  UTILS.nFormatter(dataelement.BlogArray.views, 1),
                                title:  dataelement.BlogArray.title,
                                authorName: dataelement.BlogArray.authorName,
                                authorImg: (dataelement.BlogArray.authorImg.mimetype + dataelement.BlogArray.authorImg.data.toString('base64')),
                                blogId: dataelement.BlogArray.blogID,
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
    .catch( (error) => {console.log(error);} );        




})



















































router.put('/addFollow/:followUserId', async (req, res) => {

    var follow_model = require('../models/follow-model.js');
    var result;

    await follow_model.updateOne({
        uid: req.session.userID,
        followingId: req.params.followUserId
    } , {
        $setOnInsert: {
            uid: req.session.userID,
            followingId: req.params.followUserId
        }
    } , {
        upsert: true
    })
    .then( 
        (data) => {
            result = data;
        }
    );



    if (result.upserted == null) {

        follow_model.deleteOne({
            uid: req.session.userID,
            followingId: req.params.followUserId
        })
        .then(  
            (data) => {
                res.json( {following: false} );
            }
        );

    }
    else {
        res.json( {following: true} );
    }










    
});





router.put('/mute/:muteUserId', async (req, res) => {

    var mute_model = require('../models/mute-model');
    var result;

    await mute_model.updateOne({
        uid: req.session.userID,
        mutedID: req.params.muteUserId
    } , {
        $setOnInsert: {
            uid: req.session.userID,
            mutedID: req.params.muteUserId
        }
    } , {
        upsert: true
    })
    .then( 
        (data) => {
            result = data;
        }
    );



    if (result.upserted == null) {

        mute_model.deleteOne({
            uid: req.session.userID,
            mutedID: req.params.muteUserId
        })
        .then(  
            (data) => {
                res.json( {muted: false} );
            }
        );

    }
    else {
        res.json( {muted: true} );
    }



});





router.put('/block/:blockUserId', async (req, res) => {

    var block_model = require('../models/block-model');
    var follow_modal          = require('../models/follow-model.js');
    var mute_model            = require('../models/mute-model');
    var result;





    await block_model.updateOne({
        uid: req.session.userID,
        BlockedId: req.params.blockUserId
    } , {
        $setOnInsert: {
            uid: req.session.userID,
            BlockedId: req.params.blockUserId
        }
    } , {
        upsert: true
    })
    .then( 
        (data) => {
            result = data;
        }
    );



    if (result.upserted == null) {

        await block_model.deleteOne({
            uid: req.session.userID,
            BlockedId: req.params.blockUserId
        })
        .then(  
            async (data) => {



                await follow_modal.deleteOne({
                    uid: req.session.userID,
                    followingId: req.params.blockUserId
                });
                
            
                await mute_model.deleteOne({
                    uid: req.session.userID,
                    mutedID: req.params.blockUserId
                });
                
            



                res.json( {Blocked: false} );
            }
        );

    }
    else {
        res.json( {Blocked: true} );
    }

});





























module.exports = router;