var app = {
    init : function(config) {
        this.initFeedbacksSlider();
        this.togglePopUpWin();
        this.showScrollButton();
        this.scrollTop();
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
                autoHeight: true
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
        var nameValid = nameField.val().match(/[А-я]{2,}/);
        var phoneValid = phoneField.val().match(/^80\d{9}$/);

        if (!nameValid) {
            app.showMessageBlock(nameField, '#nameValidationFailed');
        }
        else if (!phoneValid) {
            app.showMessageBlock(phoneField, '#phoneValidationFailed');
        }
        else if (nameValid && phoneValid) {
            app.hideMessageBlock('#nameValidationFailed');
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
    getMessageBlock : function(form, blockId) {
        form.after($(blockId));
        $(blockId).addClass('active');
        setTimeout(function(){
            $(blockId).removeClass('active');
        }, 5000);
    },
    scrollTop : function() {
        $('.scrollTop').click(function(){
            $('html, body').animate({scrollTop: 0}, 600);
        });
    },
    showScrollButton : function() {
        $(window).scroll(function(){
            var windowHeight = window.innerHeight;
            var topOffset = window.pageYOffset;
            var scrollButton = $('.scrollTop');

            if (topOffset > windowHeight) {
                scrollButton.addClass('active');
            } else {
                scrollButton.removeClass('active');
            }
        });
    }
}
jQuery(function($){
    app.init();

    $('input[type="submit"]').click(function(e){
        var form = $(this).closest('form');

        app.validateForm(form);
        e.preventDefault();
    });
});