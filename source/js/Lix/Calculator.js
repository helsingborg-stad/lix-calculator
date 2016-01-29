Klarsprakskontroll = Klarsprakskontroll || {};
Klarsprakskontroll.Lix = Klarsprakskontroll.Lix || {};

Klarsprakskontroll.Lix.Calculator = (function ($) {

    function Calculator() {
        this.init();
        this.bindEvents();
    }

    Calculator.prototype.init = function () {
        $('#post-status-info tr').prepend('<td id="wp-lix-info">Lix: <span id="wp-lix-value"></span></td>');
    };

    /**
     * Binds the lix calculator to the content editor and triggers calculation when text changes
     * @return {void}
     */
    Calculator.prototype.bindEvents = function () {
        $(window).load(function () {
            var contentEditor = tinymce.get('content');

            var text = contentEditor.getContent({format: 'text'});
            var data = this.parseText(text);
            var lix = this.calculate(data.words, data.longWords, data.sentences);

            this.output(lix);

            contentEditor.on('input', function () {
                text = contentEditor.getContent({format: 'text'});
                data = this.parseText(text);
                lix = this.calculate(data.words, data.longWords, data.sentences);

                this.output(lix);
            }.bind(this));
        }.bind(this));
    };

    /**
     * Parses a text to get the parameters needed to calculate a lix value
     * @param  {string} text         The text to parse
     * @return {object}
     */
    Calculator.prototype.parseText = function (text) {
        if (!text) {
            return {
                'characters': 0,
                'words': 0,
                'longWords': 0,
                'sentences': 0
            };
        }

        return {
            // Characters in text
            'characters': text.length,

            // Words in text
            'words': text.trim().match(/\S+/g).length,

            // Long words (7 or more characters) in text
            'longWords': (text.trim().match(/(\S+){7,}/g) != null) ? text.trim().match(/[\S+]{7,}/g).length : 0,

            // Sentences in text
            'sentences': text.trim().match(/([^\.\!\?]+[\.\?\!]*)/g).length
        };
    };

    /**
     * Calculate the lix value
     * @param  {integer} words      Word count
     * @param  {integer} longWords  Long word count (more than 6 characters)
     * @param  {integer} sentences  Sentences count
     * @return {double}             The lix value
     */
    Calculator.prototype.calculate = function (words, longWords, sentences) {
        var lix = (words/sentences) + ((longWords/words) * 100);
        return lix.toFixed(2);
    };

    Calculator.prototype.getCategory = function (lix, useParentheses, useColor) {
        useParentheses = typeof useParentheses !== 'undefined' ? useParentheses : false;
        useColor = typeof useColor !== 'undefined' ? useColor : false;

        var value;
        var color;

        if (lix < 30) {
            value = 'Mycket lättläst';
            color = '#098400';
        } else if (lix >= 30 && lix <= 39) {
            value = 'Lättläst';
            color = '#5DAE00';
        } else if (lix >= 40 && lix <= 49) {
            value = 'Medelsvår';
            color = '#FFDC00';
        } else if (lix >= 50 && lix <= 59) {
            value = 'Svår';
            color = '#FF9600';
        } else if (lix >= 60) {
            value = 'Mycket svår';
            color = '#FF1300';
        }

        if (useParentheses === true) {
            value = '(' + value + ')';
        }

        if (useColor === true) {
            value = '<em style="background-color:' + color + '">' + value + '</em>';
        }

        return value;
    };

    Calculator.prototype.output = function (lix) {
        $('#wp-lix-value').html(lix + ' ' + this.getCategory(lix, false, true));
    };

    return new Calculator();

})(jQuery);
