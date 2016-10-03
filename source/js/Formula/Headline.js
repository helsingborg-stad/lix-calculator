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
