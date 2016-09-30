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
