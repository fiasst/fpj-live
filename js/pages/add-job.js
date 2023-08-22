var ADD_JOB = (function($, window, document, undefined) {
    var pub = {};


    //
    // Webhooks.
    //
    const listMembersBusinesses = "https://hook.us1.make.com/t828p6ci1t9qp2bef0d7or4ydj8ypljp";


    //
    // On DOM ready.
    //
    $(function() {
        //
        //
        //
        const $triggerAddBusiness = $('#trigger-add-business');


        //
        // Build Business select list options from JSON.
        //
        HELP.waitFor(USER, "current.id", 100, function() {
            MAIN.thinking(true, false);

            // Get list of Member's Businesses via AJAX.
            HELP.sendAJAX({
                url: listMembersBusinesses,
                method: "GET",
                data: {
                    id: USER.current.id
                },
                callbackSuccess: function(data, textStatus) {
                    var form = $('#wf-form-Add-Job-Form');
                    MAIN.thinking(false);
                    USER.updateCurrentUser(data);

                    if (HELP.checkKeyExists(data, "businesses")) {
                        var businesses = data.businesses;
                        USER.current.businesses = businesses;

                        // Check "active" businesses against limit.
                        var numBeyondLimit = BUSINESS.checkBusinessLimits(businesses, true),
                            businessesActive = HELP.filterArrayByObjectValue(businesses, 'state', 'active');

                        // If user IS exceeding the max "active" businesses limit.
                        // Or, they have less active businesses than their limit and more businesses than are currently active.
                        if (numBeyondLimit > 0 || (numBeyondLimit < 0 && businessesActive.length < businesses.length)) {
                            // Update which businesses are active to meet/not exceed plan limit.
                            BUSINESS.updateActiveBusinesses(businesses);
                        }
                        else {
                            buildBusinessSelectField(USER.current);
                            MAIN.handleAjaxResponse(data, form);
                        }
                    }
                },
                callbackError: function(jqXHR, textStatus, errorThrown) {
                    MAIN.thinking(false);
                }
            });
        });


        //
        //
        //
        function buildBusinessSelectField(data, selectedBusiness) {
            // WARNING. sanitize data and use it carefully.
            var list = data.businesses || [];

            if (list.length < 1) {
                // No businesses exist.
                // The second parameter is a callback function for the "onComplete" LitBox options.
                $triggerAddBusiness.trigger('click', function() {
                    alert("You need to add your business before you can post a job");
                });
            }
            else {
                var businessSelect = $('#job-business'),
                    isSelected = list.length === 1;

                // Show step 2 of Add Job form.
                $('.form-job-step-2').addClass('active');

                // Sort by "active" businesses appearing first.
                list = HELP.sortArrayByObjectValue(list, 'state', 'active');

                // Clear any previous options.
                businessSelect.html('').append( $('<option>', {
                    value: '',
                    text: 'Select...'
                }) );

                $.each(list, function(i, item) {
                    var name = HELP.sanitizeHTML(item.tradingName),
                        registeredName = !!item.registeredName ? ` (${HELP.sanitizeHTML(item.registeredName)})` : '';
                    
                    if (selectedBusiness) {
                        isSelected = (selectedBusiness == name);
                    }
                    
                    businessSelect.append($('<option>', {
                        value: (item.state == 'disabled') ? '0' : item.itemId,
                        text: name + registeredName,// Sanatize values.
                        selected: isSelected,
                        disabled: (item.state == 'disabled')
                    }));
                });
            }
        }


        //
        // Callback that is set in Make.com Scenario's AJAX response.
        //
        pub.businessAddedCallback = function(data, form) {
            data = data || {};

            if (HELP.checkKeyExists(data, "business")) {
                USER.current.businesses = USER.current.businesses || [];
                USER.current.businesses.push(data.business);
                HELP.setCookie("MSmember", JSON.stringify({"businesses": USER.current.businesses}) );
                buildBusinessSelectField(USER.current, data.business.tradingName);
            }
        };

        
        //
        // Add business form in Colorbox.
        //
        $triggerAddBusiness.on('click', function(e, onComplete) {
            e.preventDefault();

            // Don't add new businesses if limit is reached.
            var businesses = [];
            if (HELP.checkKeyExists(USER, "current.businesses")) {
                businesses = USER.current.businesses;
            }
            if (!!businesses.length) {
                // Check all businesses against limit, not just active businesses.
                var numBeyondLimit = BUSINESS.checkBusinessLimits(businesses, false);

                // Don't add new businesses if the limit is already reached.
                if (numBeyondLimit >= 0) {
                    BUSINESS.maxBusinessesReached();
                    return false;
                }
            }

            // onComplete = onComplete || false;// Should be able to remove this. Moved code below.
            
            // Open Litbox.
            MAIN.openLitbox({
                title: 'Add a new business',
                href: '#business-form-wrapper',
                onComplete: onComplete || false,
                onClosed: function() {
                    // Reset to step 1.
                    $('#business-form-wrapper .js-steps').resetSteps();
                }
            });
        });
    });

    return pub;
}(jQuery, this, this.document));





