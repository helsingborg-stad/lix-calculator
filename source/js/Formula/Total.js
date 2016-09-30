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
