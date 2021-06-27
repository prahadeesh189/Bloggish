const express = require('express');
const router = express.Router();




























var login_model = require('../models/login-model.js');
var userCredentials_model = require('../models/userCredentials-model.js');
var author_model = require('../models/author-model.js');






router.post('/auth',

    async (req, res) => {
            
        try {

            
            



            await userCredentials_model.aggregate([{
                $match: {
                    "email" : req.body.loginEmail
                }
            } , {
                
                $lookup: {
                    from: "login",
                    let: {"uidVar": "$uid"},
                    pipeline: [{
                        $match: {
                            $expr: {
                               $eq: ["$uid", "$$uidVar"]   
                            }
                        }
                    } , {
                        $project: {
                            _id: 0,
                            "uid": 1,
                            "password":1
                        }
                    }],
                    as: "login_rec"
                }
                
            } , {
                
                $addFields: {
                    "login_rec_elem": {
                        $arrayElemAt: ["$login_rec", 0]
                    }
                }
            
            } , {
                $project: {
                    _id: 0,
                    "uid": 1,
                    "email": 1,
                    "password": "$login_rec_elem.password"
                }
            } , {
                $match: {
                    "password" : req.body.loginPassword
                }
            }])
            .then( (data) => {


                if (data.length > 0 ) {

                    req.session.loggedin = true;
                    req.session.userID = data[0].uid;


                    res.json( {isAuthentified: true} );
                }
                else {
                    res.json( {isAuthentified: false} );
                }


            } )
            .catch( (error) => {
                console.log(error);
            } );
            













































            // await login_model.aggregate([{
    
            //     $match: {
            //         "uid": (""+req.session.userID)
            //     }
                
            // } , {
                
            //     $lookup: {
                    
            //         from: "users-credentials",
            //         "let": {"uidvar": "$uid"},
            //         "pipeline": [{
            //             $match: {
            //                 $expr: {
            //                     $eq: ["$uid", "$$uidvar"]   
            //                 }
            //             }
            //         } , {
            //             $project: {
            //                 _id: 0,
            //                 "email": 1
            //             }
            //         }],
                    
            //         as: "users-credential"
            //     }
            // } , {
                
            //     $addFields: {
            //         "loginEmail": {
            //             $arrayElemAt: ["$users-credential", 0]
            //         }
            //     }
                
            // } , {
                
            //     $project: {
            //         _id: 0,
            //         "uid": 1,
            //         "password": 1,
            //         "email": "$loginEmail.email"
            //     }
                
            // }]).then( 
            //     (data) => {

            //         console.log(data);



                    // if (( req.body.loginEmail == data[0].email ) && ( req.body.loginPassword == data[0].password )) {

                    //     // req.session.loggedin = true;
                    //     // req.session.userID = data[0].uid;

                    //     // res.json( {isAuthentified: true} );
                    //     // console.log(req.session);


                    //     // res.render("home-page.ejs");
                    //     // res.redirect("/");
                    //     // location.replace("/");
                    //     // res.location("/");
                    //     // res.locat
                    // }
                    // else {
                    //     // res.redirect('/login?error=420');
                    //     // res.json( {isAuthentified: false} );
                    // }



            //     }
            // ).catch(
            //     (error) => {
            //         console.log(error);
            //     }
            // );      
            
            
            
        } catch (error) {
            console.log(error);
        }











    }
);




router.get('/logout', 
    (req, res) => {
        req.session.destroy(
            (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.redirect('/login');
                }
            }
        );   
    }
);












router.post('/signup',
    async (req, res) => {
        
        try {

            if ( req.files != null ) {

                var newUser = new userCredentials_model({
                    uid             : req.body.UidStr,
                    userName        : req.body.userName,
                    email           : req.body.emailID,
                    bio             : req.body.bio,
                    profilePic      : {
                        imgName: req.files['profile-img'].name,
                        data: req.files['profile-img'].data,
                        size: req.files['profile-img'].size,
                        mimetype: req.files['profile-img'].mimetype,
                    },
                });
            }
            else {
                var newUser = new userCredentials_model({
                    uid             : req.body.UidStr,
                    userName        : req.body.userName,
                    email           : req.body.emailID,
                    bio             : req.body.bio,
                    profilePic      : null,
                });
            }


            var newLoginmodal = new login_model({
                uid: req.body.UidStr,
                password: req.body.password,
            });

            var newAuthor_model = new author_model({
                dateOfJoining:      Date.now(),
                uid:                req.body.UidStr, 
                lastPostDate:       null,
                lastLoginDate:      null,
                reputationLevel:    1,
            });



            var Errors = false;

            const newUser_save = newUser.save( (error, product, naffected) => {
                if (error != null) {
                    Errors = true;
                }
            } );
            const newLoginmodal_save = newLoginmodal.save( (error, product, naffected) => {
                if (error != null) {
                    Errors = true;
                }
            } );
            const newAuthor_model_save = newAuthor_model.save( (error, product, naffected) => {
                if (error != null) {
                    Errors = true;
                }
            } );






            if ( (req.session.loggedin == true) && (req.session.userID != null) ) {
                if (Errors == false) {
                    res.json({ newUserCreated: true });
                }
                else {
                    res.json({ newUserCreated: false });
                }
            }
            else {
                res.redirect('/login?error=421');
            }


            
            

        } catch (error) {
            console.log(error);
        }
        

        



    }
);







module.exports = router;