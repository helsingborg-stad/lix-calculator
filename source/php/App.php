<?php

namespace LixCalculator;

class App
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueue'));
        add_action('add_meta_boxes', array($this, 'addMetaBox'));
    }

    public function enqueue()
    {
        if (\LixCalculator\Helper\Wp::isAdminEditPage()) {
            wp_enqueue_style('lix-calculator', LIXCALCULATOR_URL . '/dist/css/lix-calculator.min.css');

            wp_register_script('lix-calculator', LIXCALCULATOR_URL . '/dist/js/lix-calculator.dev.js', array(), '1.0.0', true);
            wp_localize_script('lix-calculator', 'LixCalculatorLang', array(
                'very_hard' => __('Very hard', 'lix-calculator'),
                'hard' => __('Hard', 'lix-calculator'),
                'moderate' => __('Moderate', 'lix-calculator'),
                'easy' => __('Easy', 'lix-calculator'),
                'very_easy' => __('Very easy', 'lix-calculator'),
                'na' => __('n/a', 'lix-calculator'),
                'good' => __('Good', 'lix-calculator'),
                'low' => __('Low', 'lix-calculator'),
                'high' => __('High', 'lix-calculator')
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
