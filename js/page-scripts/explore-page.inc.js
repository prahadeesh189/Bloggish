function onLoad() {

    var extndDwnBtn = $('.sidebar-explore .activit-extDdwn button.extend-dwn');
    var optsBtnContainer = $('.sidebar-explore .opts-btn-container');
    var opts_cont_div = $('.main-explore .opts-cont-div');


    extndDwnBtn.bind( 'click ', function (e) {
        extndDwnBtn.toggleClass( 'extend-dwn-close' );
        optsBtnContainer.toggleClass( 'opts-btn-container-close' );
        
        if ( optsBtnContainer.hasClass( 'opts-btn-container-close' ) )
            opts_cont_div.css('height', 0 );
        else 
            opts_cont_div.css('height', parseInt(optsBtnContainer.css('height').split("px")[0])  );
        
    });













    var opts_array = $('.sidebar-explore .opts-btn-container [class^=activity-opts]');
    opts_array.each( (indexInArray, valueOfElement) => { 

        if ( $(valueOfElement).attr('isActive') == 'true' ) {
            $('.main-explore #'+$(valueOfElement).attr('id')).css('display', 'grid');
        }




        $(valueOfElement).bind( 'click' , function (e) {
            // opts_array.each( function (index, element) { 
            //     $(element).removeClass( 'active-opt' );
            // });

            // $(valueOfElement).addClass( 'active-opt' );

            var currentActiveOpt = $('.sidebar-explore .opts-btn-container .active-opt');
            $(currentActiveOpt).removeClass( 'active-opt' );
            if ( $(currentActiveOpt).attr('isActive') == 'true' ) {
                $('.main-explore #'+$(currentActiveOpt).attr('id')).css('display', 'none');
            }
            $(currentActiveOpt).attr('isActive', 'false' );
             
            $("html, body").animate({ scrollTop: 0 }, "slow");



            
            $(valueOfElement).addClass( 'active-opt' );
            $(valueOfElement).attr('isActive', 'true' );

            if ( $(valueOfElement).attr('isActive') == 'true' ) {
                $('.main-explore #'+$(valueOfElement).attr('id')).css('display', 'grid');
            }
    
        });






    });



























    





    


    var trndBlogsLoadingBtn = $("main.main-explore .trend-blogs .blog-gallery button.loading-btn");
    var trndBlogsLoadingOffset = 0;
    var trndBlogsLoadingLimit = 10;


    function loadtrndBlogs() {

        $.ajax({
            type: "GET",
            url: "/trendblogs/"+trndBlogsLoadingOffset+"/"+trndBlogsLoadingLimit,


            success: function (response) {

                
                if (response.processedDataLength > 0) {
                    $("main.main-explore .trend-blogs .blog-gallery").append(response.processedDataString);
                }
                else {
                    console.log("no hashtags left !!!");
                }
                

            },
            error: function (error) {
                console.log(error);
            }
        });


        trndBlogsLoadingOffset += trndBlogsLoadingLimit;
    }




    loadtrndBlogs();
    // loadtrndBlogs();
    $(trndBlogsLoadingBtn).bind( 'click', function (e) {
        loadtrndBlogs();
    }); 




































    var topicLoadingBtn = $("main.main-explore .topic .topic-div button.loading-btn");
    var topicLoadingOffset = 0;
    var topicLoadingLimit = 10;


    function loadTopicHashtags() {

        $.ajax({
            type: "GET",
            url: "/loadTopicHashtags/"+topicLoadingOffset+"/"+topicLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,


            success: function (response) {

                if (response.processedDataLength > 0) {
                    $("main.main-explore .topic .topic-div").append(response.processedDataStr);
                }
                else {
                    console.log("no hashtags left !!!");
                }
                

            }
        });


        topicLoadingOffset += topicLoadingLimit;
    }




    loadTopicHashtags();
    $(topicLoadingBtn).bind( 'click', function (e) {
        loadTopicHashtags();
    }); 











































    



    var authorLoadingBtn = $("main.main-explore .author .author-div button.loading-btn");
    var authorLoadingOffset = 0;
    var authorLoadingLimit = 10;


    function loadauthorHashtags() {

        $.ajax({
            type: "GET",
            url: "/loadAuthor/"+authorLoadingOffset+"/"+authorLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,


            success: function (response) {

                if (response.processedDataLength > 0) {
                    $("main.main-explore .author .author-div").append(response.processedDataStr);
                }
                else {
                    console.log("no hashtags left !!!");
                }
                

            }
        });


        authorLoadingOffset += authorLoadingLimit;
    }




    loadauthorHashtags();
    $(authorLoadingBtn).bind( 'click', function (e) {
        loadauthorHashtags();
    }); 










































}












export {onLoad};