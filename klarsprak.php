<?php

/*
 * Plugin Name: Klarspråkskontroll
 * Plugin URI: -
 * Description: A plugin to validate post content agains the Helsingborg Stad Klarspråk policy
 * Version: 0.1
 * Author: Kristoffer Svanmark
 * Author URI: -
 *
 * Copyright (C) 2015
 */

define('KLARSPRAKSKONTROLL_PATH', plugin_dir_path(__FILE__));
define('KLARSPRAKSKONTROLL_URL', plugins_url('', __FILE__));

define('KLARSPRAKSKONTROLL_TEMPLATE_PATH', KLARSPRAKSKONTROLL_PATH . 'templates/');

load_plugin_textdomain('klarsprakskontroll', false, plugin_basename(dirname(__FILE__)) . '/languages');

require_once KLARSPRAKSKONTROLL_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
//require_once KLARSPRAK_PATH . 'Public.php';

// Instantiate and register the autoloader
$loader = new Klarsprak\Vendor\Psr4ClassLoader();
$loader->addPrefix('Klarsprakskontroll', KLARSPRAKSKONTROLL_PATH);
$loader->addPrefix('Klarsprakskontroll', KLARSPRAKSKONTROLL_PATH . 'source/php/');
$loader->register();

// Start application
new Klarsprakskontroll\App();
