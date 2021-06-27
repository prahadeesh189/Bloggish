


function onLoad() {

    var thumbImgPreview     = $('.main-edit .write-container .element-container .components-container form .thumbnail-container .thumbImg-preview');
    var inputThumbnail      = $('.main-edit .write-container .element-container .components-container form .thumbnail-container .input-thumbnail');
    var discardBtn          = $('.main-edit .write-container .element-container .components-container form .btn-grid #discardChanges-btn'); 
    var deleteBtn           = $('.main-edit .write-container .element-container .components-container form .btn-grid #delete-btn'); 
    var inputBlogTitle      = $('.main-edit .write-container .element-container .components-container form .blogTitle-container  .input-blogTitle');
    var inputThumbnail      = $('.main-edit .write-container .element-container .components-container form .thumbnail-container  .input-thumbnail');
    // var thumbImgPreview     = $('.main-edit .write-container .element-container .components-container form .thumbnail-container  .thumbImg-preview  ');
    // var thumbImgPreview     = $('.main-edit .write-container .element-container .components-container form .hashtag-container .hashtag  ');
    var saveChangesBtn      = $('.main-edit .write-container .element-container .components-container form .btn-grid #saveChanges-btn'); 

    var textareaContent = $('.main-edit .write-container .element-container .components-container form .content-container .content');
    // var lastTextAreaValLen = 0;
    // var highestScrollHeight = 0;


    
    textareaContent.css("height" , textareaContent[0].scrollHeight );

    textareaContent.bind( 'input' , () => {

        
        // var lenInc = (textareaContent.val().length - lastTextAreaValLen );
        // lastTextAreaValLen =  textareaContent.val().length;

        textareaContent.css("height" , textareaContent[0].scrollHeight );


        // if ( lenInc < 0 ) {
        //     console.log( textareaContent[0].scrollHeight, textareaContent.css("height") );

        //     if ( textareaContent[0].scrollHeight < highestScrollHeight ) {
        //         highestScrollHeight = textareaContent[0].scrollHeight - 35;
        //         textareaContent.css("height" , highestScrollHeight );
        //     }
        // }
        // else {
        //     highestScrollHeight = textareaContent[0].scrollHeight ;
            
        // }


        if ( textareaContent.val() == '' )
            textareaContent.css("height", textareaContent.css("min-height") );





        // console.log( textareaContent[0].scrollHeight / 35  );
    });



    




    thumbImgPreview.css('display', 'block' );  
    $(thumbImgPreview).animate( {height: thumbImgPreview.css('max-height')} );
    

    inputThumbnail.bind( 'change' , function (e) {

        // console.log(inputThumbnail);

        var uploadedImgUrl = URL.createObjectURL(e.target.files[0]);

        thumbImgPreview.attr('src', uploadedImgUrl );
        thumbImgPreview.css('display', 'block' );
        // thumbImgPreview.css('height' , thumbImgPreview.css('max-height') );        

        $(thumbImgPreview).animate( {height: thumbImgPreview.css('max-height')} );
    });
    

    // discardBtn.bind( 'click' , function (e) {
    //     inputBlogTitle.val('');
    //     inputThumbnail.val('');
    //     thumbImgPreview.val('');
    //     thumbImgPreview.css('display', 'none' );
    //     thumbImgPreview.css('height', 0 );
    //     thumbImgPreview.attr('src', '');
    //     textareaContent.val('');
    //     thumbImgPreview.val('');
    // });








    $(saveChangesBtn).bind( "click", function (e) {
        
        var formData = new FormData( $('main.main-edit .write-container .element-container .components-container form')[0] );

        $.ajax({
            type: "POST",
            url: "/updateblog",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,


            success: function (response) {

                if (response.ok == 1) {
                    window.location.href = "/view/"+response.blogID;
                }
                else {
                    window.history.back();
                }

            }
        });



    });



    var thisBlogTitle =  $("main.main-edit .write-container .element-container .components-container form .blogTitle-container input.input-blogTitle").attr('value');

    $(deleteBtn).bind( 'click' , function (e) {

        var windowHref = window.location.href;

        $.ajax({
            type: "GET",
            url: "/deletePost/"+windowHref.split('/')[4],

            success: function (response) {
                // console.log( response );


                if (response.deleted == true) {
                    window.alert( "'"+thisBlogTitle+"' Deleted SuccessFully" );
                    window.history.go(-2) ;
                }
                else {
                    window.alert( "'"+thisBlogTitle+"' is Not Deleted" );
                    window.history.back();
                }

            }
        });



    });

    

    $(discardBtn).bind( 'click' , function (e) {
        
        $('main.main-write .write-container .element-container .components-container form')[0].reset();
        thumbImgPreview.val('');
        thumbImgPreview.css('display', 'none' );
        thumbImgPreview.css('height', 0 );
        thumbImgPreview.attr('src', '');

        
        window.history.back();
    });






}




export {onLoad};