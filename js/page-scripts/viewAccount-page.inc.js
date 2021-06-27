function onLoad() {

    var account_info_container = $(".main-vAccount .account-info-container");
    var follow_info_div        = $(".main-vAccount .follow-info-div");
    var followers_h            = $(".main-vAccount .account-info-container .uNePi-container .follow-info-container .followers-h");
    var following_h            = $(".main-vAccount .account-info-container .uNePi-container .follow-info-container .following-h");
    var goBackBtn              = $(".main-vAccount .follow-info-div .finfo-cover .goback-btn-cover .goback-btn");

    var tabBarElem             = $(".main-vAccount .follow-info-div .finfo-cover .tab-bar-cover .tab-bar tr > * > *");


    var currentActiveTab    = $(".main-vAccount .follow-info-div .finfo-cover .tab-bar-cover .tab-bar tr td .active-fTabs");
    var currentActiveTabID  = currentActiveTab.attr('id');

    var activeContent       = $(".main-vAccount .follow-info-div .finfo-cover .tab-contents #"+currentActiveTabID);
    activeContent.css('display', 'grid');



    var tabContents = $(".main-vAccount .follow-info-div .finfo-cover .tab-contents > *");
    var tabContentsClone = $(tabContents).clone(true);
    $(tabContents).remove();


    var FOLLOWERSLoadingOffsetCount = 0;
    var FOLLOWERSLoadingLimit = 2;
    var followingLoadingOffsetCount = 0;
    var followingLoadingLimit = 2;

    function loadFOLLOWERS() { 

                
        var windowHrefUserID = window.location.href.split('/')[4];

        $.ajax({
            type: "GET",
            url: "/loadAccountFollowers/"+FOLLOWERSLoadingOffsetCount+"/"+FOLLOWERSLoadingLimit+"/"+windowHrefUserID,
            contentType: false,
            cache: false,
            processData: false,

            success: function (response) {

                if (response.processedDataLength > 0) {
                    $('main.main-vAccount .follow-info-div .finfo-cover .tab-contents .follower-div').append(response.processedDataString);
                }
                else {
                    console.log( "no followers left !!!" );
                }

            }
        });
        
        FOLLOWERSLoadingOffsetCount += FOLLOWERSLoadingLimit;
    }
    function loadFOLLOWING() { 


        var windowHrefUserID = window.location.href.split('/')[4];

        $.ajax({
            type: "GET",
            url: "/loadAccountFollowing/"+followingLoadingOffsetCount+"/"+followingLoadingLimit+"/"+windowHrefUserID,
            contentType: false,
            cache: false,
            processData: false,

            success: function (response) {

                if (response.processedDataLength > 0) {
                    $('main.main-vAccount .follow-info-div .finfo-cover .tab-contents .following-div').append(response.processedDataString);
                }
                else {
                    console.log( "no following users left !!!" );
                }

            }
        });
        
        followingLoadingOffsetCount += followingLoadingLimit;
    }





    function follow_h() {
        $(account_info_container).toggleClass("account-info-container-close");
        $(follow_info_div).toggleClass("follow-info-div-open");


        if ( $(follow_info_div).hasClass("follow-info-div-open") == true ) {
            tabContentsClone.each( function (indexInArray, valueOfElement) { 
                $(valueOfElement).appendTo( $(".main-vAccount .follow-info-div .finfo-cover .tab-contents") );                 
            });





            var FOLLOWERSLoadingBtn = $("main.main-vAccount .follow-info-div .finfo-cover .tab-contents .follower-div button.loading-btn");

            if ($(".main-vAccount .follow-info-div .finfo-cover .tab-contents .follower-div > a").length == 0) {
                loadFOLLOWERS();
            }

            $(FOLLOWERSLoadingBtn).bind( 'click', function (e) {
                loadFOLLOWERS();
            });
            





















        
        
        
        
        
        
        
        
        
           
        




        
        
            

            var followingLoadingBtn = $("main.main-vAccount .follow-info-div .finfo-cover .tab-contents .following-div button.loading-btn");


            if ($(".main-vAccount .follow-info-div .finfo-cover .tab-contents .following-div > a").length == 0) {
                loadFOLLOWING();
            }

            $(followingLoadingBtn).bind( 'click', function (e) {
                loadFOLLOWING();
            });
























            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        else {
            tabContents = $(".main-vAccount .follow-info-div .finfo-cover .tab-contents > *");
            tabContentsClone = $(tabContents).clone(true);
            $(tabContents).remove();
        }
    }




    following_h.bind( 'click', function (e) {
        follow_h();
    });

    followers_h.bind( 'click', function (e) {
        follow_h(); 
    });

    goBackBtn.bind( 'click', function (e) {
        follow_h(); 
    });














































    tabBarElem.each( function (indexInArray, valueOfElement) { 
        
        $(valueOfElement).bind( 'click' , function (e) {

            currentActiveTab = $(".main-vAccount .follow-info-div .finfo-cover .tab-bar-cover .tab-bar tr td .active-fTabs");
            $(currentActiveTab).toggleClass('active-fTabs');
            currentActiveTabID  = currentActiveTab.attr('id');
            activeContent       = $(".main-vAccount .follow-info-div .finfo-cover .tab-contents #"+currentActiveTabID);
            activeContent.css('display', 'none');


            $(valueOfElement).toggleClass('active-fTabs');
            activeContent       = $(".main-vAccount .follow-info-div .finfo-cover .tab-contents #"+$(valueOfElement).attr('id'));
            activeContent.css('display', 'grid');

        });

    });






















    
    var myBlogsLoadingBtn = $("main.main-vAccount .account-info-container .gallery-heading-cont .account-blog-gallery button.loading-btn");
    var myBlogsLoadingOffset = 0;
    var myBlogsLoadingLimit = 5;


    function myBlogsHashtags() {

        var windowHref = window.location.href.split('/');
        
        $.ajax({
            type: "GET",
            url: "/accountblogs/"+myBlogsLoadingOffset+"/"+myBlogsLoadingLimit+"/"+windowHref[windowHref.length-1],
            contentType: false,
            cache: false,
            processData: false,


            success: function (response) {

                if (response.processedDataLength > 0) {
                    $("main.main-vAccount .account-info-container .gallery-heading-cont .account-blog-gallery").append(response.processedDataString);
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







































    var followBtn = $('main.main-vAccount .account-info-container .uNePi-container .follow-info-container .follow-btn');


    $(followBtn).bind( 'click', function (e) {
        

        var windowHreUserID = window.location.href.split('/')[4];




        $.ajax({
            type: "PUT",
            url: "/addFollow/"+windowHreUserID,
            success: function (response) {
                
                $('main.main-vAccount .account-info-container .uNePi-container .follow-info-container').toggleClass("following");

            }
        });

    });






    
    var muteBtn = $('main.main-vAccount .account-info-container .uNePi-container .follow-info-container button.mute-btn');

    if ($(muteBtn).hasClass("muted") == true) {
        $(muteBtn).html("<i class='fas fa-comment'></i>Unmute");
    }
    else {
        $(muteBtn).html("<i class='fas fa-comment-slash'></i>Mute");
    }
    



    $(muteBtn).bind( 'click', function (e) {
        var windowHreUserID = window.location.href.split('/')[4];




        $.ajax({
            type: "PUT",
            url: "/mute/"+windowHreUserID,
            success: function (response) {
                $(muteBtn).toggleClass("muted");

                if ($(muteBtn).hasClass("muted") == true) {
                    $(muteBtn).html("<i class='fas fa-comment'></i>Unmute");
                }
                else {
                    $(muteBtn).html("<i class='fas fa-comment-slash'></i>Mute");
                }
            }
        });

    });
















     
    var blockBtn    = $('main.main-vAccount .account-info-container .uNePi-container .follow-info-container button.Block-btn');
    var UnblockBtn  = $('main.main-vAccount .account-info-container .uNePi-container .follow-info-container button.Unblock-btn');


    $(blockBtn).bind( 'click', function (e) {
        var windowHreUserID = window.location.href.split('/')[4];

        $.ajax({
            type: "PUT",
            url: "/block/"+windowHreUserID,
            success: function (response) {
                window.location.reload();
            }
        });

    });


    $(UnblockBtn).bind( 'click', function (e) {
        var windowHreUserID = window.location.href.split('/')[4];

        $.ajax({
            type: "PUT",
            url: "/block/"+windowHreUserID,
            success: function (response) {
                window.location.reload();
            }
        });

    });






    














































    











}





export {onLoad};