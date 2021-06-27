function onLoad() {

    var thumbImgPreview     = $('.main-write .write-container .element-container .components-container form .thumbnail-container .thumbImg-preview');
    var inputThumbnail      = $('.main-write .write-container .element-container .components-container form .thumbnail-container .input-thumbnail');
    var discardBtn          = $('.main-write .write-container .element-container .components-container form .btn-grid #discard-btn'); 
    var deleteBtn           = $('.main-write .write-container .element-container .components-container form .btn-grid #delete-btn'); 
    var inputBlogTitle      = $('.main-write .write-container .element-container .components-container form .blogTitle-container  .input-blogTitle');
    var inputThumbnail      = $('.main-write .write-container .element-container .components-container form .thumbnail-container  .input-thumbnail');
    // var thumbImgPreview     = $('.main-write .write-container .element-container .components-container form .thumbnail-container  .thumbImg-preview  ');
    // var thumbImgPreview     = $('.main-write .write-container .element-container .components-container form .hashtag-container .hashtag  ');
    // var saveChangesBtn


    var postSubmitBtn = $('main.main-write .write-container .element-container .components-container form .btn-grid button.submit-btn');

    $(postSubmitBtn).bind( 'click', function (e) {


        var formData = new FormData( $('main.main-write .write-container .element-container .components-container form')[0] );



        
        $.ajax({
            type: "POST",
            url: "/newpost",
            data: formData,
            contentType: false,
            processData: false,
            cache: false,

            success: function (response) {
                
                if (response.writtenSuccessfully == true) {
                    window.location.href = "/view/"+response.BlogId;
                }
                else {
                    window.location.reload();
                    console.log("Sorry try again....")
                }

            }
        });
    });
































    









    var textareaContent = $('.main-write .write-container .element-container .components-container form .content-container .content');
    // var lastTextAreaValLen = 0;
    // var highestScrollHeight = 0;

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



    






    inputThumbnail.bind( 'change' , function (e) {

        var uploadedImgUrl = URL.createObjectURL(e.target.files[0]);

        thumbImgPreview.attr('src', uploadedImgUrl );
        thumbImgPreview.css('display', 'block' );
        // thumbImgPreview.css('height' , thumbImgPreview.css('max-height') );      
        
        $(thumbImgPreview).animate( {height: thumbImgPreview.css('max-height')} );
          
    });
    
    discardBtn.bind( 'click' , function (e) {


        $('main.main-write .write-container .element-container .components-container form')[0].reset();
        thumbImgPreview.val('');
        thumbImgPreview.css('display', 'none' );
        thumbImgPreview.css('height', 0 );
        thumbImgPreview.attr('src', '');

        // inputBlogTitle.val('');
        // inputThumbnail.val('');
        // textareaContent.val('');
        // thumbImgPreview.val('');
    });








    





}




export {onLoad};