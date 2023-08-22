var DASHBOARD = (function($, window, document, undefined) {
    var pub = {};


    //
    //
    //
    var finalDeleteAccountConfirm = function() {
        // Final confirmation message.
        var $confirm = $('#field-confirm'),
            params = {
                "message": "[p]Confirm one last time that you want to cancel any subscriptions, delete you account, and erase your personal data. [strong]This cannot be undone.[/strong][/p]",
                "type": "warning",
                "options": {
                    "title": "One final check...",
                    "actions": [
                        {
                            "type": "button",
                            "text": "No, take me to safety",
                            "attributes": {
                                "class": "button-secondary link-dashboard trigger-lbox-close",
                                "href": "#"
                            }
                        },
                        {
                            "type": "button",
                            "text": "Yes, Delete my account",
                            "attributes": {
                                "class": "button-primary danger trigger-lbox-close",
                                "href": "#",
                                "id": "trigger-delete-account"
                            }
                        }
                    ]
                }
            };

        //
        // Validate confirm field.
        //
        if (!$confirm.val() || $confirm.val().toLowerCase() != "delete") {
            params.message = "[p]You must type [strong]\"DELETE\"[/strong] in the required field to confirm that you want to delete your account.[/p]";
            params.type = "info";
            params.options.title = "Field required";
            params.options.actions = [
                {
                    "type": "button",
                    "text": "OK",
                    "attributes": {
                        "class": "button-primary trigger-lbox-close",
                        "href": "#"
                    }
                }
            ];
        }
        // Show dialog.
        MAIN.openDialog(params);
    };


    //
    //
    //
    var deleteAccountHandler = function($form) {
        MAIN.thinking(true, true);
                
        // Delete member's account webhook.
        var data = HELP.getFormValues($form);
        data.customer_id = customerID = USER.current.stripeCustomerId;

        HELP.sendAJAX({
            url: 'https://hook.us1.make.com/rouyiju7uboj6bnpon9l74q2i6vjvqhc',
            method: 'POST',
            data: data,
            timeout: 120000,
            callbackSuccess: function(data) {
                MAIN.thinking(false);
                MAIN.handleAjaxResponse(data, $form);
            },
            callbackError: function(data) {
                MAIN.thinking(false);
                console.log('error');
            }
        }, $form);
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Make tab active if there's only 1 tab pane (a Jobseeker's Applications).
        //
        var $tabPanes = $('#my-content .w-tab-pane');
        if ($tabPanes.length === 1) {
            // Show the only remaining pane.
            $tabPanes.addClass('w--tab-active');
        }


        //
        // Delete account form handler.
        //
        var $formDeleteAccount = $('#wf-form-Delete-Account-Form');

        $formDeleteAccount.on('submit', function(e) {
            e.preventDefault();
            finalDeleteAccountConfirm();

            $(document).on('click', '#trigger-delete-account', function() {
                deleteAccountHandler($formDeleteAccount);
            });
            // Don't submit the form.
            return false;
        });

    });


    return pub;
}(jQuery, this, this.document));

