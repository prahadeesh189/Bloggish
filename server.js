const { render } = require('ejs');
const express = require('express');
const app = express();
const session = require('express-session');
const {v4 : uuidv4} = require('uuid');

const CONFIG = require('./config.js');
const UTILS = require('./backend/UTIL/UTILS.js');



var path = require('path');

app.set('view engine', 'ejs');

app.use(express.static( path.join(__dirname, 'style/css')));
app.use(express.static( path.join(__dirname, 'js'       )));
app.use(express.static( path.join(__dirname, 'assets') ));
















// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true,
//     rolling: true,
//     cookie: {
//         maxAge: 1*60*60*1000
//     },
// }));


app.use(session({
    secret: 'xxx',
    name: 'sessionId',
    resave: true,
    saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
      httpOnly: true,
      maxAge: 1*60*60*1000
    }
}))




app.use(express.json());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());




const filesUpload = require('express-fileupload');
app.use( filesUpload() );



// const multer = require('multer');
// var storage = multer.memoryStorage();
// // var upload = multer({ storage: storage });


// app.use( multer({storage: storage}).any() );
// app.use( multer({storage: storage}).fields() );


















const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var mdb = "mongodb://127.0.0.1:27017/bloggish";

mongoose.connect( mdb , {useNewUrlParser:true , useUnifiedTopology: true }  );
const db = mongoose.connection;


db.once('open', () => {
    console.log("::>> Connected to DB");
}).on('error', (err) => {
    console.log('::>> '+ err);
});















// app.post('/delete', (req, res) => {

//     var data = req.body.data;

//     console.log( data.bid );
//     // res.send('this blog is deleted : '+ req.body.data );
// });




const login_routes = require('./backend/routes/login-route.js');
app.use('/', login_routes);

const write_routes = require('./backend/routes/write-route.js');
app.use('/', write_routes );

const account_routes = require('./backend/routes/account-route.js');
app.use('/', account_routes );

const editBlog_routes = require('./backend/routes/editBlog-route.js');
app.use('/', editBlog_routes );

const data_routes = require('./backend/routes/data-route.js');
app.use('/', data_routes);

const follow_routes = require('./backend/routes/follow-route.js');
app.use('/', follow_routes);

const search_routes = require('./backend/routes/search-route.js');
app.use('/', search_routes);















































app.get('/', async (req, res) => {



    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
        
    //     // req.session.userID = "Uid-21843cda-ae9e-4f95-a183-a50e3d4600bd";
    // }







    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
            res.render('home-page.ejs');
    }
    else {
        res.redirect('/login?error=4231');
    }
});









app.get('/login', (req, res) => {

    
    // console.log("L ===> ",req.session.loggedin , req.session.userID);

    if ( (req.session.loggedin == false) || (req.session.loggedin == null)  ) {
        if (req.query.error == null) {
            res.render('login-page.ejs');
        }
        else if (req.query.error != null) {
            res.render('login-page.ejs', {error: req.query.error} );
        }
    }
    else {
        // res.redirect('/');
        res.redirect('/logout');
    }
});




// app.get('/getstarted', (req, res) => {

    
//     if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
//         res.render('getStarted-page.ejs', {email:  req.body.signupEmail, password: req.body.signupPassword, UidStr: newUid});
//     }
//     else {
//         res.redirect('/login?error=421');
//     }

// });






app.post('/getstarted', (req, res) => {

    var newUid = 'Uid-'+ uuidv4()

    req.session.loggedin = true;
    req.session.userID = newUid;

    // console.log( "G ===> ", req.session.loggedin , req.session.userID, req.body);

    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
        res.render('getStarted-page.ejs', {email:  req.body.signupEmail, password: req.body.signupPassword, UidStr: newUid});
    }
    else {
        res.redirect('/login?error=4211');
    }
});

















app.get('/explore', (req, res) => {

    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
    // }





    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
        res.render('explore-page.ejs');
    }
    else {
        res.redirect('/login?error=421');
    }
    
});










