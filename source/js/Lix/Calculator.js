LixCalculator = LixCalculator || {};
LixCalculator.Lix = LixCalculator.Lix || {};

LixCalculator.Lix.Calculator = (function ($) {

    var target = '#lix-calculator-content';

    var typingTimer;
    var typingTimerInterval = 500;

    function Calculator() {
        this.bindEvents();
    }

    /**
     * Binds the lix calculator to the content editor and triggers calculation when text changes
     * @return {void}
     */
    Calculator.prototype.bindEvents = function () {
        $(window).load(function () {
            if ($('#content').length === 0) {
                return;
            }

            var contentEditor = tinymce.get('content');
            this.calculateAndOutput(contentEditor.getContent({format: 'text'}));

            contentEditor.on('keyup', function () {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () {
                    this.calculateAndOutput(contentEditor.getContent({format: 'text'}));
                }.bind(this), typingTimerInterval);
            }.bind(this));

        }.bind(this));
    };

    /**
     * Updates the lix value based on given text
     * @param  {string} text Text
     * @return {void}
     */
    Calculator.prototype.calculateAndOutput = function (text) {
        var data = this.parseText(text);
        var lix = this.calculate(data.words, data.longWords, data.sentences);

        var wordFrequency = this.getWordFrequency(text);

        this.output(lix);
    };

    /**
     * Gets the word frequency as an array "word" => "occurances"
     * @param  {string} text The text to analyse
     * @return {object}
     */
    Calculator.prototype.getWordFrequency = function(text) {
        text = text.toLowerCase();

        var words = text.split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/);
        var frequency = [];

        $.each(words, function (index, word) {
            if (word.length < 2) {
                return;
            }

            if (frequency[word]) {
                frequency[word].count++;
            } else {
                frequency[word] = {
                    word: word,
                    count: 1
                };
            }
        });

        return frequency;
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
        if (words == 0) {
            return LixCalculatorLang.na;
        }

        var lix = (words/sentences) + ((longWords/words) * 100);
        return lix.toFixed(2);
    };

    Calculator.prototype.getReadability = function (lix) {
        useParentheses = typeof useParentheses !== 'undefined' ? useParentheses : false;
        useColor = typeof useColor !== 'undefined' ? useColor : false;

        var value = LixCalculatorLang.na;
        var bgColor = '#ddd';
        var textColor = '#000';

        if (lix < 30) {
            value = LixCalculatorLang.very_easy;
            bgColor = '#098400';
            textColor = '#fff';
        } else if (lix > 29 && lix < 41) {
            value = LixCalculatorLang.easy;
            bgColor = '#5DAE00';
            textColor = '#fff';
        } else if (lix > 40 && lix < 51) {
            value = LixCalculatorLang.moderate;
            bgColor = '#FFDC00';
            textColor = '#000';
        } else if (lix > 50 && lix < 61) {
            value = LixCalculatorLang.hard;
            bgColor = '#FF9600';
            textColor = '#000';
        } else if (lix > 60) {
            value = LixCalculatorLang.very_hard;
            bgColor = '#FF1300';
            textColor = '#fff';
        }

        return {
            'value': value,
            'bgColor': bgColor,
            'textColor': textColor
        };
    };

    Calculator.prototype.output = function (lix) {
        var readability = this.getReadability(lix);

        $(target).find('.value.lix').html(lix).css({
            'backgroundColor': readability.bgColor,
            'color': readability.textColor
        });

        $(target).find('.value.readability').html(readability.value).css({
            'backgroundColor': readability.bgColor,
            'color': readability.textColor
        });
    };

    return new Calculator();

})(jQuery);
