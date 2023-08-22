/*
* functions that help other functions to do their thing.
*/

var USER = {},
    MAIN = {},
    ADD_JOB = {},

HELP = (function($, window, document, undefined) {
    var pub = {};

    
    //
    //
    //
    pub.timezone = "Asia/Bangkok";


    //
    //
    //
    pub.cleanLowerString = (string = '') => $.trim(string.toLowerCase());


    //
    //
    //
    pub.removeNonNumeric = (str = '') => str.toString().replace(/\D/g, '');


    //
    // Remove <script> tags and any attributes that start with 'on' (onclick, etc).
        // This helps to guards against XSS attack.
    //
    /*pub.sanitizeHTML = (str) => {
        if (!str) return;

        // Remove <script> tags and content.
        return str.toString()
            .replace(/<.*?script.*?>/gi, '')
            .replace(/<script\b[^>]*>(?:[^<]*<\/script>|[^>]*\/>)|<script\b[^>]*\/?>/gi, '')
            // Remove attributes that start with "on" (eg: "onclick")
            .replace(/(\s*<[^>]*)(\s+(on\w+)="[^"]*")/gi, '$1')
            // Remove instances of "javascript:".
            .replace(/javascript:/gi, '')
            // Remove instances of "javascript:" in decimal HTML Character.
            .replace(/&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;/gi, '')
            // Remove instances of "javascript:" in decimal HTML Character (without semicolons).
            .replace(/&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058/gi, '');
    };*/
    pub.sanitizeHTML = (str) => {
        if (!str) return;

        const escapeChars = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;'
        };
        return str.toString()
            // Remove <script> tags and content.
            // Remove ".constructor" to prevent ES6 Set.constructor() from eval() things.
            .replace(/<.*?script.*?>|.constructor/gi, '')
            // Remove substrings that start with "on" (event attributes. ex: "onclick").
            .replace(/(\s*<[^>]*)on\w+/gi, '')
            // Remove instances of "javascript:" or "script:" (for "ascript:").
            .replace(/javascript.*?:|script.*?:/gi, '')
            // Remove "script:" decimal HTML Characters (&#0000099 or &#99. semicolon optional).
            .replace(/&#0*115;?|&#0*99;?|&#0*114;?|&#0*105;?|&#0*112;?|&#0*116;?|&#0*58;?/g, '')
            // Remove "script:" Hexadecimal HTML Characters (&#x0000073 or &#x73. semicolon optional).
            .replace(/&#x0*73;?|&#x0*63;?|&#x0*72;?|&#x0*69;?|&#x0*70;?|&#x0*74;?|&#x0*3A;?/gi, '')
            // Escape certain HTML characters.
            // (Match & if not followed by (apos|quot|gt/lt|amp);)
            .replace(/[<>]|&(?!(?:apos|quot|[gl]t|amp);)/gi, match => escapeChars[match])
            // All combinations of the character "<" in HTML/JS (semicolon optional):
            .replace(/(\x3c:?|\u003c:?)|(?:&(amp;)?#0*60;?|&(amp;)?#x0*3c;?):?/gi, '')
    };


    //
    // Remove unnecessary/unsafe HTML attributes from Object of key|value pairs.
    //
    pub.sanitizeAttrs = (attrs = {}) => {
        const allowedAttrs = ['id', 'class', 'href', 'data-ms-action'];

        for (var key in attrs) {
            if (!allowedAttrs.includes(key)) delete attrs[key];
        }
        return attrs;
    };


    //
    // Convert basic token tags such as [p class="foo"]bar[/p] to HTML.
    //
    pub.tokenHTML = (str) => {
        if (!str) return;
        str = pub.sanitizeHTML(str);

        // Allowed tags: p, strong, em, a, div, h[1-6], span
        return str
            // replace [] tags with <>.
            .replace(/\[(\/?(?:p|strong|em|a|div|h[1-6]|span)(?:\s+[^[\]]+)?)]/gi, (match, tag) => {
                var tag = tag.toLowerCase(),
                    openTag = tag.startsWith('/') ? `</${tag.slice(1)}` : '<'+ tag;
                return openTag.endsWith(']') ? openTag.slice(0, -1) +'>' : openTag +'>';
            })
            // Remove substrings that start with "on" (event attributes. ex: "onclick").
            .replace(/(\s*<[^>]*)on\w+/gi, '');
    };


    //
    //
    //
    pub.stripHTML = function(str) {
        if (!str) return;

        return str
            // Try to strip any broken HTML.
            .replace(/<\s*\/?\s*([a-zA-Z0-9]+)\s*>/g, '')
            // Strip HTML.
            .replace(/<[^>]*>/g, '');
    };


    //
    // Strip HTML but include line-breaks for block-level elements and <BR> tags.
        // This is useful for textarea formatting.
    //
    pub.stripHTMLWithLinebreaks = function(str) {
        // Replace <br> tags with newline characters.
        str = str.replace(/<br\s*\/?>/gi, '\n');
        // Replace block-level tags with newline characters.
        str = str.replace(/<(?:div|p|blockquote|h[1-6]|table|ul|ol)[^>]*>/gi, '\n');
        // Sanitize a remove remaining HTML tags and trim whitespace.
        return $('<div>').html(str).text().trim();
    };


    //
    //
    //
    pub.getEnvType = function() {
        return location.hostname.indexOf('webflow') > -1 ? 'dev' : 'live';
    };


    //
    //
    //
    pub.getCurrentDomain = function() {
        return window.location.origin;
    };


    //
    //
    //
    pub.getCurrentLang = function() {
        return pub.checkKeyExists(window, "Weglot") ? Weglot.getCurrentLang() : 'en';
    };


    //
    // Format money.
    //
    pub.formatCurrency = function(amount) {
        return parseFloat(amount, 10).toFixed(2).toString();
    };


    //
    // Get $£€ etc symbols.
    //
    pub.getCurrencySymbol = (locale, currency) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();


    //
    // Get/set querystring.
    //
    pub.getSetQuerystring = (params = '', includePath) => {
        const urlObj = new URL(window.location.href);

        // Set params.
        if (typeof(params) === "object") {
            $.each(params, function(key, value) {
                urlObj.searchParams.set(
                    pub.sanitizeHTML(key), pub.sanitizeHTML(value)
                );
            });
            // Return path and querystring or just the string.
            return includePath ? urlObj.pathname + urlObj.search : urlObj.search;
        }
        // Get value.
        return pub.sanitizeHTML( urlObj.searchParams.get( params.toString() ));
    };


    //
    // Return human-friendly date.
    //
    pub.formatTimestamp = function(timestamp, showTime, localTimezone) {
        if (!timestamp) return;

        var date = new Date(timestamp),
            locale = pub.getCurrentLang(),
            options = {
                //weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
        if (localTimezone) {
            // Convert to localtime if it's not already converted.
            options.timeZone = pub.timezone;
        }
        if (showTime) {
            $.extend(options, {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        if (typeof timestamp == "string") {
            // Convert to a timestamp.
            timestamp = date.getTime();
        }
        if (timestamp.toString().length < 11) {
            date.setTime(timestamp * 1000);
        }
        return date.toLocaleDateString(locale, options);
    };


    //
    //
    //
    pub.getTimestamp = function(dateString, localTimezone) {
        if (dateString) {
            return new Date(dateString).getTime();
        }
        var date = new Date(),
            options = {};

        if (localTimezone) {
            options.timeZone = pub.timezone;
        }
        date = date.toLocaleString(pub.getCurrentLang(), options);

        return new Date(date).getTime();
    };
    

    //
    //
    //
    pub.getISOdate = function(dateString, localTimezone) {
        var date = pub.getTimestamp(dateString, localTimezone);
        return new Date(date).toISOString();
    };


    //
    // Pluralize words based on provided Integer value (eg. "minute/minutes", "day/days").
    //
    pub.pluralize = (count, single, plural) => `${count} ${count !== 1 ? plural || single+'s' : single}`;


    //
    // Output a String describing how much time has past (eg. "minute/minutes ago", "day/days ago").
    //
    pub.timePast = (date) => {
        const msMin = 60 * 1000, msHr = msMin * 60, msDay = msHr * 24, msWeek = msDay * 7, msMonth = msDay * 30, msYr = msDay * 365;
        var curr = pub.getTimestamp(false, true),// Converted to local timezone.
            date = pub.getTimestamp(date),
            elapsed = curr - date;

        if (elapsed < msMin) {
            return pub.pluralize(Math.round(elapsed/1000), 'second');
        }
        else if (elapsed < msHr) {
            elapsed = Math.round(elapsed/msMin);
            return pub.pluralize(elapsed, 'minute');
        }
        else if (elapsed < msDay) {
            elapsed = Math.round(elapsed/msHr);
            return pub.pluralize(elapsed, 'hour');
        }
        else if (elapsed < msMonth) {
            elapsed = Math.round(elapsed/msDay);
            return pub.pluralize(elapsed, 'day');
        }
        else if (elapsed < msWeek) {
            elapsed = Math.round(elapsed/msWeek);
            return pub.pluralize(elapsed, 'week');
        }
        else if (elapsed < msYr) {
            elapsed = Math.round(elapsed/msMonth);
            return pub.pluralize(elapsed, 'month');
        }
        else {
            elapsed = Math.round(elapsed/msYr);
            return pub.pluralize(elapsed, 'year');
        }
    };


    //
    // Check whether Object key exists
    //
    pub.checkKeyExists = function(obj, keys) {
        // If obj is falsy.
        if (!(!!obj)) return false;
        keys = typeof keys === 'string' ? keys.split('.') : keys;
        if (keys.length === 0) return true;
        return pub.checkKeyExists(obj[ keys.shift() ], keys);
    };

    
    //
    // Get a value from a flat or deep (nested) Object.
    //
    pub.getProperty = function(obj, key) {
        let keys = key.split('.'),
            value = obj;

        for (let i = 0; i < keys.length; i++) {
            value = value[keys[i]];

            if (value === undefined || value === null) return null;
        }
        return value;
    };


    //
    //
    //
    pub.callNestedFunction = function(string, ...args) {
        var path = string.split("."),
            functionName = path.pop(),// Extracting the function name from the string.
            nestedObject = pub.getProperty(window, path.join("."));// Assuming the top-level object is the global scope.

        if (nestedObject && typeof nestedObject[functionName] === 'function') {
            // Calling the function dynamically.
            return nestedObject[functionName](...args);
        }
        else {
            console.error('Function not found:', string);
        }
    };


    //
    //
    //
    pub.waitFor = function(key, value, timer, callback) {
        var nTimer = setInterval(function() {
            // wait for something to load...
            if (pub.checkKeyExists(key, value)) {
                callback();
                clearInterval(nTimer);
            }
        }, timer);
    };


    //
    // Useful for filtering an Array of businesses Objects to only state.active ones.
        // or, for filtering out member plans without a status of ACTIVE or TRIALING.
    //
    pub.filterArrayByObjectValue = function(array, key, values) {
        // Check if the 'values' parameter is an array.
        if (Array.isArray(values)) {
            return $.map(array, function(obj, i) {
                // Check if the object's 'key' matches any value in the 'values' array.
                return values.includes(obj[key]) ? obj : null;
            });
        }
        else {
            // 'values' is a single value, not an array.
            return $.map(array, function(obj, i) {
                return obj[key] == values ? obj : null;
            });
        }
    };


    //
    // Sort 2 values by order ASC/DESC and handle null values.
    //
    function sort(a, b, order) {
        if (a === null) return order === 'desc' ? 1 : -1;
        if (b === null) return order === 'desc' ? -1 : 1;
        return order === 'desc' ? b - a : a - b;
    }


    //
    // Useful for sorting an Array of businesses Objects by state.active appearing first.
    //
    pub.sortArrayByObjectValue = function(array, key, val, order = 'desc') {
        return array.sort((a, b) => {
            // For deep (nested) values.
            a = pub.getProperty(a, key);
            b = pub.getProperty(b, key);

            if (val) {
                // Sort by key's value matching the supplied value.
                return order==='desc' ? (b===val)-(a===val) : (a===val)-(b===val);
            }
            else {
                // Sort by value.
                return sort(a, b, order);
            }
        });
    };


    //
    // Check if member has permissions.
    //
    pub.hasPermissions = function(permission, member) {
        var negative = permission.indexOf("!") === 0,
            perm = permission.replace("!", ""),// Remove the ! so we can check array for permission String.
            hasPerm  = $.inArray(perm, member.permissions);
        
        // Check if the permission exists or that it doesn't (negative).
        return negative ? hasPerm < 0 : hasPerm > -1;
    };


    //
    // Add useful metadata to an AJAX request.
    //
    pub.ajaxMetaValues = function(data, type) {
        var obj = {};

        //Member ID.
        obj.member_id = USER.current.id || null;

        // Add Environment details.
        obj.env = pub.getEnvType();
        obj.url = pub.getCurrentDomain();

        // Language.
        obj.language = pub.getCurrentLang();

        // Add submitted date/time value.
        obj.submitted = pub.getISOdate();
        obj.submittedTimestamp = pub.getTimestamp();

        if (type != 'formData') return obj;
        
        // Convert JS Object to FormData.
        return $.each(obj, function(key, value) {
            data.set(key, value);
        });
    };


    //
    // get form values as a key-value Object
    //
    pub.getFormValues = function($form, type) {
        var formData = new FormData($form[0]),
            groupedArrays = {};
        
        // Re-build certain field's values.
        $($form).find(':input').each(function() {
            var $element = $(this),
                key = $element.attr('name'),
                value = $element.val();
            
            // Re-build multi-select values.
            if ($element.is('select[multiple]')) {
                formData.set(key, $element.val());
            }
            // Check if checkbox name ends with [].
            else if ($element.is(':checkbox:checked') && key.endsWith('[]')) {
                // Re-build checkbox values for grouped elements.
                var elementName = key.slice(0, -2);// Remove [].
                if (!groupedArrays[elementName]) {
                    groupedArrays[elementName] = [];// Create array if not present.
                }
                groupedArrays[elementName].push(value);
                formData.delete(key);// Remove the individual entry.
            }
        });
        // Merge rebuilt groupedArrays into formData.
        for (elementName in groupedArrays) {
            formData.set(elementName, groupedArrays[elementName]);
        }

        // Add metadata to formData:
        pub.ajaxMetaValues(formData, 'formData');

        console.log('formData', formData);

        if (type == 'formData') {
            return formData;
        }
        if (type == 'json') {
            // Convert to JSON.
            return JSON.stringify(Object.fromEntries(formData));
        }
        // JS Object.
        return Object.fromEntries(formData);
    };


    //
    //
    //
    pub.sendAJAX = function(options, form) {
        params = $.extend({
            //url: "",// Required and must be provided.
            //data: {},// Required and must be provided.
            method: "POST",
            timeout: 60000,
            success: function(data, textStatus) {
                console.log(textStatus, data);
                if (typeof params.callbackSuccess === "function") params.callbackSuccess(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                if (typeof params.callbackError === "function") params.callbackError(textStatus, errorThrown);
                
                // Generic error message.
                var data = {
                    "mode": "dialog",
                    "message": "[p]Sorry, something went wrong, please try again. if the problem continues, contact our team for help.[/p]",
                    "type": "error",
                    "enableForm": true,
                    "options": {
                        "title": "There was a problem...",
                        "overlayClose": false,
                        "actions": [
                            {
                                "type": "button",
                                "text": "OK",
                                "attributes": {
                                    "class": "button-primary trigger-lbox-close",
                                    "href": "#"
                                }
                            }
                        ]
                    }
                };
                if (pub.checkKeyExists(window.jQuery, "litbox")) {
                    MAIN.handleAjaxResponse(data, form || false);
                }
                else {
                    alert(data.message);
                }
            }
        }, options);
        $.ajax(params);
    };


    //
    //
    //
    pub.parseIfStringJSON = function(str) {
        if (typeof str === 'string') {
            str = str.trim();
            if (str[0] == '{' && str[str.length - 1] == '}') {
                return JSON.parse(str);
            }
        }
        return str;
    };


    //
    //
    //
    pub.formatDDMMYYYY = (value, divider = ' / ') => {
        var val = value.replace(/[^\d]/g, ''),// Remove non-digit characters
            format = '',
            day = val.slice(0, 2),
            month = val.slice(2, 4),
            year = val.slice(4, 8);

        if (day) {
            format += day;
            if (day.length === 2) format += divider;
        }
        if (month) {
            format += month;
            if (month.length === 2) format += divider;
        }
        if (year) format += year;
        return format;
    }


    //
    // Manage cookies.
    //
    pub.setCookie = function(name, value, days) {
        var expires = "";
        
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };
    pub.getCookie = function(name) {
        var nameEQ = name + "=",
            cookies = document.cookie.split(';');
        
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return pub.parseIfStringJSON(cookie.substring(nameEQ.length));
            }
        }
        return null;
    };
    pub.deleteCookie = function(name) {
        document.cookie = name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    };
    

    //
    // On DOM ready.
    //
    // $(function() {});

    
    return pub;
}(jQuery, this, this.document));

