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
