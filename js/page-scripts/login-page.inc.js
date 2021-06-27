function onLoad() {
    // $('.nav .burger').remove();
    // $('.nav .menu_bg_shadow').remove();
    // $('.nav .menu').remove();


    // console.log("got.............");






    var activeTabId =  $('.main-login .login-signup-form .tabs>.active-tab').attr('id');
    $('.main-login .login-signup-form .tab-content>#'+activeTabId).removeClass('form-log-sup');

    var tabsArray = $('.main-login .login-signup-form .tabs>*');
    tabsArray.each( (indexInArray, valueOfElement) => {

        $(valueOfElement).bind( 'click' , function (e) {

            tabsArray.each( (index, element) => { 
                $(element).removeClass( 'active-tab' );
            });
            var idTabContent =  $(valueOfElement).addClass( 'active-tab' ).attr('id');



            $('.main-login .login-signup-form .tab-content>*').each( (ind, elem) => {
                if (!$(elem).hasClass('form-log-sup')) {
                    $(elem).addClass( 'form-log-sup' )
                }
            });
            $('.main-login .login-signup-form .tab-content>#'+idTabContent).removeClass('form-log-sup');


        }); 

    });




































    var input_signupEmail = $(".main-login .login-signup-form .tab-content form#signUp-tab input#signupEmail");
    var input_signupPassword = $(".main-login .login-signup-form .tab-content form#signUp-tab input#signupPassword");
    var input_signupConfirmPassword = $(".main-login .login-signup-form .tab-content form#signUp-tab input#signupConfirmPassword");
 

    var button_submitBtn = $(".main-login .login-signup-form .tab-content form#signUp-tab button.submit-btn");
    var doesPasswordMatches = false;


    
    $(input_signupConfirmPassword).bind( "input", function (e) {
        var signupPasswordval = ""+$(input_signupPassword).val();
        var signupConfirmPasswordval = ""+$(this).val();


        if (  signupPasswordval == signupConfirmPasswordval ) {
            // console.log("password matches");
            doesPasswordMatches = true;
        }
        else {
            // console.log("password dont matches");
            doesPasswordMatches = false;
        }

    });



    


    $(button_submitBtn).bind( "click", function (e) {

        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var signupEmailVal = regex.test( $(input_signupEmail).val() );

        var errorsArray = {emailError: false, passwordError: false, confirmPasswordError: false, errorsCount: 0 };

        if ( signupEmailVal ==  false ) {
            // console.log("invalid Email !")
            // return signupEmailVal;
            errorsArray.emailError = true;
            errorsArray.errorsCount += 1;
        }

        var signUpPassword =  ""+$(input_signupPassword).val();
        if (signUpPassword.length < 8) {
            // console.log("invalid Password !")
            // return false;
            errorsArray.passwordError = true;
            errorsArray.errorsCount += 1;
        }

        if ( doesPasswordMatches ==  false ) {
            // console.log("password dont matches")
            // return false;
            errorsArray.confirmPasswordError = true;
            errorsArray.errorsCount += 1;
        }



        if ( errorsArray.errorsCount > 0 ) {

            if (errorsArray.emailError) {
                console.log("invalid Email !");
            }
            if (errorsArray.passwordError) {
                console.log("invalid Password !");
            }
            if (errorsArray.confirmPasswordError) {
                console.log("password dont matches");
            }


            return false;
        }



        // var signUpFormData = new FormData( $("main.main-login .login-signup-form .tab-content form.form-sup")[0] );


        // $.ajax({
        //     type: "POST",
        //     url: "/getstarted",
        //     data: signUpFormData,
        //     cache: false,
        //     contentType: false,
        //     processData: false,

        //     success: (res) => {
                
        //         // console.log(res);

        //         $("document").html(res);
            
        //         // window.location.replace('/getstarted');

        //     },
        //     error: (error) => {
        //         console.log(error);
        //     }
        // });




        return true;
    });



























    var input_loginEmail = $(".main-login .login-signup-form .tab-content form#login-tab input#login-userName");
    var input_loginPassword = $(".main-login .login-signup-form .tab-content form#login-tab input#login-password");

    var button_loginBtn = $(".main-login .login-signup-form .tab-content form#login-tab button.submit-btn");
    


    $(button_loginBtn).bind( "click", function (e) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var loginEmailVal = regex.test( $(input_loginEmail).val() );

        var errorsArrayLogin = {errorsCount: 0, loginEmailError: false, loginPasswordError: false };


        if ( loginEmailVal ==  false ) {
            // console.log("invalid Email !")
            // return loginEmailVal;
            errorsArrayLogin.loginEmailError = true;
            errorsArrayLogin.errorsCount += 1;
        }



        var loginPassword =  ""+$(input_loginPassword).val();
        if (loginPassword.length < 8) {
            // console.log("invalid Password !")
            // return false;
            errorsArrayLogin.loginPasswordError = true;
            errorsArrayLogin.errorsCount += 1;
        }


        if ( errorsArrayLogin.errorsCount > 0 ) {

            if (errorsArrayLogin.loginEmailError) {
                console.log("invalid Email !");
            }
            if (errorsArrayLogin.loginPasswordError) {
                console.log("invalid Password !");
            }



            return false
        }



        

        var fromData = new FormData( $(".main-login .login-signup-form .tab-content .form-log")[0]  );


        $.ajax( "/auth" , {
            type: "POST",
            data: fromData,
            contentType: false,
            cache: false,
            processData: false,

            success: function (res, status, xhr) {

                if (res.isAuthentified == true) {
                    // window.location.replace("/");
                    window.location.href = "/";
                }
                else {
                    console.log("invalid Email or Password !");
                }
            
            },
            error: function (jqXhr, textStatus, errorMessage) {
                console.log(errorMessage);
            },
        })



        // return false;
    });




 






















}










export{ onLoad };