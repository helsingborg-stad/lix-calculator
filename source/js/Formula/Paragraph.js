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
