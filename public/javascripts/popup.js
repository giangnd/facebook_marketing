fbm_rendered = false;
random_user_ref = uuidv4();
messenger_app_id = '283604478840722';
messenger_page_id = '178407809574589';

window.fbAsyncInit = function () {
    FB.init({
        appId: messenger_app_id,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
    });

    FB.Event.subscribe('messenger_checkbox', function (e) {
        console.log("messenger_checkbox event");
        console.log(e);

        if (e.event == 'rendered') {
            console.log("Plugin was rendered");
            fbm_rendered = true;
            fbmDiscountMenu();
        } else if (e.event == 'checkbox') {
            console.log("Checkbox state: " + e.state);
        } else if (e.event == 'not_you') {
            console.log("User clicked 'not you'");
        } else if (e.event == 'hidden') {
            console.log("Plugin was hidden");
        }
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function fbmSubmitButton() {
    FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
        'app_id': messenger_app_id,
        'page_id': messenger_page_id,
        'user_ref': random_user_ref
    });

    $(".fbm_submit_button span").text("Please Wait...");

    setTimeout(function () {
        fbmSendingDiscount();
    }, 300);
}

function fbmSendingDiscount() {
    var success_message = "Your discount code has been sent to your FB messenger! Get it and enjoy saving shopping now!";
    $.ajax({
        url: "https://re-cart.herokuapp.com/discount",
        type: "POST",
        data: {
            user_ref: random_user_ref
        },
        cache: false,
        success: function (result) {
            console.log(result);
            $('.hide_on_submit').hide();
            $('.klaviyo_modal_content').css('padding-top', '200px');
            $('.klaviyo_modal_content .p1').addClass('kla_no_margin_bottom');
            $('.success_message').html(success_message).append('<button type="button" class="klaviyo_submit_button kla_small_button" onclick="fbmClosePopup()"><span>OK</span></button>');

            removeMenuDiscount();
            fbmPopupExpireTime(525600);
            setTimeout(function () {
                fbmClosePopup();
            }, 6000);
        },
        error: function (xhr, error) {
            $(".fbm_submit_button span").text("Could not send. Try again");
        }
    });
}

if (!$.cookie("fbmClosedPopup")) {
    setTimeout(function () {
        fbmShowPopup();
    }, 30000);
}

$(document).ready(function () {
    $('.klaviyo_modal .klaviyo_header_close, .klaviyo_modal .no_thanks').click(function () {
        fbmClosePopup();

        //cookie for closed
        var date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        date.setHours(0)
        date.setMinutes(0);
        date.setSeconds(0);
        $.cookie("fbmClosedPopup", 1, { path: '/', expires: date });
        return false;
    });

    if (!$.cookie("fbmUserSubscribed")) {
        $('.fbm_checkbox_content').html('<div class="fb-messenger-checkbox" origin="{{ shop.secure_url }}" page_id="' + messenger_page_id + '" messenger_app_id="' + messenger_app_id + '" user_ref="' + random_user_ref + '" prechecked="true" allow_login="true" size="small" skin="dark" center_align="true"></div>');
        fbmDiscountMenu();
    }
});

function fbmDiscountMenu() {
    if (fbm_rendered) {
        $('.apollo-megamenu ul.nav').append('<li><a class="fbm_discount_button" href="#" onclick="fbmShowPopup()"><span class="menu-title">Get 10% discount NOW!</span></a></li>');
    }
}

function fbmShowPopup() {
    if (fbm_rendered) {
        $("#k_id_modal").fadeIn(500);
        return false;
    }
}

function fbmClosePopup() {
    $("#k_id_modal").hide();
}

function removeMenuDiscount() {
    $('.apollo-megamenu li a.fbm_discount_button').remove();
}

function fbmPopupExpireTime(minutes) {
    //cookie for subscribed
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie("fbmClosedPopup", 1, { path: '/', expires: date });
    $.cookie("fbmUserSubscribed", 1, { path: '/', expires: date });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
