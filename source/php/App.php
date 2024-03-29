<?php

namespace LixCalculator;

class App
{
    private $cacheBust;

    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));
        add_action('add_meta_boxes', array($this, 'addMetaBox'));

        $this->cacheBust = new \LixCalculator\Helper\CacheBust();
    }

    public function enqueueScripts() 
    {
        wp_register_style(
            'lix-calculator-css',
            LIXCALCULATOR_URL . '/dist/' .
            $this->cacheBust->name('css/lix-calculator.css')
        );

        wp_enqueue_style('lix-calculator-css');

        wp_register_script(
            'lix-calculator-js',
            LIXCALCULATOR_URL . '/dist/' .
            $this->cacheBust->name('js/lix-calculator.js'),
            array(), '1.0.0', true
        );

        wp_localize_script('lix-calculator-js', 'LixCalculatorLang', $this->getJsLang());
        wp_enqueue_script('lix-calculator-js');
    }

    private function getJsLang() 
    {
        return array(
            'lix' => array(
                'title' => __('Readability', 'lix-calculator'),
                'description' => __('Lix value (lower is better)', 'lix-calculator'),
                'very_hard' => __('Very hard', 'lix-calculator'),
                'hard' => __('Hard', 'lix-calculator'),
                'moderate' => __('Moderate', 'lix-calculator'),
                'easy' => __('Easy', 'lix-calculator'),
                'very_easy' => __('Very easy', 'lix-calculator'),
            ),

            'paragraph' => array(
                'title' => __('Paragrah ratio', 'lix-calculator'),
                'description' => __('Sentences per paragraph', 'lix-calculator'),
                'good' => __('Good', 'lix-calculator'),
                'low' => __('Low', 'lix-calculator'),
                'high' => __('High', 'lix-calculator')
            ),

            'headline' => array(
                'title' => __('Headline ratio', 'lix-calculator'),
                'description' => __('Paragraphs per headline', 'lix-calculator')
            ),

            'moretag' => array(
                'title' => __('Has more-tag', 'lix-calculator'),
                'description' => __('Yes or no', 'lix-calculator'),
                'missing' => __('Missing more-tag', 'lix-calculator'),
                'has' => __('Has more-tag', 'lix-calculator')
            ),

            'total' => array(
                'title' => __('Total', 'lix-calculator'),
                'description' => __('Total score', 'lix-calculator'),
                'bad' => __('Bad', 'lix-calculator'),
                'ok' => __('Ok', 'lix-calculator'),
                'good' => __('Good', 'lix-calculator')
            ),

            'yes' => __('Yes'),
            'no' => __('No'),
            'na' => __('n/a', 'lix-calculator')
        );
    }

    public function enqueue()
    {
        if (\LixCalculator\Helper\Wp::isAdminEditPage()) {
            wp_enqueue_style('lix-calculator', LIXCALCULATOR_URL . '/dist/css/lix-calculator.min.css');

            wp_register_script('lix-calculator', LIXCALCULATOR_URL . '/dist/js/lix-calculator.dev.js', array(), '1.0.0', true);
            wp_localize_script('lix-calculator', 'LixCalculatorLang', array(
                'lix' => array(
                    'title' => __('Readability', 'lix-calculator'),
                    'description' => __('Lix value (lower is better)', 'lix-calculator'),
                    'very_hard' => __('Very hard', 'lix-calculator'),
                    'hard' => __('Hard', 'lix-calculator'),
                    'moderate' => __('Moderate', 'lix-calculator'),
                    'easy' => __('Easy', 'lix-calculator'),
                    'very_easy' => __('Very easy', 'lix-calculator'),
                ),

                'paragraph' => array(
                    'title' => __('Paragrah ratio', 'lix-calculator'),
                    'description' => __('Sentences per paragraph', 'lix-calculator'),
                    'good' => __('Good', 'lix-calculator'),
                    'low' => __('Low', 'lix-calculator'),
                    'high' => __('High', 'lix-calculator')
                ),

                'headline' => array(
                    'title' => __('Headline ratio', 'lix-calculator'),
                    'description' => __('Paragraphs per headline', 'lix-calculator')
                ),

                'moretag' => array(
                    'title' => __('Has more-tag', 'lix-calculator'),
                    'description' => __('Yes or no', 'lix-calculator'),
                    'missing' => __('Missing more-tag', 'lix-calculator'),
                    'has' => __('Has more-tag', 'lix-calculator')
                ),

                'total' => array(
                    'title' => __('Total', 'lix-calculator'),
                    'description' => __('Total score', 'lix-calculator'),
                    'bad' => __('Bad', 'lix-calculator'),
                    'ok' => __('Ok', 'lix-calculator'),
                    'good' => __('Good', 'lix-calculator')
                ),

                'yes' => __('Yes'),
                'no' => __('No'),
                'na' => __('n/a', 'lix-calculator')
            ));

            wp_enqueue_script('lix-calculator');
        }
    }

    public function addMetaBox()
    {
        $postTypes = get_post_types();
        $postTypes = array_filter($postTypes, function ($item) {
            return post_type_supports($item, 'editor');
        });

        add_meta_box(
            'lix-calculator',
            __('Readability', 'lix-calculator'),
            function () {
                include \LixCalculator\Helper\Wp::getTemplate('metabox');
            },
            array_keys($postTypes),
            'normal',
            'high',
            null
        );
    }
}
