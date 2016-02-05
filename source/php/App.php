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
            wp_enqueue_style('lix-calculator', LIXCALCULATOR_URL . '/dist/css/lix-calculator.dev.css');
            wp_enqueue_script('lix-calculator', LIXCALCULATOR_URL . '/dist/js/lix-calculator.dev.js', array(), '1.0.0', true);
        }
    }

    public function addMetaBox()
    {
        add_meta_box(
            'lix-calculator',
            'Lix',
            function () {
                include \LixCalculator\Helper\Wp::getTemplate('metabox');
            },
            array('post', 'page'),
            'normal',
            'high',
            null
        );
    }
}
