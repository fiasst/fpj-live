var MAIN = (function($, window, document, undefined) {
    var pub = {};


    //
    // Webhooks.
    //
    const publishExistingJob = "https://hook.us1.make.com/dv56t4535h1sfag5g0693924h3sg5582";


    //
    // Memberstack plan names.
    //
    pub.planNames = {
        "pln_credit-package-1-p63bl01ya": "1 Credit",
        "pln_credit-package-2-pg3bd0zgw": "3 Credits",
        "pln_credit-package-3-la3be0z5o": "6 Credits",
        "pln_subscription-package-1-p73bj0zxa": "Standard monthly subscription",
        "pln_subscription-package-2-il3bk0zto": "Pro monthly subscription",
        "pln_subscription-package-3-9x3bl0z6j": "Enterprise monthly subscription"
    };


    //
    // Show or remove content based on conditions.
    //
    pub.controlHTML = function($elements, display) {
        if (display) {
            $elements.each(function() {
                var $el = $(this);

                if ($el.hasClass('hide')) {
                    $el.removeClass('hide');
                }
                else {
                    $el.show();
                }
            });
        }
        else {
            $elements.remove();
        }
    };


    //
    // Check the status of a node against the intended action (edit/review...).
    //
    pub.itemState = function(state, status) {
        switch (state) {
            case 'edit':
                // Can the item be edited.
                return ($.inArray(status, ['Rejected', 'Deleted']) < 0)// return false;
            case 'review':
                // Can the item be reviewed.
                return ($.inArray(status, ['Draft', 'Rejected', 'Archived', 'Deleted']) < 0) //return false;
        }
    };


    //
    //
    //
    pub.memberCanModerate = function(member) {
        return HELP.hasPermissions('can:moderate', member);
    };


    //
    // Check whether the member has credentials to edit a node (page).
    //
    pub.memberCanEdit = function(member, $node) {
        var authorID = HELP.sanitizeHTML($node.find('.node-author').attr('data-author'));
        
        if (HELP.checkKeyExists(member, 'id')) {
            // Is author OR has Moderator permissions.
            return (member.id == authorID || pub.memberCanModerate(member));
        }
        // Member not loaded. Maybe Anon.
        return false;
    };


    //
    //
    //
    pub.handleAjaxResponse = function(data, form) {
        pub.dialog(data);
        
        if (HELP.checkKeyExists(data, 'callback')) {
            HELP.callNestedFunction(data.callback, data, form);
        }
        if (form && HELP.checkKeyExists(data, "enableForm") && !!data.enableForm) {
            // Revert button back to default, enabled button.
            pub.buttonThinking(form.find('.form-submit'), true);
        }
    };


    //
    // Display information and optional action buttons in various dialog UI options.
    //
    pub.dialog = function(data) {
        if (HELP.checkKeyExists(data, "mode")) {
            switch (data.mode) {
                case 'alert':
                    // Need to sanitize this...
                    // alert(HELP.sanitizeHTML(data.message));
                    break;

                case 'banner':
                    // Nothing to see yet.
                    break;

                default:
                    pub.openDialog(data);
            }
        }
    };


    //
    //
    //
    pub.openDialog = (params) => {
        var actions;
        if (HELP.checkKeyExists(params, "options.actions")) {
            actions = $('<div class="actions justify-center" />');

            $.each(params.options.actions, function(i, item) {
                item.attributes.class = item.attributes.class || '';
                if (item.type == 'button') {
                    item.attributes.class += ' w-button small';
                }
                actions.append(
                    $('<a>', {
                        text: item.text,
                        attr: HELP.sanitizeAttrs(item.attributes)
                    })
                );
            })
        }
        var defaults = {
            bodyClasses: 'lbox-dialog',
            html: [HELP.tokenHTML(params.message), actions],
            css: {
                xxs: {
                    offset: 20,
                    maxWidth: 650,
                    contentInnerPadding: 20
                }
            }
        };

        HELP.waitFor(window.jQuery, 'litbox', 100, function() {
            // Litbox.
            $.litbox( $.extend(true, {}, defaults, params.options) );
        });

        $(document)
            .one('click', '.trigger-lbox-close', function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                $.litbox.close();
            })
            // Don't combine the close and reload classes or reload won't work.
            .one('click', '.trigger-reload', function(e) {
                e.preventDefault();
                
                if ($('body').hasClass('litbox-show')) {
                    $.litbox.close();
                }
                pub.thinking(true);
                
                // Reload the URL without including the hash.
                    // The Hash prevents the page reloading.
                    // And it'll launch a Litbox on page load if it finds an ID matching the hash.
                window.location = window.location.href.split('#')[0];
            });
    };


    //
    //
    //
    pub.thinking = (show, overlay = false) => {
        let classes = show ? (overlay ? 'thinking-overlay' : 'thinking') : 'thinking-overlay thinking';
        $('body').toggleClass(classes, show);
    };


    //
    //
    //
    pub.buttonThinking = function(btn, revert) {
        if (btn.length < 1) return false;

        if (!revert) {
            btn.attr('disabled', true).addClass('thinking');
            if (btn.get(0).nodeName == 'BUTTON') {
                btn.data('dataValue', btn.text()).text(btn.attr('data-wait'));
            }
            else {
                btn.data('dataValue', btn.attr('value')).attr('value', btn.attr('data-wait'));
            }
        }
        else {
            // Revert the button back to initial state.
            btn.removeAttr('disabled').removeClass('thinking clicked');
            if (btn.get(0).nodeName == 'BUTTON') {
                btn.text(btn.data('dataValue'));
            }
            else {
                btn.attr('value', btn.data('dataValue'));
            }
        }
    };


    //
    // Alternative for displaying Metadata values via HTML data-attributes.
    //
    pub.replaceTextWithMetadata = function(metadata) {
        $('[data-ms-member-meta]').each(function() {
            var data = $(this).attr('data-ms-member-meta');

            if (HELP.checkKeyExists(metadata, data)) {
                $(this).html(HELP.sanitizeHTML(metadata[data]));
            }
        });
    };


    //
    // Stop body from being scrollable.
    //
    pub.bodyPreventScroll = function(scroll, bodyClass) {
        $('body').toggleClass(bodyClass || 'no-scroll', scroll);
    };

    
    //
    // Calculate "X minutes/hours/days ago" text.
    //
    pub.timePast = function($el) {
        $el.text( HELP.timePast( $el.text() ) +' ago').addClass('parsed');
    };


    //
    // This get called whenever a Job teaser Item gets loaded on a page, including with AJAX.
    //
    pub.jobItem = function() {
        $('.card.job').each(function() {
            var $card = $(this);

            // If not a numeric salary "amount".
            if (!(!!$card.find('.js-salary-amount').text())) {
                $card.find('.salary').hide();
            }
            // If salary is set to NOT display.
            if (!(!!$card.find('.salary').length)) {
                $card.find('.js-salary-hidden').show();
            }
        });
    };


    //
    // This get called whenever a Collection Item gets loaded on a page, including with AJAX.
    //
    pub.collectionItem = function() {
        $('.w-dyn-item').each(function() {
            var $item = $(this);

            // Calculate the created "X ago" text.
            pub.timePast( $item.find('.time-past:not(.parsed)') );
        });
    }


    //
    //
    //
    pub.openLitbox = (params) => {
        var defaults = {
                title: false,
                // href: '#',
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
            };

        HELP.waitFor(window.jQuery, 'litbox', 100, function() {
            // Litbox.
            $.litbox( $.extend(true, {}, defaults, params) );
        });
    };


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Init.
        //
        pub.jobItem();
        pub.collectionItem();


        //
        // FS cmsFilters loaded/rendered new items.
        //
        window.fsAttributes = window.fsAttributes || [];
        window.fsAttributes.push([
            'cmsfilter',
            (filterInstances) => {
                // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
                const [filterInstance] = filterInstances;
                //console.log(filterInstance);

                // The `renderitems` event runs whenever the list renders items after filtering.
                filterInstance.listInstance.on('renderitems', (renderedItems) => {
                    // Prepare job teaser Item.
                    pub.jobItem();
                    // Calculate published date "ago" meta text in Collection Items.
                    pub.collectionItem();
                });
            },
        ]);


        //
        // Get current Member.
        //
        USER.getCurrentMember(function(member) {
            //if (!member) {
                //member is logged out
            //}

            //if (!!member.verified) {
                //member has verified email.
            //}
            console.log(member);

            //
            //
            //
            if (HELP.checkKeyExists(member, 'metaData')) {
                pub.replaceTextWithMetadata(member.metaData);
            }


            //
            // Show content author controls (edit, republish, archive links...).
            //
            if (!!$('.node-author').length) {
                $('.node-author').each(function() {
                    var $node = $(this).parents('.node'),
                        status = $('.node-status', $node).attr('data-status');

                    // Show/remove Author access elements.
                    pub.controlHTML(
                        $('.author-access', $node),
                        pub.memberCanEdit(member, $node)
                    );
                    // Show/remove Edit access elements.
                    pub.controlHTML(
                        $('.edit-access', $node),
                        (pub.itemState("edit", status) && pub.memberCanEdit(member, $node))
                    );
                    // Show/remove Review access elements.
                    pub.controlHTML(
                        $('.review-access', $node),
                        // (status != "Published" || pub.itemState("review", status) && !!$('#form-review-job').length)
                        (pub.itemState("review", status) && pub.memberCanModerate(member) && !!$('#form-review-job').length)
                    );
                });

            }


            //
            // Show content if User has permissions.
            //
            $('[data-ms-perm]').each(function() {
                pub.controlHTML($(this), HELP.hasPermissions($(this).attr('data-ms-perm'), member));
            });
            

            //
            // Check if URL hash exists as an element's ID on page load.
                // IMPORTANT! Do this last so all HTML show/hide attribute logic can decide whether to remove
                // the target element first. Eg: [data-ms-perm="can:moderate"] or [data-ms-content="business"].
            //
            var hashAutoTrigger = function() {
                var hash = window.location.hash;
                // If there's a location hash longer than simply "#" in the URL
                // AND the element exists on the page.
                if (hash.length > 1 && !!$(hash).length) {
                    // Look for an inline Litbox trigger and click the first instance.
                    $(`.trigger-lbox[href="${hash}"]:eq(0)`).trigger('click');
                    // Tab trigger.
                    $(`.w-tab-menu .w-tab-link[href="${hash}"]`).trigger('click');
                }
            }();
        });


        //
        // Add querystring to a links href based on two attributes set on the link.
        //
        $('a').filter('[data-query-value]').each(function() {
            var $el = $(this);
            $el.attr('href', $el.attr('href') + HELP.getSetQuerystring({
                [$el.attr('data-query-name')]: $el.attr('data-query-value')
            }));
        });


        //
        // Add a hash to a link's href based on an attribute.
            // Using 'a' and filter() to speed up the search.
        //
        $('a').filter('[data-hash]').each(function() {
            var $el = $(this);
            $el.attr('href', HELP.sanitizeHTML($el.attr('href') + '#' + $el.attr('data-hash')));
        });


        //
        // General Litbox trigger handler.
        //
        $('.trigger-lbox').on('click', function(e) {
            e.preventDefault();

            // Open Litbox.
            pub.openLitbox({
                title: $(this).attr('data-title'),
                href: $(this).attr('href')
            });
        });


        //
        // Accordions.
        //
        $('.accordion').on('click', '.accordion-header', function() {
            $(this).parent().toggleClass('active').find('.accordion-content').toggleClass('active');
        });


        //
        // Show a hidden block if it contains Collection list items (not empty).
        //
        $('.job-block-visibility').each(function() {
            $(this).toggle( !!$(this).find('.w-dyn-item').length );
        });


        //
        // Format DOB and other date fields on key press.
        //
        $('.format-ddmmyyyy').on('keyup', function(e) {
            if (e && !(e.key == 'Backspace' || e.key == 'Delete')) {
                $(this).val( HELP.formatDDMMYYYY($(this).val()) );
            }
        });


        //
        // Launch "Confirm" alert dialogs on element click.
        //
        $('.alert-confirm').on('click.alertConfirm', function(e) {
            var msg = HELP.sanitizeHTML($(this).attr('data-confirm'));
            if (msg) {
                e.preventDefault();
              
                if (confirm(msg)) {
                    $(this).off('click.alertConfirm').trigger('click');
                }
                else {
                    // Remove a class that's added in another listener.
                    $(this).removeClass('clicked');
                    return false;
                }
            }
        });


        //
        // Toggle element visibility.
        //
        $(document).on('click', '.toggle-vis', function(e) {
            var target = HELP.sanitizeHTML($(this).attr('href'));

            if (!!target.length) {
                e.preventDefault();
                $(this).toggleClass('active');
                $(target).toggleClass($(this).attr('data-toggle-class') || 'hide');
            }
        });


        //
        // Pullout sidebar starts open, then collapses to show users how to find it.
        //
        setTimeout(function() {
            var $pulloutSidebar = $('.sidebar.pullout.start-open.active');
            // If it exists, close it.
            if (!!$pulloutSidebar.length) {
                $pulloutSidebar.removeClass('active');
                $('#toggle-sidebar').removeClass('active');
            }
        }, 300);


        //
        // Trigger for newly introduced Dashboard links on the page (LitBox) to
        // imitate Memberstack.js functionality.
        //
        $(document).on('click', '.link-dashboard', function(e) {
            e.preventDefault();
            if (HELP.checkKeyExists(USER, "current.loginRedirect")) {
                window.location.href = USER.current.loginRedirect;
            }
        });


        //
        //
        //
        $('.node-job-row').each(function() {
            var row = $(this),
                actions = row.find('.table-links a'),
                status = row.find('.col-status').text().toLowerCase();

            if (!!status) {
                row.addClass(status);
              
                switch (status) {
                    case 'draft':
                        // Show all links.
                        actions.removeClass('hide');
                        break;
                    case 'expired':
                    case 'archived':
                        // Show all links.
                        actions.removeClass('hide').filter('[data-link="publish"]').text('Republish');
                        break;
                    case 'pending':
                    case 'published':
                        // Show Edit link only.
                        actions.filter('[data-link="edit"]').removeClass('hide');
                }
            }
        });


        //
        // Split content into steps, managed my classes and HTML attributes.
           // Used on the Add New Business Litbox.
        //
        $(document).on('click', '.js-next-step', function(e) {
            e.preventDefault();
            $(this).parents('.js-steps').find('[class*="js-step-"]').addClass('hide')
                .filter('.js-step-'+ $(this).attr('data-step')).removeClass('hide');
        });
        // Reset steps back to step 1.
            // Usage: $('#wrapper').resetSteps();
        $.fn.resetSteps = function() {
            $(this).find('[class*="js-step-"]').addClass('hide')
                .filter('.js-step-1').removeClass('hide');
        };

    });

    return pub;
}(jQuery, this, this.document));




//
// Extend jQuery.
//
//
// Case-insensitive selector ":icontains()".
//
jQuery.expr[':'].icontains = function(el, i, m, array) {
    return (el.textContent || el.innerText || "").toLowerCase().indexOf((m[3] || "").toLowerCase()) >= 0;
};


