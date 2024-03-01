export function headline(LixCalculator) {
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

            ratio = ratio.toFixed(0);

            var ratioText = '#5DAE00';
            var ratioRating = LixCalculatorLang.paragraph.good;

            if (ratio < 1) {
                ratioText = '#FF1300';
                ratioRating = LixCalculatorLang.paragraph.low;
            }

            if (ratio == 5) {
                ratioText = '#FFB700';
                ratioRating = LixCalculatorLang.total.ok;
            }

            if (ratio >= 6) {
                ratioText = '#FF1300';
                ratioRating = LixCalculatorLang.paragraph.high;
            }

            $(target).find('span.value').html(ratio).css({
                'color': ratioText
            });

            $(target).find('em.value').html(ratioRating).css({
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
}
