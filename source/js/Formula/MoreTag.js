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
