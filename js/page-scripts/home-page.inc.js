function onLoad() {     






    var opts_array = $('.sidebar-home .opts-btn-container [class^=activity-opts]');
    opts_array.each( (indexInArray, valueOfElement) => { 
        if ($(valueOfElement).attr( 'isActive' ) == 'true') {   
            $('.main-home .display .display-h1').replaceWith( "<h1 class='display-h1' >"+ $(valueOfElement).html() +"</h1>" );
            $('.main-home div#'+$(valueOfElement).attr('id') ).css('display', 'grid');
        }



        $(valueOfElement).bind( 'click' , function (e) {
            $('.main-home .display .display-h1').replaceWith( "<h1 class='display-h1' >"+ $(valueOfElement).html() +"</h1>" );

            $("html, body").animate({ scrollTop: 0 }, "slow");

            opts_array.each( (index, element)  => { 
                $(element).removeClass( 'active-opt' );
                $(element).attr('isActive', 'false');
                $('.main-home div#'+   $(element).attr('id')    ).css('display', 'none');
            });

            $(valueOfElement).addClass( 'active-opt' );
            $(valueOfElement).attr('isActive', 'true');
            $('.main-home div#'+$(valueOfElement).attr('id') ).css('display', 'grid');
        });
    });


    $('.sidebar-home .activit-extDdwn .extend-dwn').bind( 'click', function (e) {
        $(this).toggleClass( 'extend-dwn-close' ); 
        $('.sidebar-home .opts-btn-container ').toggleClass( 'opts-btn-container-close' );


        var opts_btn_container_height = parseInt($('.sidebar-home .opts-btn-container ').css("height").split("px")[0]);
        var temp = $('.sidebar-home .opts-btn-container ').hasClass( 'opts-btn-container-close' );
        if (!temp) {
            $(".main-home .opts-btn-margin-div").css('height', opts_btn_container_height);
        }
        else
            $(".main-home .opts-btn-margin-div").css('height', 0);
        
    });



































    var DailyLoadingOffsetCount = 0;
    var DailyLoadingLimit = 5;
    var DailyLoadingBtn = $('main.main-home .blog-gallery-daily button.loading-btn');


    function loadDailyBlogs() { 

        $.ajax({
            type: "GET",
            url: "/dailyblogs/"+DailyLoadingOffsetCount+"/"+DailyLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,

            success: function (response) {

                if (response.processedDataLength > 0) {
                    $('main.main-home .blog-gallery-daily').append(response.processedDataString);
                }
                else {
                    console.log( "no blogs left !!!" );
                }

                
            }
        });
        
        DailyLoadingOffsetCount += DailyLoadingLimit;
    }

    loadDailyBlogs();
    $(DailyLoadingBtn).bind( 'click', function (e) {
        loadDailyBlogs();
    });
    






















































    var yourBlogLoadingOffsetCount = 0;
    var yourBlogLoadingLimit = 5;
    var yourBlogLoadingBtn = $('main.main-home .blog-gallery-your button.loading-btn');


    function loadyourBlogs() { 

        $.ajax({
            type: "GET",
            url: "/yourblogs/"+yourBlogLoadingOffsetCount+"/"+yourBlogLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,

            success: function (response) {

                if (response.processedDataLength > 0) {
                    $('main.main-home .blog-gallery-your').append(response.processedDataString);
                }
                else {
                    console.log( "no blogs left !!!" );
                }

            }
        });
        
        yourBlogLoadingOffsetCount += yourBlogLoadingLimit;
    }

    loadyourBlogs();
    $(yourBlogLoadingBtn).bind( 'click', function (e) {
        loadyourBlogs();
    });
    


















































    
    var likedBlogLoadingOffsetCount = 0;
    var likedBlogLoadingLimit = 5;
    var likedBlogLoadingBtn = $('main.main-home .blog-gallery-liked button.loading-btn');


    function loadlikedBlogs() { 

        $.ajax({
            type: "GET",
            url: "/likedblogs/"+likedBlogLoadingOffsetCount+"/"+likedBlogLoadingLimit,
            contentType: false,
            cache: false,
            processData: false,

            success: function (response) {

                if (response.processedDataLength > 0) {
                    $('main.main-home .blog-gallery-liked').append(response.processedDataString);
                }
                else {
                    console.log( "no blogs left !!!" );
                }

            }
        });
        
        likedBlogLoadingOffsetCount += likedBlogLoadingLimit;
    }

    loadlikedBlogs();
    $(likedBlogLoadingBtn).bind( 'click', function (e) {
        loadlikedBlogs();
    });
    




}

























export {onLoad};