var app = {
    init : function(config) {
        this.pageConfig();
        this.initFeedbacksSlider();
        this.togglePopUpWin();
        this.showScrollButton();
        this.scrollTop();
        this.timerCountdown();
        this.checkCopyDate();
        this.checkVisibility();
        this.checkJS();
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
    timerCountdown : function() {
        var stock = 2;
        var quantityBlock = $('.qty');
        var blueWatch = quantityBlock.find('.blue');
        var blackWatch = quantityBlock.find('.black');

        $.getJSON('/pageConfig.json', function(data){
            var schedule = data.schedule;
            console.log(schedule);
            for(var i=0; i<schedule.length; i++){
                var promoStart = new Date(schedule[i].promoStart);
                var promoEnd = new Date(schedule[i].promoEnd);
                var currentDate = new Date();

                if(promoEnd > currentDate && currentDate >= promoStart ){
                    $('#timer').countdown({
                        timestamp: promoEnd
                    });
                    blueWatch.html(Math.ceil(stock*1.3*(promoEnd.getDate() + 1 - currentDate.getDate())));
                    blackWatch.html(Math.ceil(stock*(promoEnd.getDate() + 1 - currentDate.getDate())));
                }
            }
        });
    },
    checkJS : function() {
        $('.page').removeClass('noJS');
    },
    checkCopyDate : function() {
        var initialYear = 2015;
        var copyTitle = document.title;
        var currentYear = new Date().getFullYear();
        if (currentYear > initialYear ) {
            $('.copy').find('h6').html("&copy;&nbsp;" + initialYear + " - " + currentYear + "&nbsp;" + copyTitle);
        } else {
            $('.copy').find('h6').html("&copy;&nbsp;" + initialYear + "&nbsp;" + copyTitle);
        }
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


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.now();
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var days = clock.querySelector('.days');
  var hours = clock.querySelector('.hours');
  var minutes = clock.querySelector('.minutes');
  var seconds = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    days.innerHTML = ('0' + t.days).slice(-2);
    hours.innerHTML = ('0' + t.hours).slice(-2);
    minutes.innerHTML = ('0' + t.minutes).slice(-2);
    seconds.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date('2015-12-31');
//initializeClock('timer', deadline);