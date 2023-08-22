var PROFILE = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        //
        // AJAX form.
        //
        $('#wf-form-Profile-Form')
        .on('click', '.form-submit', function(e) {
            $(e.target).addClass('clicked');
        })
        .on('submit', function(e) {
            e.preventDefault();

            var form = $(this),
                button = form.find('.form-submit.clicked'),
                data = HELP.getFormValues(form, 'formData');

            MAIN.buttonThinking(button);

            HELP.sendAJAX({
                url: form.attr('action'),
                method: form.attr('method'),
                data: data,
                processData: false,
                contentType: false,
                cache: false,
                timeout: 120000,
                callbackSuccess: function(data, textStatus) {
                    MAIN.handleAjaxResponse(data, form);
                }
            }, form);
        });


        //
        // Update profile form in Colorbox.
        //
        $('.trigger-profile').on('click', function(e, onComplete) {
            e.preventDefault();

            HELP.waitFor(window.jQuery, 'litbox', 100, function() {
                // Litbox.
                $.litbox({
                    title: 'Profile',
                    href: '#profile',
                    inline: true,
                    returnFocus: false,
                    trapFocus: false,
                    overlayClose: false,
                    escKey: false,
                        css: {
                            xxs: {
                            offset: 20,
                            maxWidth: 900,
                            width: '100%',
                            opacity: 0.4
                        },
                        sm: {
                            offset: '5% 20px'
                        }
                    }
                });
            });
        });
    });

    return pub;
}(jQuery, this, this.document));