app.get('/view/:blogID', async (req, res) => {




    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
    // }



    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-cfacea3e-59ef-447f-b5e4-df80a27cd61b";
    // }




    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {


        var blog_model = require('./backend/models/blog-model');

        await blog_model.aggregate([{
            $match: {
                "blogID": req.params.blogID
            }
        } , {
            
            $unwind: "$hashtagIds"
            
        } , {
            $lookup: {
                from: "hashtag",
                foreignField: "hashtagID",
                localField: "hashtagIds",
                as: "htagArray",
            }
        } , {
            $addFields: {
                "htag": {
                    $arrayElemAt: ["$htagArray", 0]
                }
            }
        } , {
            $addFields: {
                "hashtagObj": {
                    "hashtag": "$htag.hashtag",
                    "hashtagID": "$htag.hashtagID"
                }
            }
        } , {
            $project: {
                _id: 0,
                "dateOfPost": 1,
                "blogID": 1,
                "thumbnailPic": 1,
                "title": 1,
                "blog": 1,
                "Author_uid": "$uid",
                "hashtagObj": 1
            }
        } , {
            $group: {
                _id: {
                    "dateOfPost": "$dateOfPost",
                    "blogID": "$blogID",
                    "thumbnailPic": "$thumbnailPic",
                    "title": "$title",
                    "blog": "$blog",
                    "Author_uid": "$Author_uid"
                },
                hashTagObjArray: {
                    $push: "$hashtagObj"
                }
            }
        } ,  {
            $project: {
                _id: 0,
                "blogID": "$_id.blogID",
                "dateOfPost": "$_id.dateOfPost",
                "thumbnailPic": "$_id.thumbnailPic",
                "title": "$_id.title",
                "blog": "$_id.blog",
                "Author_uid": "$_id.Author_uid",
                
                "hashTagObjArray": 1,
            }
        } ,  {
            $lookup: {
                from: "users-credentials",
                foreignField: "uid",
                localField: "Author_uid",
                as: "authorDetailsArray"
            }
        } , {
            $addFields: {
                "authorDetails": {
                    $arrayElemAt: ["$authorDetailsArray", 0]
                }
            }
        } , {
            $addFields: {
                "authorInfo": {
                    "profilePic": "$authorDetails.profilePic",
                    "userName": "$authorDetails.userName",
                }
            }
        } , {
            $project: {
                "hashTagObjArray": 1,
                "blogID": 1,
                "dateOfPost": 1,
                "thumbnailPic": 1,
                "title": 1,
                "blog": 1,
                "Author_uid": 1,
                "authorInfo": 1
            }
        }])        
        .then(
            async (data) => {


                var isBlogAlreadyLikedByThisUser = false;
                var likesModel = require('./backend/models/likes-model.js');

                await likesModel.find(
                    {
                        "blogID" : req.params.blogID,
                        "uid" : req.session.userID,
                    }
                ).then(
                    (data) => {
                        if (data.length > 0){
                            isBlogAlreadyLikedByThisUser = true;
                        }
                    }
                );
                



                if (data.length > 0) {

                    var thumbnailPicBase64String = "data:" + data[0].thumbnailPic.mimetype + ";base64," + data[0].thumbnailPic.data.toString('base64');
                    var authorProfilePicBase64String = "data:" + data[0].authorInfo.profilePic.mimetype + ";base64," + data[0].authorInfo.profilePic.data.toString('base64');
                    
                    var editOption = false;
    
                    if (data[0].Author_uid == req.session.userID) {
                        editOption = true;
                    }
    
    
        
                    res.render('view-page.ejs' ,                 
                        {
                            hashTagObjArray: data[0].hashTagObjArray,
                            thumbnailPic: thumbnailPicBase64String,
                            title: data[0].title,
                            blog: data[0].blog,
                            editOptionEnabled: editOption,
                            authorProfilePic: authorProfilePicBase64String,
                            authorUserName: data[0].authorInfo.userName,
                            Author_uid: data[0].Author_uid,
                            isBlogAlreadyLikedByThisUser: isBlogAlreadyLikedByThisUser
                        }
                    );

                }
                else {
                    res.send("no blog found, Invalid blog id");
                }

            }
        )
        .catch( 
            (error) => {
                console.log(error);
            }
        )
    
    





    }
    else {
        res.redirect('/login?error=421');
    }
    
});













