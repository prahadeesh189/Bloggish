function onLoad() {
    


 



    var hashtagLoadingBtn = $("main.main-hashtag .hashtag-container .hashtag-blog-gallery button.loading-btn");
    var hashtagLoadingOffset = 0;
    var hashtagLoadingLimit = 5;


    function loadHashtagBlogs() {

        var windowHref = window.location.href.split('/');


        $.ajax({
            type: "GET",
            url: "/hashtag/"+hashtagLoadingOffset+"/"+hashtagLoadingLimit+"/"+windowHref[windowHref.length-1],


            success: function (response) {

                
                if (response.processedDataLength > 0) {
                    $("main.main-hashtag .hashtag-container .hashtag-blog-gallery").append(response.processedDataString);
                }
                else {
                    console.log("no hashtags left !!!");
                }
                

            },
            error: function (error) {
                console.log(error);
            }
        });


        hashtagLoadingOffset += hashtagLoadingLimit;
    }




    loadHashtagBlogs();
    $(hashtagLoadingBtn).bind( 'click', function (e) {
        loadHashtagBlogs();
    }); 







}





export {onLoad}