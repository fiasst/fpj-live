var JOB = (function($, window, document, undefined) {
    var pub = {};


    // On DOM ready.
    $(function() {
        // Publish Draft/Republish existing Job.
        $('.trigger-publish').on('click', function(e) {
            e.preventDefault();
            var $link = $(this),
                msg = HELP.sanitizeHTML(link.attr('data-confirm'));

            if (msg && !confirm(msg)) {
                return false;
            }

            if ($link.hasClass('disabled')) {
                return false;
            }
            $link.addClass('disabled');

            var data = $.extend(true, {}, HELP.ajaxMetaValues(), {
                    member_id: $(this).attr('data-member-id'),
                    item_id: $(this).attr('data-item-id')
                }),
                formIncrement = HELP.getCookie('form-valid'),
                i = 2;

            formIncrement = !!formIncrement ? Number(formIncrement) : 0;
            data.increment = ++formIncrement;
            HELP.setCookie('form-valid', data.increment);

            MAIN.thinking(true, false);

            HELP.sendAJAX({
                url: "https://hook.us1.make.com/dv56t4535h1sfag5g0693924h3sg5582",
                data: data,
                timeout: 120000,
                callbackSuccess: function(data) {
                    MAIN.handleAjaxResponse(data);
                    MAIN.thinking(false);
                },
                callbackError: function(data) {
                    console.log('error');
                    MAIN.thinking(false);
                }
            });
        });


        // Archive Job Trigger.
        $('#trigger-archive').on('click', function() {
            $('#form-edit-job button[value="archive"]').trigger('click');
        });


        // Show the rejection comments field.
        $('.comments-trigger').on('click', function(e) {
            e.preventDefault();
            var $wrapper = $(this).parents('form');
            
            $(this).hide();
            $wrapper.find('.comments-wrapper, .reject-button').removeClass('hide');
        });


        // Reject form submit.
        $('.reject-button').on('click', function() {
            if ($(this).hasClass('revision')) {
                // Move comments value across to the actual job review form.
                $('#compare-review').find('[name="comments"]').val(
                    $('#compare-existing').find('[name="comments"]').val()
                );
                // Submit form.
                $('#compare-review button[value="reject_revisions"]').trigger('click');
            }
        });


        // Revision rejection form submit listener.
        $('form[data-name="Review job form"]').on('submit', function() {
            // If "op" is to reject the revision...
            if ($('.form-action-op', this).val() == 'reject_revisions') {
                var $button = $('form[data-name="Static job revision form"] .reject-button');
                
                // Animate button.
                MAIN.buttonThinking($button);
            }
        });


        // Remove the Revision flag from Job Title form field values.
        $('input[name="job_title"]').each(function() {
            $(this).val( $(this).val().replace('[Revision] ', '') );
        });


        // Clone Revision form values to the Review form.
        var $forms = $('#compare-existing form');
        // Check that the Revision form exists.
        if ($forms.length > 0) {
            var $formLast = $forms.last();
            
            $.each(HELP.getFormValues($formLast), function(key, value) {
                var selector = `[name="${key}"]`,
                    $fieldReview = $(selector, '#compare-review');// Review field.

                // Check if there's both Current AND Revision forms.
                if ($forms.length > 1) {
                    var $field1 = $(selector, $forms.get(0)),// Current form field.
                        $field2 = $(selector, $forms.get(1));// Revision form field.

                    // Compare fields in both forms and highlight differences.
                    if (!!($field1.length && $field2.length) && ($field1.val() != $field2.val())) {
                        $field2.addClass('difference');
                    }
                }

                // Copy value from last existing form to the review form's fields.
                if ($fieldReview.attr('type') == "checkbox") {
                    // Handle checkbox values.
                    $fieldReview.prop('checked', $(selector, $formLast).prop('checked')).trigger('change');
                }
                else if ($fieldReview.attr('type') == "number") {
                    // Handle input number values.
                    // Formatted values with a comma aren't accepted by number fields.
                    $fieldReview.val( HELP.removeNonNumeric($(selector, $formLast).val()) ).trigger('change');
                }
                else {
                    $fieldReview.val(value).trigger('change');
                }
            });
        }


        // Make the Current tab active if there's no Revisions.
        if (!!$('#compare-existing .w-tab-pane:last-child .w-dyn-empty').length) {
            // Empty element exists so there's no Revisions. Show Current tab content.
            $('#compare-existing .w-tab-menu .w-tab-link:first-child').trigger('click');
            $('#compare-review').removeClass('no-tabs');
        }
    });


    return pub;
}(jQuery, this, this.document));

