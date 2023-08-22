var BUSINESS = (function($, window, document, undefined) {
    var pub = {},
        //
        // Maximum businesses a Member can have.
        //
        businessesMax = 6,


        //
        // Limit based on Member's active Add-on subscriptions.
        //
        membersBizLimit,


        //
        // Selector for the Update active businesses form.
        //
        formActivebusinessesID = '#wf-form-Update-Active-Businesses-Form';


    //
    // Memberstack user business limits by planId.
    //
    /*pub.membersBusinessLimit = {
        "pln_credit-package-1-p63bl01ya": 1,
        "pln_credit-package-2-pg3bd0zgw": 1,
        "pln_credit-package-3-la3be0z5o": 1,
        "pln_subscription-package-1-p73bj0zxa": 1,
        "pln_subscription-package-2-il3bk0zto": 3,
        "pln_subscription-package-3-9x3bl0z6j": 5
    };*/
    //
    // This is where the logic will live to count "Business Add-ons" for a Member:
        // Right now we're just restricting Business to 10 max to prevent abuse.
    //
    pub.membersBusinessLimit = businessesMax;


    //
    // Check if the user is exceeding the number of active businesses allowed for the current subscription.
    // If so, launch a UI to select which businesses they want to keep active within the limit.
    //
    pub.checkBusinessLimits = function(businesses, activeOnly) {
        var plans = USER.getMemberPlans(false, false, true);// Active plans only.
            // planLimits = pub.membersBusinessLimit;

        // Update global vars (to be used elsewhere).
        membersBizLimit = pub.membersBusinessLimit;

        if (activeOnly) {
            // Filter out businesses with state NOT set to "active".
            businesses = HELP.filterArrayByObjectValue(businesses, 'state', 'active');
        }

        // Get the max business limit of a user for all active plans in their account.
        /*$.each(plans, function(i, plan) {
            if (planLimits[plan.planId] > membersBizLimit) {
                membersBizLimit = planLimits[plan.planId];
            }
        });*/

        // How much are they exceeding their business limit by.
            // Want to know if > (exceeding) when building business dropdown list.
            // Want to know when >= when trying to add a new business.
        return businesses.length - membersBizLimit;
    };


    //
    //
    //
    pub.updateActiveBusinesses = function(businesses) {
        var businessesText = HELP.pluralize(membersBizLimit, 'business', 'businesses'),
            $form = $(formActivebusinessesID),
            $businessItem = $form.find('.js-business');

        // Replace token text with business limit.
        $form.find('.js-num-businesses').text(businessesText);


        // Remove the Add Job and Add Business forms.
        $('.form-job-step-2, #business-form-wrapper').remove();

        // Remove the template item.
        $businessItem.hide();

        // Build a checkbox list of user's businesses.
        $.each(businesses, function(i, business) {
            // Clone template item.
            var $newItem = $businessItem.clone().show(),
                registeredName = !!business.registeredName ? ` (${business.registeredName})`: '';

            // Add business using template.
            $('.js-business-name', $newItem).text(`${business.tradingName}${registeredName}`);
            $('[type="checkbox"]', $newItem).attr('name', 'businesses[]').val(business.itemId);
            $form.find('.checkbox-list').append($newItem)
        });

        // Explain problem and open UI to update active businesses.
        MAIN.openLitbox({
            title: 'Update active businesses',
            href: '#update-businesses-form-wrapper',
            css: {
                xxs: {
                    maxWidth: 700
                }
            }
        });
    };


    //
    // Member has added the max number of businesses allowed per account (prevents abuse).
    //
    pub.maxBusinessesReached = function() {
        // Remove form.
        $('#business-form-wrapper').remove();

        MAIN.dialog({
            // message: "[p]You have reached the active businesses limit for your current member plan. <a href=\"/plans\">Upgrade your plan</a> to post jobs for more businesses.[/p]",
            message: "[p]You have reached the maximum number of businesses allowed per account. If you need to increase this limit, please contact us.[/p]",
            type: "success",
            mode: "dialog",
            options: {
                title: "Business limit reached",
                actions: [{
                    type: "button",
                    text: "OK",
                    attributes: {
                        class: "button-primary trigger-lbox-close",
                        href: "#"
                    }
                }]
            }
        });
    };


    //
    // Form validation for active businesses (limit) form.
        // This gets set on the form element as an attribute in Webflow. Shit, I know...
    //
    pub.formValidateActiveBusinesses = function() {
        var $form = $(formActivebusinessesID),
            businessesText = HELP.pluralize(membersBizLimit, 'business', 'businesses'),
            checked = $form.find('[type="checkbox"]:checked');

        // None or too many businesses selected.
        if (checked.length < 1 || checked.length > membersBizLimit) {
            alert(`Please${checked.length > membersBizLimit ? ' only' : ''} select ${businessesText} that you want to remain active.`);
            return false;
        }
        return true;
    };



    return pub;
}(jQuery, this, this.document));



