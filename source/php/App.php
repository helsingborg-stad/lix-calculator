<?php

namespace Klarsprakskontroll;

class App
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueue'));
    }

    public function enqueue()
    {
        if (\Klarsprakskontroll\Helper\Wp::isAdminEditPage()) {
            wp_enqueue_style('klarsprakskontroll', KLARSPRAKSKONTROLL_URL . '/dist/css/klarsprakskontroll.dev.css');
            wp_enqueue_script('klarsprakskontroll', KLARSPRAKSKONTROLL_URL . '/dist/js/klarsprakskontroll.dev.js', array(), '1.0.0', true);
        }
    }
}
