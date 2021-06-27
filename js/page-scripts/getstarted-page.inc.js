function onLoad() {



    var [entry] = window.performance.getEntriesByType('navigation');
    
    entry.toJSON();

    // console.log( entry['type'] );
   
    if ((entry['type'] == 'back_forward') ) {
        window.location.reload();
    }



    



















    var img_profileImg        = $("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner .profile-img-upload-container img.profile-img");
    var input_profileImgInput = $("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner .profile-img-upload-container input.profile-img-input");



    // console.log(input_profileImgInput);


    $(input_profileImgInput).bind( "change", function (e) {
        
        var uploadedImgUrl = URL.createObjectURL(e.target.files[0]);

        // console.log( uploadedImgUrl );

        if (uploadedImgUrl.length != 0)
            img_profileImg.attr('src', uploadedImgUrl );
    });






    var submit_btn = $("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner form button.submit-btn");
    // var form_getStarted_data = $("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner form");



    // var formData = new FormData($("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner form")[0]);


    $(submit_btn).bind( "click", function (e) {



        var data = new FormData( $("main.main-getStarted .main-getStarted-container .main-getStarted-container-inner form")[0] );

        $.ajax({
            type: 'POST',
            url: "/signup",
            data: data,
            cache: false,
            contentType: false,
            processData: false,

            success: function ( res ) {
                console.log( res );

                if (res.newUserCreated == true) {
                    // window.location.replace("/");
                    window.location.href = "/";
                }
                else {
                    // window.location.replace("/login?error=422");
                    window.location.href = "/login?error=422";
                }



            },
            error: function (jqXhr, textStatus, errorMessage) {
                console.log(errorMessage);
            },
        });

    });




}










export {onLoad};