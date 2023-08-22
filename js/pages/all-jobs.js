var ALL_JOBS = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        //
        //
        //
        const $filterForm = $('#wf-form-Jobs-Filter-Form');
        $('#filter-sector-list', $filterForm).on('keyup', function() {
            $('#facet-sector-list .w-dyn-item', $filterForm)
                .show().not(':icontains('+ $(this).val() +')').hide();
        });


        //
        // Because more than one FS attribute doesn't work.
        //
        var summaryCount = $('#js-results-count'),
            sidebarSummaryCount = $('#js-sidebar-results-count', $filterForm);
        
        setInterval(function() {
            sidebarSummaryCount.text( summaryCount.text() );
        }, 300);


        //
        // Filter facet selection summary.
        //
        $('.facet :input', $filterForm).on('change', function() {
            var facet = $(this).parents('.facet'),
                title = $('.title', facet)
                num = $('.js-facet-inputs :input:selectedInput', facet).length;

            $('span', title).text(` (${num})`);
        });
        // Init (first load and loading from cache via back button).
        $(window).on('pageshow', function() {
            $('.facet', $filterForm).each(function() {
                // Force selected/checked inputs to update filters.
                $(':input:eq(0)', this).trigger('change');

                // Show accordions that have active filters in them.
                if (!!$('.js-facet-inputs :input:selectedInput', this).length) {
                    // Open facet accordions that have selected values
                    $('.accordion-header', this).trigger('click');
                }
            });
        });
    });

    return pub;
}(jQuery, this, this.document));





