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
                this.calculate('visual', visualContentEditor.getContent({format: 'text'}));

                visualContentEditor.on('keyup', function () {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(function () {

                        this.calculate('visual', visualContentEditor.getContent({format: 'text'}));

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
        this.calculate('text', textContentEditor.val().replace(/<\/?[^>]+(>|$)/g, ""));

        textContentEditor.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function () {

                this.calculate('text', textContentEditor.val().replace(/<\/?[^>]+(>|$)/g, ""));

            }.bind(this), typingTimerInterval);
        }.bind(this));

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

    return new LixCalculator();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Lix = (function ($) {

    function Lix() {
        LixCalculator.addFormula(this, LixCalculatorLang.lix.title, LixCalculatorLang.lix.description);
    }

    /**
     * Initialize
     * @param  {string} content Text content to base calculations on
     * @return {void}
     */
    Lix.prototype.init = function(content) {
        var lixParams = this.getParamsFromText(content);
        var lixValue = this.calculate(lixParams.words, lixParams.longWords, lixParams.sentences);
        var readability = this.getReadability(lixValue);

        this.output(lixValue, readability);
    };

    /**
     * Output
     * @param  {integer} lix         Lix value
     * @param  {object}  readability Readability
     * @return {void}
     */
    Lix.prototype.output = function(lix, readability) {
        var target = '#lix-calculator-' + LixCalculator.slugify(LixCalculatorLang.lix.title);

        $(target).find('em.value').html(lix).css({
            'backgroundColor': readability.bgColor,
            'color': readability.textColor
        });

        $(target).find('span.value').html(readability.value).css({
            'backgroundColor': readability.bgColor,
            'color': readability.textColor
        });
    };

    /**
     * Get readability string and style from lix value
     * @param  {ingeger} lix Lix value
     * @return {object}
     */
    Lix.prototype.getReadability = function(lix) {
        var value = LixCalculatorLang.na;
        var bgColor = '#ddd';
        var textColor = '#000';

        if (lix < 30) {
            value = LixCalculatorLang.lix.very_easy;
            bgColor = '#098400';
            textColor = '#fff';
        } else if (lix > 29 && lix < 41) {
            value = LixCalculatorLang.lix.easy;
            bgColor = '#5DAE00';
            textColor = '#fff';
        } else if (lix > 40 && lix < 51) {
            value = LixCalculatorLang.lix.moderate;
            bgColor = '#FFDC00';
            textColor = '#000';
        } else if (lix > 50 && lix < 61) {
            value = LixCalculatorLang.lix.hard;
            bgColor = '#FF9600';
            textColor = '#000';
        } else if (lix > 60) {
            value = LixCalculatorLang.lix.very_hard;
            bgColor = '#FF1300';
            textColor = '#fff';
        }

        return {
            'value': value,
            'bgColor': bgColor,
            'textColor': textColor
        };
    };

    /**
     * Calculate the actual formula based on input
     * @param  {integer} words     Number of words in text
     * @param  {integer} longWords Number of long words (7+ characters)
     * @param  {integer} sentences Number of sentences
     * @return {double}            Lix value
     */
    Lix.prototype.calculate = function(words, longWords, sentences) {
        if (words === 0) {
            return LixCalculatorLang.na;
        }

        var lix = (words/sentences) + ((longWords/words) * 100);
        return lix.toFixed(2);
    };

    /**
     * Parse text to get lix formula paramters
     * @param  {string} text The content
     * @return {object}      Lix parameters
     */
    Lix.prototype.getParamsFromText = function(text) {
        return {
            // Words in text
            words: (text.trim().length > 0 && text.trim().match(/\S+/g) !== null) ? text.trim().match(/\S+/g).length : 0,

            // Long words (7 or more characters) in text
            longWords: (text.trim().length > 0 && text.trim().match(/(\S+){7,}/g) !== null) ? text.trim().match(/[\S+]{7,}/g).length : 0,

            // Sentences in text
            sentences: (text.trim().length > 0) ? text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g).length : 0,
        };
    };

    return new Lix();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Paragraph = (function ($) {

    function Paragraph() {
        LixCalculator.addFormula(this, LixCalculatorLang.paragraph.title, LixCalculatorLang.paragraph.description);
    }

    /**
     * Initialize
     * @param  {string} content Text content to base calculations on
     * @return {void}
     */
    Paragraph.prototype.init = function(content) {
        var params = this.getParamsFromText(content);
        var ratio = this.calculate(params.sentences, params.paragraphs);

        this.output(ratio);
    };

    Paragraph.prototype.output = function(ratio) {
        var target = '#lix-calculator-' + LixCalculator.slugify(LixCalculatorLang.paragraph.title);

        if (ratio == 'NaN') {
            $(target).find('.value').html(LixCalculatorLang.na).attr('style', '');
            return;
        }

        var ratioBg = '#5DAE00';
        var ratioText = '#fff';
        var ratioRating = LixCalculatorLang.paragraph.good;

        if (ratio < 1) {
            ratioBg = '#FF1300';
            ratioText = '#fff';
            ratioRating = LixCalculatorLang.paragraph.low;
        }

        if (ratio >= 5) {
            ratioBg = '#FF1300';
            ratioText = '#fff';
            ratioRating = LixCalculatorLang.paragraph.high;
        }

        $(target).find('em.value').html(ratio).css({
            'backgroundColor': ratioBg,
            'color': ratioText
        });

        $(target).find('span.value').html(ratioRating).css({
            'backgroundColor': ratioBg,
            'color': ratioText
        });
    };

    Paragraph.prototype.calculate = function(sentences, paragraphs) {
        var ratio = sentences/paragraphs;
        ratio = ratio.toFixed(2);

        return ratio;
    };

    /**
     * Parse text to get lix formula paramters
     * @param  {string} text The content
     * @return {object}      Lix parameters
     */
    Paragraph.prototype.getParamsFromText = function(text) {
        return {
            sentences: (text.trim().length > 0) ? text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g).length : 0,
            paragraphs: (text.trim().length > 0) ? text.trim().split(/[\r\n]+/).length : 0,
        };
    };

    return new Paragraph();

})(jQuery);
