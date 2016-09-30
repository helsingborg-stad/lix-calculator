LixCalculator = LixCalculator || {};
LixCalculator.Formula = LixCalculator.Formula || {};

LixCalculator.Formula.Headline = (function ($) {

    function Headline() {
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
        var target = '#lix-calculator-' + LixCalculator.slugify(LixCalculatorLang.headline.title);

        var params = this.getParamsFromText(raw);
        var ratio = params.paragraphs/params.headlines;

        // Paragraphs per headline (ratio) divided by prefered paragraphs per headline (4)
        var percent = ratio/4 * 100;
        LixCalculator.Formula.Total.appendTotal(percent, 100);

        var ratioBg = '#5DAE00';
        var ratioText = '#fff';
        var ratioRating = LixCalculatorLang.paragraph.good;

        if (percent < 50) {
            ratioBg = '#FF1300';
            ratioText = '#fff';
            ratioRating = LixCalculatorLang.paragraph.low;
        }

        if (percent >= 110) {
            ratioBg = '#FF1300';
            ratioText = '#fff';
            ratioRating = LixCalculatorLang.paragraph.high;
        }

        percent = percent.toFixed(2) + '%';

        $(target).find('em.value').html(percent).css({
            'backgroundColor': ratioBg,
            'color': ratioText
        });

        $(target).find('span.value').html(ratioRating).css({
            'backgroundColor': ratioBg,
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
            headlines: raw.match(/<h(\d)>(.*)?<\/h(\d)>/ig).length + 1, // +1 since we have the post title as well
            paragraphs: raw.match(/<p>/ig).length,
        };
    };

    return new Headline();

})(jQuery);
