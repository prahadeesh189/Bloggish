function onLoad() {

    // if (window.performance.navigation.type == 2) {
    //     window.location.reload();
    // }

    var [entry] = window.performance.getEntriesByType('navigation');
    
    entry.toJSON();

    // console.log( entry['type'] );
   
    if (entry['type'] == 'back_forward') {
        window.location.reload();
    }























    var bodyId = $('body').attr("id");

    $('.nav .menu .menu-list .menu-list-item-links a#'+ bodyId).toggleClass('active-link');







    var drp_dwn = $('.nav .menu .menu-list .menu-list-item-img-drp-dwn .img-drp-dwn-list [class^="img-drp-dwn-list-item"] .drp-dwn');
        
    $('.nav .menu .menu-list .menu-list-item-img-drp-dwn .img-drp-dwn-list [class^="img-drp-dwn-list-item"] img.profile-img').bind( 'click' , function (e) {
        $(drp_dwn).toggleClass('drp-dwn-close');
    });


    var flag = 0; 
    $(document).bind( 'click' , function (e) {
        var target = $(e.target);

        if ($(drp_dwn).hasClass( 'drp-dwn-close' ) == false) {


            if (    ( (target.parents('.drp-dwn').length > 0)  ||  (target.hasClass('drp-dwn')) ) == false      ) {
                if (flag > 0) {
                    $(drp_dwn).toggleClass( 'drp-dwn-close' );
                    flag = 0;
                }
                else {
                    flag++;
                }
            }


        }
        else {
            if (flag > 0)
                flag = 0;
        }

    });
  














    $('.nav .burger').bind( 'click', () => {
        
        $('.nav .menu_bg_shadow').toggleClass('menu_bg_shadow-close');
        $('.nav .menu').toggleClass('menu-close');
        $('.nav .burger').toggleClass('burger-close');
    });    


            













    $.ajax( '/navinfo', 
    {
        type: "GET",
        contentType: false,
        cache: false,
        processData: false,


        success: function (res, status, xhr) {
            var navProfilePic = $('.nav .menu .menu-list .menu-list-item-img-drp-dwn .img-drp-dwn-list [class^="img-drp-dwn-list-item"] img.profile-img');
            $(navProfilePic).attr("src", res.ProfilePicBase64String);

            var navUserName = $("nav.nav .menu ul.menu-list li.menu-list-item-img-drp-dwn ul.img-drp-dwn-list li.img-drp-dwn-list-item-2 .drp-dwn h3");
            $(navUserName).html(res.userName);  
        },


        
    });









    // var logoutBtn = $('.nav .menu ul.menu-list li.menu-list-item-img-drp-dwn ul.img-drp-dwn-list li.img-drp-dwn-list-item-2 .drp-dwn .logot-btn-container button.logout-btn');


    // $(logoutBtn).bind( 'click', function (e) {
        
    // });







}

















export {onLoad};