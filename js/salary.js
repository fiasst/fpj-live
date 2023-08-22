//
// Used by the Add Job and Edit Job forms to calculate salary and control form fields.
//
var SALARY = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        //
        //
        //
        var salary = function() {
            // We use name attributes and not ID for these selectors because this
            // widget appears twice on the Job page (Edit and Review forms).
            var salaryAmount = 'input[name="job_salary"]',
                salaryType = 'select[name="job_salary_type"]',
                salaryMonthly = 'input[name="job_salary_monthly"]',

                typeVal = function(context) {
                    var val = $(salaryType, context).val();
                    return val ? val.toLowerCase() : false;
                },
                isNumericType = function(context) {
                    return ($.inArray(typeVal(context), [
                        'per hour', 'per day', 'per month', 'per year'
                    ]) > -1);
                },
                calculateSalary = function(element) {
                    var $form = $(element).parents('form'),
                        $salaryAmount = $(salaryAmount, $form),
                        numericType = isNumericType($form),
                        salary = $salaryAmount.val(),
                        val = '';
                    

                    if (numericType && !!salary) {
                        if (salary < 1) {
                            alert("Salary amount must be a positive number");
                            $salaryAmount.val('').focus();
                        }

                        switch (typeVal($form)) {
                            case 'per year':
                                val = salary / 12;
                                break;
                            case 'per month':
                                val = salary;
                                break;
                            case 'per day':
                                val = salary * 20;
                                break;
                            case 'per hour':
                                val = salary * 160;
                                break;
                        }
                    }
                    $(salaryMonthly, $form).val(val);
                };

            // Salary type and salary amount.
            $(salaryType).on('change', function() {
                var // Used as context when there's multiple forms with this widget on a page.
                    $form = $(this).parents('form'),

                    numericType = isNumericType($form),
                    $salaryAmount = $(salaryAmount, $form);

                $('.wrapper-salary-amount', $form).toggle(numericType)
                    .find('.suffix').text(
                        $(this).find('option:selected').text()
                    );

                $salaryAmount.attr('required', function(i, attr) {
                    return numericType;
                });

                if (!numericType) {
                    $salaryAmount.val('');
                }
                calculateSalary(this);
            });

            $(salaryAmount).on('focusout', function(){
                calculateSalary(this);
            });
        }();
    });

    return pub;
}(jQuery, this, this.document));



