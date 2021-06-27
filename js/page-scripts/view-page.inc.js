function onLoad() {

    var editbtn = $('main.main-viewpage .view-container .title-opt-container .author-opt-outer-cont .author-opt-inner-cont button.edit-btn');

    $(editbtn).bind( 'click', function (e) {

        var windowHref = window.location.href;

        window.location.href = "/edit/"+windowHref.split('/')[4];
    });




    var windowHref = window.location.href;






    var likebtn = $('main.main-viewpage .view-container .title-opt-container .author-opt-outer-cont .author-opt-inner-cont button.like-btn');

    $(likebtn).bind( 'click', function (e) {


        $.ajax({
            type: "PUT",
            url: "/likepost/"+windowHref.split('/')[4] ,
            success: function (response) {

                $(likebtn).toggleClass("liked-class");
            
            }
        });


    });


    $.ajax({
        type: "PUT",
        url: "/viewPost/"+windowHref.split('/')[4],

        success: function (response) {
            console.log( response );
        }
    });



}



export {onLoad}