app.get('/search', (req, res) => {

    
    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
        
    //     // req.session.userID = "Uid-21843cda-ae9e-4f95-a183-a50e3d4600bd";
    // }










    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
        res.render('search-page.ejs');
    }
    else {
        res.redirect('/login?error=421');
    }
    
});


















app.get('/hashtag/:hashtagID', async (req, res) => {



    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
    // }


    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {

        var hashtag_model = require('./backend/models/hashtag-model.js');

        await hashtag_model.aggregate([{
            $match: {
                "hashtagID" : req.params.hashtagID
            }
        }])
        .then(
            (data) => {


                if (data.length > 0) {
                    res.render('hashtag-page.ejs' , {hashTag: data[0].hashtag});
                }
                else {
                    res.send("no hashtags found; Invalid hashtag Id !!!");
                }

            }
        )
        .catch((error) => {console.log(error);})




        
    }
    else {
        res.redirect('/login?error=421');
    }
    
});






















app.get('/edit/:blogID', async (req, res) => {

    

    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
    // }


    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {

        var blog_model = require('./backend/models/blog-model');

        await blog_model.aggregate([{
            $match: {
                "blogID": req.params.blogID,
            }
        } , {
            $project: {
                _id: 0,
                "hashtagIds": 1,
                "dateOfPost": 1,
                "thumbnailPic": 1,
                "blogID": 1,
                "title": 1,
                "blog": 1
            }
        } , {
            $unwind: "$hashtagIds"
        } , {
            $lookup: {
                from: "hashtag",
                foreignField: "hashtagID",
                localField: "hashtagIds",
                as: "HashtagInfoArray"
            }
        } , {
            $addFields: {
                "hashtagInfo": {
                    $arrayElemAt: ["$HashtagInfoArray", 0]
                }
            }
        } , {
            $project: {
                "dateOfPost": 1,
                "blogID": 1,
                "thumbnailPic": {
                    "mimetype": {
                        $concat: ['data:', "$thumbnailPic.mimetype", ";base64,"]
                    },
                    "data": "$thumbnailPic.data"
                },
                "title": 1,
                "blog": 1,
                "hashtag": "$hashtagInfo.hashtag"
            }
        } , {
            $group: {
                
                _id: {
                    "dateOfPost":   "$dateOfPost",   
                    "blogID":   "$blogID",   
                    "thumbnailPic":     "$thumbnailPic",   
                    "title":    "$title",   
                    "blog":     "$blog", 
                },
                "hashtag": {
                    $push: "$hashtag"
                }
            }
        } , {
            
            $project: {
                _id: 0,
                "dateOfPost":   "$_id.dateOfPost",
                "blogID":   "$_id.blogID",
                "thumbnailPic":     "$_id.thumbnailPic",
                "title":    "$_id.title",
                "blog":     "$_id.blog",
                "hashtag": 1
            } 
        }])
        
        
        
        .then(
            (data) => {
                
                
                

                if (data.length > 0) {


                    res.render('edit-page.ejs', {data : {
                        bid: req.params.blogID , 
                        title: data[0].title,
                        hashtags: data[0].hashtag.join(" "),
                        blog: data[0].blog,
                        thumbnailPic: (data[0].thumbnailPic.mimetype + data[0].thumbnailPic.data.toString('base64'))
                    } } );

                }
                else {
                    res.json({noBlogMatched: true});
                }






            }
        )
        .catch((error)=>{console.log(error);});




    }
    else {
        res.redirect('/login?error=421');
    }
    
});






app.get('/write', (req, res) => {


    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {

        data = {
            editmode: req.query.m, 
            bid: req.query.bid
        }
        
        JSON.stringify(data)
    
        res.render('write-page.ejs', {data: data}  );
        
    }
    else {
        res.redirect('/login?error=421');
    }
     
});










