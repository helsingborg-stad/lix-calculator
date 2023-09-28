<?php

/*
 * Plugin Name: Lix Calculator
 * Plugin URI: https://github.com/helsingborg-stad/lix-calculator
 * Description: A plugin that calculates a posts lix value.
 * Version: 4.0.2
 * Author: Kristoffer Svanmark
 * Author URI: https://github.com/helsingborg-stad
 * Text Domain: lix-calculator
 *
 * Copyright (C) 2015
 */

define('LIXCALCULATOR_PATH', plugin_dir_path(__FILE__));
define('LIXCALCULATOR_URL', plugins_url('', __FILE__));

define('LIXCALCULATOR_TEMPLATE_PATH', LIXCALCULATOR_PATH . 'templates/');

load_plugin_textdomain('lix-calculator', false, plugin_basename(dirname(__FILE__)) . '/languages');

// Autoload from plugin
if (file_exists(LIXCALCULATOR_PATH . 'vendor/autoload.php')) {
    require_once LIXCALCULATOR_PATH . 'vendor/autoload.php';
}

// Start application
new LixCalculator\App();
