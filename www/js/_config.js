//////////////////////////
//
// Config
// Set your app id here.
//
//////////////////////////

if (window.location.host == 'facebookmobileweb.com' || window.location.host == 'www.facebookmobileweb.com') {
    var gAppID = '147366981996453';
}
//Add your Application ID here
else {
    var gAppID = '269377779842002';
}

if (gAppID == '1496568253892641') {
    alert('You need to enter your App ID in js/_config.js on line 13.');
}

//Initialize the Facebook SDK
//See https://developers.facebook.com/docs/reference/javascript/
window.fbAsyncInit = function() {
    FB.init({
        appId: gAppID,
        status: true,
        cookie: true,
        xfbml: true,
        frictionlessRequests: true,
        useCachedDialogs: true,
        oauth: true
    });

    FB.getLoginStatus(handleStatusChange);

    authUser();
    checkForCredits();
    updateAuthElements();
};


// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/zh_TW/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));