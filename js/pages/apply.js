var APPLY = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
    
        //
        // AJAX form.
        //
        $('#wf-form-Apply-Form')
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
    });

    return pub;
}(jQuery, this, this.document));