app.get('/account', async (req, res) => {
    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";
    // }





    
    
    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {





        var blog_insights = {}; 


        var blog_model = require('./backend/models/blog-model.js');

        await blog_model.aggregate([{
            $match: {
                "uid": req.session.userID
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
            
            
        } ,  {
            $project: {
                _id: 0,
                "uid": 1,
                "nolikes": {
                    $size: "$likesInfoArray"
                },
                "noviews": {
                    $size: "$viewsInfoArray"
                },
                "blogID": 1,
            }
        } , {
            
            $group: {
                _id: "$uid",
                "no_of_blogs": {
                    $sum: 1
                },
                "no_of_likes": {
                    $sum: "$nolikes"
                },
                "no_of_views": {
                    $sum: "$noviews"
                },
                
            }
        }])
        .then(
            (data) => {

                if (data.length == 0) {
                    blog_insights["no_of_blogs"] = 0;
                    blog_insights["no_of_likes"] = 0;
                    blog_insights["no_of_views"] = 0;
                }
                else {
                    blog_insights = data[0];
                }
                
            }
        )
        .catch((error)=>{console.log(error);});











        var follow_insight = {};

        var follow_model = require('./backend/models/follow-model');

        await follow_model.aggregate([{
            $facet: {
                "stage1": [{
                    $match: {
                        "followingId": req.session.userID
                    }
                } , {
                    $group: {
                        _id: "$followingId",
                        "followers_count": {
                            $sum: 1
                        }
                    }
                } , {
                    $project: {
                        "_id": 0
                    }
                }],
                
                
                "stage2": [{
                    $match: {
                        "uid": req.session.userID
                    }
                } , {
                    $group: {
                        _id: "$uid",
                        "following_count": {
                            $sum: 1
                        }
                    }
                } , {
                    $project: {
                        "_id": 0
                    }
                }]
            }
        }])        
        .then(
            (data) => {

                if (data[0].stage1.length > 0) {
                    follow_insight["followers_count"] = data[0].stage1[0].followers_count;
                }
                else {
                    follow_insight["followers_count"] = 0
                }
                

                if (data[0].stage2.length > 0) {
                    follow_insight["following_count"] = data[0].stage2[0].following_count;
                }
                else {
                    follow_insight["following_count"] = 0
                }
                

            }
        )
        .catch((error)=>{console.log(error);});        



















        

        var userCredentials_modal = require('./backend/models/userCredentials-model');
        
        await userCredentials_modal.aggregate([{
            $match: {
                "uid" : req.session.userID
            }
        }])
        .then(
            (data) => {
    
                if (data.length > 0) {
                    var profilePicBase64String = "data:" + data[0].profilePic.mimetype + ";base64," + data[0].profilePic.data.toString('base64');
                    res.render('account-page.ejs', {
                        ProfilePicBase64String: profilePicBase64String, 
                        UserName: data[0].userName, 
                        Bio: data[0].bio, 
                        noBlogs: UTILS.nFormatter( blog_insights.no_of_blogs, 1), 
                        noLikes: UTILS.nFormatter( blog_insights.no_of_likes, 1), 
                        noViews: UTILS.nFormatter( blog_insights.no_of_views, 1),
                        followers_count: UTILS.nFormatter( follow_insight["followers_count"], 1),
                        following_count: UTILS.nFormatter( follow_insight["following_count"], 1),

                    });
                }
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }



        );


    }
    else {
        res.redirect('/login?error=421');
    }
});

















app.get('/viewaccount/:accountID', async (req, res) => {



    // if ( (req.session.loggedin != true) || (req.session.userID == null) ) {
    //     req.session.loggedin = true;
    //     req.session.userID = "Uid-3275a6b1-58c8-4fbe-a325-8bf9e0d7bcac";

    //     // req.session.userID = "Uid-21843cda-ae9e-4f95-a183-a50e3d4600bd";

    //     // req.session.userID = "Uid-3ebf85c4-2e3e-43df-85aa-f18cd37a31b4";
    // }




    if ( (req.session.loggedin == true) && (req.session.userID != null) ) {

        var userCredentials_modal = require('./backend/models/userCredentials-model.js');
        var follow_modal          = require('./backend/models/follow-model.js');
        var mute_model            = require('./backend/models/mute-model');
        var block_model           = require('./backend/models/block-model');

        var amIblockByThisUser = false;

        await block_model.aggregate([{
            $match: {
                "BlockedId": req.session.userID,
                "uid" : req.params.accountID
            }
        }])
        .then(
            (data) => {

                if( data.length > 0 ) {
                    amIblockByThisUser = true;
                }
            }
        );


        if (amIblockByThisUser == false) {
            var followingResult = false;
            var muted           = false;
            var blocked         = false;
            

            await block_model.aggregate([{
                $match: {
                    "BlockedId": req.params.accountID,
                    "uid" : req.session.userID
                }
            }])
            .then(
                (data) => {

                    if( data.length > 0 ) {
                        blocked = true;
                    }
                }
            );
        




            await follow_modal.aggregate([{
                $match: {
                    "followingId": req.params.accountID,
                    "uid" : req.session.userID
                }
            }])
            .then(
                (data) => {

                    if( data.length > 0 ) {
                        followingResult = true;
                    }
                }
            );


            await mute_model.aggregate([{
                $match: {
                    "mutedID": req.params.accountID,
                    "uid" : req.session.userID
                }
            }])
            .then(
                (data) => {

                    if( data.length > 0 ) {
                        muted = true;
                    }
                }
            );
        }




        var follow_insight = {};

        await follow_modal.aggregate([{
            $facet: {
                "stage1": [{
                    $match: {
                        "followingId": req.params.accountID
                    }
                } , {
                    $group: {
                        _id: "$followingId",
                        "followers_count": {
                            $sum: 1
                        }
                    }
                } , {
                    $project: {
                        "_id": 0
                    }
                }],
                
                
                "stage2": [{
                    $match: {
                        "uid": req.params.accountID
                    }
                } , {
                    $group: {
                        _id: "$uid",
                        "following_count": {
                            $sum: 1
                        }
                    }
                } , {
                    $project: {
                        "_id": 0
                    }
                }]
            }
        }])        
        .then(
            (data) => {

                // console.log( data );
                
                
                if (data[0].stage1.length > 0) {
                    follow_insight["followers_count"] = data[0].stage1[0].followers_count;
                }
                else {
                    follow_insight["followers_count"] = 0
                }
                

                if (data[0].stage2.length > 0) {
                    follow_insight["following_count"] = data[0].stage2[0].following_count;
                }
                else {
                    follow_insight["following_count"] = 0
                }
                

            }
        )
        .catch((error)=>{console.log(error);});        

















        await userCredentials_modal.aggregate([{
            $match: {
                "uid" : req.params.accountID
            }
        } , {
            $project: {
                _id: 0,
                
                "picture": {
                    "mimetype": {
                        $concat: ['data:', "$profilePic.mimetype", ";base64,"]
                    },
                    "data": "$profilePic.data"
                },
                "userName": 1,
                "email": 1,
                "bio": 1,
            }
        }])
        .then(
            (data) => {

                if (amIblockByThisUser == false) {
                    res.render('viewAccount-page.ejs', {
                        blockBythisUser: amIblockByThisUser,
                        blocked: blocked,
                        userName:   data[0].userName,
                        email:      data[0].email,
                        bio:        data[0].bio,
                        picture:    (data[0].picture.mimetype + data[0].picture.data.toString('base64')),
                        following : followingResult,
                        muted : muted,

                        followers_count: UTILS.nFormatter( follow_insight["followers_count"], 1),
                        following_count: UTILS.nFormatter( follow_insight["following_count"], 1),
                    });
                }
                else {
                    res.render('viewAccount-page.ejs', {
                        blockBythisUser: amIblockByThisUser,
                        // blocked: blocked,
                        userName:   data[0].userName,
                        email:      data[0].email,
                        bio:        data[0].bio,
                        picture:    (data[0].picture.mimetype + data[0].picture.data.toString('base64')),
                        // following : followingResult,
                        // muted : muted,
                    });
                }

                
            }
        )

    }
    else {
        res.redirect('/login?error=421');
    }
});

























































app.listen( CONFIG.PORTNO , () => {
    console.log("SERVER RUNNING ON "+ CONFIG.PORTNO);
});







