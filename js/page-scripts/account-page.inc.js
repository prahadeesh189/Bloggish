function onLoad() {
    // EDIT MODE
    let edit_btn        = $('.main-account .container .edit-form .btn-container .edit-btn');
    let span_userName   = $('.main-account .container .edit-form .elements-container .span-userName');
    let span_email      = $('.main-account .container .edit-form .elements-container .span-email');
    let span_bio        = $('.main-account .container .edit-form .elements-container .span-bio');

    let save_btn        = $('.main-account .container .edit-form .btn-container .save-btn');
    let cancel_btn      = $('.main-account .container .edit-form .btn-container .cancel-btn');
    let input_userName  = $('.main-account .container .edit-form .elements-container .input-userName');
    let input_email     = $('.main-account .container .edit-form .elements-container .input-email');
    let input_bio       = $('.main-account .container .edit-form .elements-container .input-bio');

    var bioTestArea     = $('.main-account .container .edit-form .elements-container .input-bio');

    var profile_img              =  $('.main-account .container .edit-form .elements-container .image-container img.profile-img');
    var profile_imgUp_bg         =  $('.main-account .container .edit-form .profile-imgUp-bg');
    var profImgUp_cover          =  $('.main-account .container .edit-form .profImgUp-cover');
    var profile_img_upload_cont  =  $('.main-account .container .edit-form .profile-img-upload-container');
    var profile_img_preview      =  $('.main-account .container .edit-form .profile-img-preview');
    var profile_img_upload       =  $('.main-account .container .edit-form .profile-img-upload');


    let editMode                 =  $('.main-account .container .edit-form').attr('editMode');

    var closeSvg                 =  $('.main-account .container .edit-form .profImgUp-cover .profile-img-upload-container .btn-grp .close-div');  
    var saveSvg                  =  $('.main-account .container .edit-form .profImgUp-cover .profile-img-upload-container .btn-grp .save-div');  

    var profImgUpld              =  $('.main-account .container .edit-form .profImgUp-cover .profile-img-upload-container .profile-img-upload');


    


    var uploadedImgUrl;
    let currentProfImgURL = profile_img.attr('src');

    profile_img_preview.attr('src', currentProfImgURL );







    profImgUpld.bind( 'change' , function (e) {
        uploadedImgUrl = URL.createObjectURL(e.target.files[0]);

        if (uploadedImgUrl.length != 0)
            profile_img_preview.attr('src', uploadedImgUrl );
    });

    profile_img.bind( 'click' , function (e) {
        if (editMode == 'on') {
            profile_imgUp_bg.css('display', 'block');
            profImgUp_cover.css('display',  'flex');
        }
    });

    closeSvg.bind( 'click' , function (e) {
        if (editMode == 'on') {
            profile_imgUp_bg.css('display', 'none');
            profImgUp_cover.css('display',  'none');

            profImgUpld.val('');
            profile_img_preview.attr('src', currentProfImgURL );
        }
    });
    saveSvg.bind( 'click' , function (e) {
        if (editMode == 'on') {
            profile_imgUp_bg.css('display', 'none');
            profImgUp_cover.css('display',  'none');

            profile_img.attr('src', uploadedImgUrl );
        }
    });






    bioTestArea.bind( 'input' , () => {
        bioTestArea.css("height" , bioTestArea[0].scrollHeight );

        if ( bioTestArea.val() == '' )
            bioTestArea.css("height", bioTestArea.css("min-height") );
    });




    $(save_btn).bind( "click", function (e) {
        

        var fromData = new FormData( $("main.main-account .container form.edit-form")[0]  );


        $.ajax({
            type: "POST",
            url: "/updateAccountInfo",
            data: fromData,
            contentType: false,
            processData: false,
            cache: false,

            success: function (response) {
                

                if (response.updated == true) {
                    window.location.reload();
                }



            }
        });


    });








     










































    function toggleElementDisplay(element) {
        let elementDisplay = element.css("display");
        if (elementDisplay == "grid") 
            element.css("display", "none");
        else 
            element.css("display", "grid");
    }


    edit_btn.bind( 'click', function () { 
        if (editMode == 'off') {
            edit_btn.toggleClass('display-none');
            span_bio.toggleClass('display-none');
            save_btn.toggleClass('display-none');
            cancel_btn.toggleClass('display-none');
            input_userName.toggleClass('display-none');
            input_email.toggleClass('display-none');
            input_bio.toggleClass('display-none');
    
    
            toggleElementDisplay(span_userName);
            toggleElementDisplay(span_email);
    
            let span_bioDisplay = span_bio.css("display");
            if (span_bioDisplay == "block") 
                span_bio.css("display", "none");
            else 
                span_bio.css("display", "block");
            
            editMode = 'on';
        }
    });


    cancel_btn.bind( 'click', function () { 

        if (editMode == 'on') {
            edit_btn.toggleClass('display-none');
            span_userName.toggleClass('display-none');
            span_email.toggleClass('display-none');
            span_bio.toggleClass('display-none');
            save_btn.toggleClass('display-none');
            cancel_btn.toggleClass('display-none');
            input_userName.toggleClass('display-none');
            input_email.toggleClass('display-none');
            input_bio.toggleClass('display-none');

            input_userName.val('');
            input_email.val('');
            input_bio.val('');
            bioTestArea.css("height", bioTestArea.css("min-height") );
            profImgUpld.val('');
            profile_img_preview.attr('src', currentProfImgURL );
            profile_img.attr('src', currentProfImgURL );



    
            toggleElementDisplay(span_userName);
            toggleElementDisplay(span_email);
            
            let span_bioDisplay = span_bio.css("display");
            if (span_bioDisplay == "block") 
                span_bio.css("display", "none");
            else 
                span_bio.css("display", "block");
            
            editMode = 'off';
        }
        
    });



































































    var tabBarElems =  $(".main-account .finfo-cover .tab-bar-cover .tab-bar tr > * > *");
    var currentActiveTab = $(".main-account .finfo-cover .tab-bar-cover .tab-bar tr > * > .active-fTabs");

    var followInfoContainerElem = $(".main-account .insight-container .follow-info-container > *");



    var activeContent = $(".main-account .finfo-cover .tab-contents #"+$(currentActiveTab).attr('id') );
    $(activeContent).css('display', 'grid');

    var tabContents = $(".main-account .finfo-cover .tab-contents > *");
    var tabContentsClone = $(tabContents).clone(true);
    $(tabContents).remove();



    var FOLLOWERSLoadingOffsetCount = 0;
    var FOLLOWERSLoadingLimit = 2;
    var followingLoadingOffsetCount = 0;
    var followingLoadingLimit = 2;


    



    tabBarElems.each( function (indexInArray, valueOfElement) {
        
        $(valueOfElement).bind( 'click' , function (e) {
            
            currentActiveTab = $(".main-account .finfo-cover .tab-bar-cover .tab-bar tr > * > .active-fTabs");
            $(currentActiveTab).toggleClass("active-fTabs");
            activeContent = $(".main-account .finfo-cover .tab-contents #"+$(currentActiveTab).attr('id') )
            $(activeContent).css('display', 'none');


            $(valueOfElement).toggleClass("active-fTabs");
            activeContent = $(".main-account .finfo-cover .tab-contents #"+$(valueOfElement).attr('id') )
            $(activeContent).css('display', 'grid');

        });
    });











    function followToggle() {
            
        var container   = $(".main-account .container");  
        var finfoCover = $(".main-account .finfo-cover");

        $(container).toggleClass("container-close");
        $(finfoCover).toggleClass("finfo-cover-open");

        if ( $(finfoCover).hasClass("finfo-cover-open") == true ) {      
            $(tabContentsClone).each( function (indexInArray, valueOfElement) { 
                $(valueOfElement).appendTo($(".main-account .finfo-cover .tab-contents"));
            });



            var FOLLOWERSLoadingBtn = $("main.main-account .finfo-cover .tab-contents .follower-div button.loading-btn");

            function loadFOLLOWERS() { 


                $.ajax({
                    type: "GET",
                    url: "/loadMyFollowers/"+FOLLOWERSLoadingOffsetCount+"/"+FOLLOWERSLoadingLimit,
                    contentType: false,
                    cache: false,
                    processData: false,

                    success: function (response) {

                        if (response.processedDataLength > 0) {
                            $('main.main-account .finfo-cover .tab-contents .follower-div').append(response.processedDataString);




                            var followersAuthorCards = $(".main-account .finfo-cover .tab-contents .follower-div > a"); 
                            $(followersAuthorCards).each(function (indexInArray, followerAuthCard) { 
                                var authorId = $(followerAuthCard).attr('authorId');
                                var removeBtn = $('> .remove-btn', followerAuthCard );
                                
                                $(removeBtn).bind( 'mouseenter' , function (e) {
                                    $(followerAuthCard).removeAttr('href');

                                });
                
                                $(removeBtn).bind( 'mouseleave' , function (e) {
                                    
                                    $(followerAuthCard).attr('href', '/viewaccount/'+ authorId  );
                                });

                                $(removeBtn).bind( 'click', function (e) {
                                    console.log("remove this user..."+ authorId);
                                });
                            });  



                        }
                        else {
                            console.log( "no followers left !!!" );
                        }

                    }
                });
                
                FOLLOWERSLoadingOffsetCount += FOLLOWERSLoadingLimit;
            }



            if ($(".main-account .finfo-cover .tab-contents .follower-div > a").length == 0) {
                loadFOLLOWERS();
            }

            $(FOLLOWERSLoadingBtn).bind( 'click', function (e) {
                loadFOLLOWERS();
            });
            





















        
        
        
        
        
        
        
        
        
           
        




        
        
            

            var followingLoadingBtn = $("main.main-account .finfo-cover .tab-contents .following-div button.loading-btn");

            function loadFOLLOWING() { 

                $.ajax({
                    type: "GET",
                    url: "/loadMyFollowing/"+followingLoadingOffsetCount+"/"+followingLoadingLimit,
                    contentType: false,
                    cache: false,
                    processData: false,

                    success: function (response) {

                        if (response.processedDataLength > 0) {
                            $('main.main-account .finfo-cover .tab-contents .following-div').append(response.processedDataString);
                        }
                        else {
                            console.log( "no following users left !!!" );
                        }

                    }
                });
                
                followingLoadingOffsetCount += followingLoadingLimit;
            }





            if ($(".main-account .finfo-cover .tab-contents .following-div > a").length == 0) {
                loadFOLLOWING();
            }

            $(followingLoadingBtn).bind( 'click', function (e) {
                loadFOLLOWING();
            });






















            





































            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        else {
            tabContents = $(".main-account .finfo-cover .tab-contents > *");
            tabContentsClone = $(tabContents).clone(true);
            $(tabContents).remove();
        }
    }






    var goBackBtn = $(".main-account .finfo-cover .goback-btn-cover button.goback-btn");

    $(goBackBtn).bind( 'click' , function (e) {
        followToggle();
    });



    followInfoContainerElem.each( function (indexInArray, valueOfElement) { 
        $(valueOfElement).bind( 'click' , function (e) {
            followToggle();
        });
    });









































































    

    var myBlogsLoadingBtn = $("main.main-account .container .posts-container .account-blog-gallery button.loading-btn");
    var myBlogsLoadingOffset = 0;
    var myBlogsLoadingLimit = 5;


    function myBlogsHashtags() {

        $.ajax({
            type: "GET",
            url: "/yourblogs/"+myBlogsLoadingOffset+"/"+myBlogsLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,


            success: function (response) {

                if (response.processedDataLength > 0) {
                    $("main.main-account .container .posts-container .account-blog-gallery").append(response.processedDataString);
                }
                else {
                    console.log("no hashtags left !!!");
                }
                

            }
        });


        myBlogsLoadingOffset += myBlogsLoadingLimit;
    }




    myBlogsHashtags();
    $(myBlogsLoadingBtn).bind( 'click', function (e) {
        myBlogsHashtags();
    }); 

































    
























}



export {onLoad};