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
                this.calculate('visual', this.trimContent(visualContentEditor.getContent({format: 'text'})), visualContentEditor.getContent({format: 'html'}));

                visualContentEditor.on('keyup', function () {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(function () {

                        this.calculate('visual', this.trimContent(visualContentEditor.getContent({format: 'text'})), visualContentEditor.getContent({format: 'html'}));

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
        this.calculate('text', this.trimContent(textContentEditor.val()), wp.editor.autop(textContentEditor.val()));

        textContentEditor.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function () {

                this.calculate('text', this.trimContent(textContentEditor.val()), wp.editor.autop(textContentEditor.val()));

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
    LixCalculator.prototype.calculate = function(type, content, raw) {
        this.Formula.Total.resetTotal();

        $.each(formulas, function (index, formula) {
            formula.obj.init(content, raw);
        }.bind(this));
    };

    /**
     * Adds a formula to the lix calculator
     * @param {object}  obj         The formula object
     * @param {string}  title       Formula title
     * @param {string}  description Formula description
     * @param {integer} priority    Priority order for output
     */
    LixCalculator.prototype.addFormula = function (obj, title, description, priority) {
        if (typeof priority == 'undefined') {
            priority = 10;
        }

        var outputted = false;
        var markup = '<div class="col" id="lix-calculator-' + this.slugify(obj.formulaId) +'" data-priority="' + priority + '">\
                <label>\
                    ' + title + '\
                    <small>' + description + '</small>\
                </label>\
                <div class="values">\
                    <em class="value">' + LixCalculatorLang.na + '</em>\
                    <span class="value">' + LixCalculatorLang.na + '</span>\
                </div>\
            </div>';

        var $col = $metaBox.find('.col').filter(function() {
            return parseInt($(this).attr('data-priority')) <= priority;
        }).last();

        if (!$col.length) {
            $col = $metaBox.find('.col').filter(function() {
                return parseInt($(this).attr('data-priority')) > priority;
            }).first();

            if ($col.length) {
                $col.before(markup);
                outputted = true;
            }

            $col = {};
        }

        if (!outputted && $col.length) {
            $col.after(markup);
        } else if (!outputted) {
            $metaBox.append(markup);
        }

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
        return (text.trim().length > 0 && text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g)) ? text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g).length : 0;
    };

    LixCalculator.prototype.getParagraphs = function(text) {
        return (text.trim().length > 0 && text.trim().split(/[\r\n][\r\n]+/)) ? text.trim().split(/[\r\n][\r\n]+/).length : 0;
    };

    return new LixCalculator();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Headline = (function ($) {

    var _formulaId = 'headline';

    function Headline() {
        this.formulaId = _formulaId;
        LixCalculator.addFormula(this, LixCalculatorLang.headline.title, LixCalculatorLang.headline.description, 30);
    }

    /**
     * Initialize
     * @param  {string} content Text content to base calculations on
     * @return {void}
     */
    Headline.prototype.init = function(content, raw) {
        this.calculate(raw);
    };

    Headline.prototype.calculate = function (raw) {
        var target = '#lix-calculator-' + LixCalculator.slugify(this.formulaId);

        var params = this.getParamsFromText(raw);
        var ratio = params.paragraphs/params.headlines;

        // Paragraphs per headline (ratio) divided by prefered paragraphs per headline (4)
        var percent = ratio/4 * 100;
        LixCalculator.Formula.Total.appendTotal(percent, 100);

        var ratioBg = '#5DAE00';
        var ratioText = '#5DAE00';
        var ratioRating = LixCalculatorLang.paragraph.good;

        if (percent < 25) {
            ratioText = '#FF1300';
            ratioRating = LixCalculatorLang.paragraph.low;
        }

        if (percent >= 25 && percent < 75) {
            ratioText = '#FFDC00';
            ratioRating = LixCalculatorLang.total.ok;
        }

        if (percent >= 125) {
            ratioText = '#FF1300';
            ratioRating = LixCalculatorLang.paragraph.high;
        }

        percent = percent.toFixed(2) + '%';

        $(target).find('em.value').html(percent).css({
            'color': ratioText
        });

        $(target).find('span.value').html(ratioRating).css({
            'color': ratioText
        });
    };

    /**
     * Parse text to get lix formula paramters
     * @param  {string} text The content
     * @return {object}      Lix parameters
     */
    Headline.prototype.getParamsFromText = function(raw) {
        return {
            headlines: raw.match(/<h(\d)>(.*)?<\/h(\d)>/ig) ? raw.match(/<h(\d)>(.*)?<\/h(\d)>/ig).length + 1 : 1, // +1 since we have the post title as well
            paragraphs: raw.match(/<p>/ig) ? raw.match(/<p>/ig).length : 0,
        };
    };

    return new Headline();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Lix = (function ($) {

    var _formulaId = 'lix';

    function Lix() {
        this.formulaId = _formulaId;
        LixCalculator.addFormula(this, LixCalculatorLang.lix.title, LixCalculatorLang.lix.description, 10);
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
        var target = '#lix-calculator-' + LixCalculator.slugify(this.formulaId);

        LixCalculator.Formula.Total.appendTotal(100-lix, 100);
        lix = 100 - lix + '%';

        $(target).find('em.value').html(lix).css({
            'color': readability.textColor
        });

        $(target).find('span.value').html(readability.value).css({
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
        var textColor = '#ddd';

        if (lix < 30) {
            value = LixCalculatorLang.lix.very_easy;
            textColor = '#098400';
        } else if (lix > 29 && lix < 41) {
            value = LixCalculatorLang.lix.easy;
            textColor = '#5DAE00';
        } else if (lix > 40 && lix < 51) {
            value = LixCalculatorLang.lix.moderate;
            textColor = '#FFDC00';
        } else if (lix > 50 && lix < 61) {
            value = LixCalculatorLang.lix.hard;
            textColor = '#FF9600';
        } else if (lix > 60) {
            value = LixCalculatorLang.lix.very_hard;
            textColor = '#FF1300';
        }

        return {
            'value': value,
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
            return 100;
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
            sentences: LixCalculator.getSentences(text),
        };
    };

    return new Lix();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Moretag = (function ($) {

    var _formulaId = 'moretag';

    function Moretag() {
        this.formulaId = _formulaId;
        LixCalculator.addFormula(this, LixCalculatorLang.moretag.title, LixCalculatorLang.moretag.description, 50);
    }

    /**
     * Initialize
     * @param  {string} content Text content to base calculations on
     * @return {void}
     */
    Moretag.prototype.init = function(content, raw) {
        var target = '#lix-calculator-' + LixCalculator.slugify(this.formulaId);
        var hasMoretag = raw.match(/<!--more-->/g) ? raw.match(/<!--more-->/g).length : 0;

        var ratioText = '#5DAE00';
        var ratio = LixCalculatorLang.yes;
        var ratioRating = LixCalculatorLang.moretag.has;

        if (!hasMoretag) {
            ratioText = '#FF1300';
            ratio = LixCalculatorLang.no;
            ratioRating = LixCalculatorLang.moretag.missing;
        }

        $(target).find('em.value').html(ratio).css({
            'color': ratioText
        });

        $(target).find('span.value').html(ratioRating).css({
            'color': ratioText
        });
    };

    return new Moretag();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Paragraph = (function ($) {

    var _formulaId = 'paragraph';

    function Paragraph() {
        this.formulaId = _formulaId;
        LixCalculator.addFormula(this, LixCalculatorLang.paragraph.title, LixCalculatorLang.paragraph.description, 20);
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

    /**
     * Output paragraph calculation result
     * @param  {integer} ratio Ratio
     * @return {void}
     */
    Paragraph.prototype.output = function(ratio) {
        var target = '#lix-calculator-' + LixCalculator.slugify(this.formulaId);

        var ratioText = '#5DAE00';
        var ratioRating = LixCalculatorLang.paragraph.good;

        if (ratio < 1) {
            ratioText = '#FF1300';
            ratioRating = LixCalculatorLang.paragraph.low;
        }

        if (ratio >= 5) {
            ratioText = '#FF1300';
            ratioRating = LixCalculatorLang.paragraph.high;
        }

        ratio = ratio * 100;

        if (ratio > 100 && ratio < 500) {
            ratio = 100;
        }

        LixCalculator.Formula.Total.appendTotal(ratio, 100);

        ratio = ratio.toFixed(2) + '%';

        $(target).find('em.value').html(ratio).css({
            'color': ratioText
        });

        $(target).find('span.value').html(ratioRating).css({
            'color': ratioText
        });
    };

    /**
     * Calculate
     * @param  {integer} sentences  num sentences
     * @param  {integer} paragraphs num paragraphs
     * @return {double}             Paragraph ratio
     */
    Paragraph.prototype.calculate = function(sentences, paragraphs) {
        if (sentences == 0 && paragraphs == 0) {
            return 0;
        }

        var ratio = sentences/paragraphs;
        ratio = ratio;

        return ratio;
    };

    /**
     * Parse text to get lix formula paramters
     * @param  {string} text The content
     * @return {object}      Lix parameters
     */
    Paragraph.prototype.getParamsFromText = function(text) {
        return {
            sentences: LixCalculator.getSentences(text),
            paragraphs: LixCalculator.getParagraphs(text),
        };
    };

    return new Paragraph();

})(jQuery);

LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Total = (function ($) {

    var _formulaId = 'total';

    var totalCurrent = 0;
    var totalMax = 0;
    var totalPercent = 0;

    function Total() {
        this.formulaId = _formulaId;
        LixCalculator.addFormula(this, LixCalculatorLang.total.title, LixCalculatorLang.total.description, 1000);
    }

    /**
     * Initialize
     * @param  {string} content Text content to base calculations on
     * @return {void}
     */
    Total.prototype.init = function(content) {

    };

    Total.prototype.appendTotal = function(current, max) {
        totalCurrent = totalCurrent + current;
        totalMax = totalMax + max;

        totalPercent = (totalCurrent/totalMax) * 100;
        totalPercent = totalPercent.toFixed(2);

        this.output(totalPercent);
    };

    Total.prototype.output = function(percent) {
        var target = '#lix-calculator-' + LixCalculator.slugify(this.formulaId);

        var percentText = '#f2b127';
        var percentRating = LixCalculatorLang.total.ok;

        if (percent < 40) {
            percentText = '#FF1300';
            percentRating = LixCalculatorLang.total.bad;
        }

        if (percent >= 60) {
            percentText = '#5DAE00';
            percentRating = LixCalculatorLang.total.good;
        }

        percent = percent + '%';

        $(target).find('em.value').html(percent).css({
            'color': percentText
        });

        $(target).find('span.value').html(percentRating).css({
            'color': percentText
        });
    };

    Total.prototype.resetTotal = function() {
        totalCurrent = 0;
        totalMax = 0;
        totalPercent = 0;
    };

    return new Total();

})(jQuery);
