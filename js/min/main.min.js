var app = {
    init : function(config) {
        var promoDuration = 10;
        this.pageConfig();
        this.initFeedbacksSlider();
        this.togglePopUpWin();
        this.showScrollButton();
        this.scrollTop();
        this.timerCountdown(promoDuration);
        this.checkCopyDate();
        this.updateQuantity(promoDuration);
        this.checkVisibility();
    },
    checkJS : function() {
        $('body').removeClass('noJS');
    },
    pageConfig : function() {
        $.getJSON('/pageConfig.json', function(e){
            var currency = e.price.currency;
            var regularPrice = e.price.price + currency;
            var specialPrice = e.price.specialPrice + currency;
            var brandName = e.brand.name;
            var brandSlogan = e.brand.slogan;

            $('.price').each(function(){
                $(this).find('s').html(regularPrice);
                $(this).find('b').html(specialPrice);
            });
            $('.slogan').html(brandSlogan);
            $('.brandName').html(brandName);
        });
    },
    initFeedbacksSlider : function() {
        feedbacksSlider = jQuery('.feedbacksSlider');
        if (feedbacksSlider.length){
            feedbacksSlider.owlCarousel({
                singleItem: true,
                itemsCustom: false,
                slideSpeed: 500,
                transitionStyle: 'backSlide',
                mouseDrag: false,
                autoHeight: true,
                lazyLoad : true
            });
        }
    },
    togglePopUpWin : function() {
        var popUpWin = $('.popUpWin');
        var popUpWinTrigger = $('.winTrigger');

        popUpWinTrigger.click(function(){
            popUpWin.toggleClass('active');
        });

        $(document).keydown(function(e){
            if (e.keyCode == 27){
                popUpWin.removeClass('active');
            }
        });
    },
    validateForm : function(form) {
        var nameField = form.find($('input[name="name"]'));
        var phoneField= form.find($('input[name="phone"]'));
        var nameValid = nameField.val().match(/[А-я]{2,32}/);
        var phoneValid = phoneField.val().match(/^80\d{9}$/);
        var nameMessageActive = nameField.next('label').hasClass('active');
        var phoneMessageActive = phoneField.next('label').hasClass('active');

        if (!nameValid) {
            if (nameMessageActive) {
                return false;
            } else {
                app.showMessageBlock(nameField, '#nameValidationFailed');
            }
        }
        else if (!phoneValid) {
            if (phoneMessageActive) {
                return false;
            } else {
                app.showMessageBlock(phoneField, '#phoneValidationFailed');
            }
        }
        else if (nameValid && phoneValid) {
            app.formRequest(form);
            nameField.val('');
            phoneField.val('');
        }
    },
    formRequest : function(form) {
        var url = "/forms.php";

        form.addClass('loading');

        $.ajax({
            type: 'POST',
            url: url,
            data: form.serialize(),
            success: function(data) {
                form.removeClass('loading');
                app.showMessageBlock(form, '#successMessage');
            },
            error: function(xhr, status, error) {
                form.removeClass('loading');
                app.showMessageBlock(form, '#errorMessage');
            }
        });
    },
    showMessageBlock : function(element, blockId) {
        element.after($(blockId));
        $(blockId).addClass('active');
    },
    hideMessageBlock : function(blockId) {
        $(blockId).removeClass('active');
    },
    scrollTop : function() {
        $('.scrollTop').click(function(){
            $('html, body').animate({scrollTop: 0}, 600);
        });
    },
    showScrollButton : function() {
        var windowHeight = window.innerHeight;
        var topOffset = window.pageYOffset;
        var scrollButton = $('.scrollTop');

        if (topOffset > windowHeight) {
            scrollButton.addClass('active');
        } else {
            scrollButton.removeClass('active');
        }
    },
    timerCountdown : function(promoDuration) {
        var eventDate = new Date().getTime() + promoDuration*24*60*60*1000;
        $('#timer').countdown({
            timestamp: eventDate
        });
    },
    checkCopyDate : function() {
        var initialYear = 2015;
        var currentYear = new Date().getFullYear();
        if (currentYear > initialYear ) {
            $('.copy').find('h6').html('&copy; ' + initialYear + " - "+ currentYear);
        }
    },
    updateQuantity : function(promoDuration) {
        var stock = 2;
        var promoTime = promoDuration;

        var currentDay = new Date().getDate();
        var promoStart = new Date('2015-12-21');
        var currentDate = new Date(new Date().toJSON().slice(0,10));
        var promoEnd = new Date(new Date().setDate(promoStart.getDate() + promoTime));

        var quantityBlock = $('.qty');
        var blueWatch = quantityBlock.find('.blue');
        var blackWatch = quantityBlock.find('.black');
        var blueWatchQty = blueWatch.html(Math.ceil(stock*1.3*(promoEnd.getDate() - currentDay)));
        var blackWatchQty = blackWatch.html(Math.ceil(stock*(promoEnd.getDate() - currentDay)));
    },
    checkVisibility : function() {
        $('.scroll-visible:in-viewport').addClass('active');
    }
}
jQuery(function($){
    app.init();

    $('input[type="submit"]').click(function(e){
        var form = $(this).closest('form');

        app.validateForm(form);
        e.preventDefault();
    });

    $(window).scroll(function(){
        app.showScrollButton();
        app.checkVisibility();
    });
});