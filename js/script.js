// import { loginOnLoad       } from './page-scripts/login-page.inc.js';
// import { accountOnLoad     } from './page-scripts/account-page.inc.js';
// import { exploreOnLoad     } from './page-scripts/explore-page.inc.js';
// import { homeOnLoad        } from './page-scripts/home-page.inc.js';
// import { viewOnLoad        } from './page-scripts/view-page.inc.js';
// import { writeOnLoad       } from './page-scripts/write-page.inc.js';
// import { viewAccountOnload } from './page-scripts/viewAccount-page.inc.js';
// import { commonOnLoad      } from './page-scripts/common-page.inc.js';
// import { searchPageOnload  } from './page-scripts/search-page.inc.js';
// import { hashtagOnload     } from './page-scripts/hashtag-page.inc.js';   






var bodyId = $('body').attr("id");




// var modules = {

//     login_page : {
//         onload: loginOnLoad
//     },
//     home_page : {
//         onload: homeOnLoad
//     },
//     explore_page : {
//         onload: exploreOnLoad
//     },
//     account_page : {
//         onload: accountOnLoad
//     },
//     write_page : {
//         onload: writeOnLoad
//     },
//     view_page : {
//         onload: viewOnLoad
//     },
//     viewAccount_page : {
//         onload: viewAccountOnload
//     },
//     search_page : {
//         onload: searchPageOnload
//     },
//     hashtag_page : {
//         onload: hashtagOnload
//     },

//     common : {
//         onload: commonOnLoad
//     }


// }




$(document).ready( () => {
    
    // console.log("hehehehehehe...")



    // modules[bodyId].onload();
    // modules['common'].onload();



    // switch (bodyId) {

    //     case "login_page":
    //         import("./page-scripts/login-page.inc.js").then(
    //             (module) => {
    //                 module.loginOnLoad();
    //             }
    //         )
    //         break;
    //     case "home_page":
    //         import("./page-scripts/home-page.inc.js").then(
    //             (module) => {
    //                 module.homeOnLoad();
    //             }
    //         )
    //         break;
    //     case "explore_page":
    //         import("./page-scripts/explore-page.inc.js").then(
    //             (module) => {
    //                 module.exploreOnLoad();
    //             }
    //         )
    //         break;
    //     case "account_page":
    //         import("./page-scripts/account-page.inc.js").then(
    //             (module) => {
    //                 module.accountOnLoad();
    //             }
    //         )
    //         break;
    //     case "write_page":
    //         import("./page-scripts/write-page.inc.js").then(
    //             (module) => {
    //                 module.writeOnLoad();
    //             }
    //         )
    //         break;
    //     case "view_page":
    //         import("./page-scripts/view-page.inc.js").then(
    //             (module) => {
    //                 module.viewOnLoad();
    //             }
    //         )
    //         break;
    //     case "viewAccount_page":
    //         import("./page-scripts/viewAccount-page.inc.js").then(
    //             (module) => {
    //                 module.viewAccountOnload();
    //             }
    //         )
    //         break;
    //     case "search_page":
    //         import("./page-scripts/search-page.inc.js").then(
    //             (module) => {
    //                 module.searchPageOnload();
    //             }
    //         )
    //         break;
    //     case "hashtag_page":
    //         import("./page-scripts/hashtag-page.inc.js").then(
    //             (module) => {
    //                 module.hashtagOnload();
    //             }
    //         )
    //         break;   

    //     default:
    //         break;
    // }

    
    import("./page-scripts/common-page.inc.js").then(
        (module) => {
            module.onLoad();
        }
    )


    var fileURL =  "./page-scripts/" +  bodyId.split('_')[0] + "-" + bodyId.split('_')[1] + ".inc.js"  ;

    import( fileURL ).then(
        (module) => {
            module.onLoad();
        }
    )



});























