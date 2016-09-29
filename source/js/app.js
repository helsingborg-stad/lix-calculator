var LixCalculator = (function ($) {

    // Elements
    var $metaBox = $('#lix-calculator-content');

    // Formulas
    var formulas = [];

    // Typing timer
    var typingTimer;
    var typingTimerInterval = 300;

    // Editors
    var visualContentEditor;
    var textContentEditor;

    function LixCalculator() {
        if ($('#content').length === 0) {
            return;
        }

        $(window).load(function () {
            this.init();
        }.bind(this));
    }

    LixCalculator.prototype.init = function() {

        /**
         * Trigger the this.calculate function when visual editor initializes and changes
         * @type {void}
         */
        setTimeout(function () {
            if (tinymce.get('content')) {
                visualContentEditor = tinymce.get('content');
                visualContentEditor.off('keyup');
                this.calculate('visual', this.trimContent(visualContentEditor.getContent({format: 'text'})));

                visualContentEditor.on('keyup', function () {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(function () {

                        this.calculate('visual', this.trimContent(visualContentEditor.getContent({format: 'text'})));

                    }.bind(this), typingTimerInterval);
                }.bind(this));
            }
        }.bind(this), 1000);

        /**
         * Trigger the this.calculate function when plain text editor initializes and changes
         * @type {void}
         */
        textContentEditor = $('textarea#content');
        textContentEditor.off('keyup');
        this.calculate('text', this.trimContent(textContentEditor.val()));

        textContentEditor.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function () {

                this.calculate('text', this.trimContent(textContentEditor.val()));

            }.bind(this), typingTimerInterval);
        }.bind(this));

    };

    /**
     * Trim content before calculations
     * @param  {string} content Content to trim
     * @return {string}         Trimmed content
     */
    LixCalculator.prototype.trimContent = function(content) {
        content = content.replace(/<\/?[^>]+(>|$)/g, '');
        content = content.replace(/\t/g, '');
        return content;
    };

    /**
     * Triggers init method in each and every formula
     * @param  {string} type    Editor type (text or visual)
     * @param  {string} content Editor content
     * @return {void}
     */
    LixCalculator.prototype.calculate = function(type, content) {
        $.each(formulas, function (index, formula) {
            formula.obj.init(content);
        }.bind(this));
    };

    /**
     * Adds a formula to the lix calculator
     * @param {object} obj         The formula object
     * @param {string} title       Formula title
     * @param {string} description Formula description
     */
    LixCalculator.prototype.addFormula = function (obj, title, description) {
        $metaBox.append('\
            <div class="col" id="lix-calculator-' + this.slugify(title) +'">\
                <label>\
                    ' + title + '\
                    <small>' + description + '</small>\
                </label>\
                <em class="value">' + LixCalculatorLang.na + '</em><br>\
                <span class="value">' + LixCalculatorLang.na + '</span>\
            </div>\
        ');

        formulas.push({
            obj: obj,
            title: title,
            description: description
        });
    };

    LixCalculator.prototype.slugify = function(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    LixCalculator.prototype.getSentences = function(text) {
        return (text.trim().length > 0) ? text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g).length : 0;
    };

    return new LixCalculator();

})(jQuery);
