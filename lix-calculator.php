<?php

/*
 * Plugin Name: Lix Calculator
 * Plugin URI: https://github.com/helsingborg-stad/lix-calculator
 * Description: A plugin that calculates a posts lix value.
 * Version: 1.0.0
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

require_once LIXCALCULATOR_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
//require_once KLARSPRAK_PATH . 'Public.php';

// Instantiate and register the autoloader
$loader = new LixCalculator\Vendor\Psr4ClassLoader();
$loader->addPrefix('LixCalculator', LIXCALCULATOR_PATH);
$loader->addPrefix('LixCalculator', LIXCALCULATOR_PATH . 'source/php/');
$loader->register();

// Start application
new LixCalculator\App();
