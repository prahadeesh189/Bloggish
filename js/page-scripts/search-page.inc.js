function onLoad() {

    var searchInput = $('.main-search .search-page-container  .search-section .searcbar-sugg-container .searchbar-container .search-input');
    var suggList = $('.main-search .search-page-container  .search-section .searcbar-sugg-container .suggestions .sugg-list');
    var suggestions = $('.main-search .search-page-container  .search-section .searcbar-sugg-container .suggestions');
    var suggListItems = $('.main-search .search-page-container  .search-section .searcbar-sugg-container .suggestions .sugg-list .sugg-list-items');
    
    suggestions.css('display', 'none');
    suggList.css('display', 'none' );



    searchInput.bind( 'focus' , function (e) {
        if ( searchInput.val() != '' ){
            suggestions.css('display', 'flex');
            suggList.css('display', 'block' );
        }
    });

    searchInput.bind( 'focusout' , function (e) {
        suggList.css('display', 'none' );
        suggestions.css('display', 'none');
    });

    searchInput.bind( 'input' , function (e) {

        // $.each(suggListItems, function (indexInArray, valueOfElement) { 
        //     $(valueOfElement).html( searchInput.val() );
        // });

        

        // console.log( searchInput.val().length );

        // for (var i=0; i<searchInput.val().length; i++) {
            // $(valueOfElement).html( searchInput.val() );
        // }


        var sugg_list = $("main.main-search .search-page-container section.search-section .searcbar-sugg-container .suggestions ul.sugg-list");


        if ($(sugg_list).children().length < 10) {
            $(sugg_list).append( '<li class="sugg-list-items">'+ searchInput.val() +'</li>' );
        }
        else {
            for (var i=0; i<10; i++) {
                $($(sugg_list).children()[i]).html( searchInput.val() );
            }
        }




        if (searchInput.val() == '') {
            suggList.css('display', 'none' );
            suggestions.css('display', 'none');
        }
        else {
            suggList.css('display', 'block' );
            suggestions.css('display', 'flex');
        }

    });

































    var currentActiveTab = $('main.main-search .search-page-container section.search-result .tab-container .active-tab');
    var currentActiveTabID = $(currentActiveTab).attr("id");
    var currentActiveTabContent = $("main.main-search .search-page-container section.search-result .tab-content #" + currentActiveTabID);
    $(currentActiveTabContent).css('display', 'grid');
        

    var tabContainer = $('main.main-search .search-page-container section.search-result .tab-container > button');


    $(tabContainer).each( function (indexInArray, tab) { 
        
        $(tab).bind( 'click', function (e) {
            
            var currentActiveTab = $('main.main-search .search-page-container section.search-result .tab-container .active-tab');

            var currentActiveTabID = $(currentActiveTab).attr("id");
            var currentActiveTabContent = $("main.main-search .search-page-container section.search-result .tab-content #" + currentActiveTabID);
            $(currentActiveTabContent).css('display', 'none');




            $(currentActiveTab).removeClass('active-tab');
            $(tab).addClass('active-tab');

            var currentActiveTabID = $(tab).attr("id");
            var currentActiveTabContent = $("main.main-search .search-page-container section.search-result .tab-content #" + currentActiveTabID);
            $(currentActiveTabContent).css('display', 'grid');


        });
        

    });





































































    var searchInput = $('main.main-search .search-page-container section.search-section .searcbar-sugg-container .searchbar-container input.search-input');
    var searchBtn = $('main.main-search .search-page-container section.search-section .searcbar-sugg-container .searchbar-container button.search-btn');



    $(searchBtn).bind( 'click', function (e) {
        
        // console.log( $(searchInput)[0].value );

        $.ajax({
            type: "GET",
            url: "/searchquery?q="+ $(searchInput)[0].value ,
            success: function (response) {
                
                if (response.processedData_blogs.processedDataLength > 0) {
                    $("main.main-search .search-page-container section.search-result .tab-content .result-blog-gallery").append(response.processedData_blogs.processedDataString);
                }
                else {
                    console.log("no more blogs left");
                }



                if (response.processedData_blogs.processedDataLength > 0) {
                    $("main.main-search .search-page-container section.search-result .tab-content .result-blog-gallery").append(response.processedData_blogs.processedDataString);
                }
                else {
                    console.log("no more blogs left");
                }





                if (response.processedData_hashtags.processedDataLength > 0) {
                    $("main.main-search .search-page-container section.search-result .tab-content .result-topics-gallery").append(response.processedData_hashtags.processedDataStr);
                }
                else {
                    console.log("no more hashtags left");
                }





                if (response.processedData_authors.processedDataLength > 0) {
                    $("main.main-search .search-page-container section.search-result .tab-content .result-author-gallery").append(response.processedData_authors.processedDataStr);
                }
                else {
                    console.log("no more authors left");
                }






            }
        });


    });

































}






export {onLoad};