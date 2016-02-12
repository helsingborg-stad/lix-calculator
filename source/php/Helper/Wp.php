<?php

namespace LixCalculator\Helper;

class Wp
{
    /**
     * Datermines if we're on add or edit page in wp admin
     * @param  mixed    $type    (false, new or edit) Check for specific new/edit type
     * @return boolean
     */
    public static function isAdminEditPage($type = false)
    {
        global $pagenow;

        //make sure we are on the backend
        if (!is_admin()) {
            return false;
        }

        if (!$type) {
            return in_array($pagenow, array('post.php', 'post-new.php'));
        }

        switch ($type) {
            case 'new':
                return in_array($pagenow, array('post-new.php'));
                break;

            case 'edit':
                return in_array($pagenow, array('post.php'));
                break;
        }

        return false;
    }

    /**
     * Tries to get the template path
     * Checks the plugin's template folder, the parent theme's templates folder and the current theme's template folder
     * @param  string  $prefix The filename without prefix
     * @param  string  $slug   The directory
     * @param  boolean $error  Show errors or not
     * @return string          The path to the template to use
     */
    public static function getTemplate($template, $error = true)
    {
        $paths = apply_filters('LixCalculator/TemplatePath', array(
            get_stylesheet_directory() . '/templates/',
            get_template_directory() . '/templates/',
            LIXCALCULATOR_PATH . 'templates/',
        ));

        $prefix = apply_filters('LixCalculator/TemplatePrefix', 'lix');

        foreach ($paths as $path) {
            $file = $path . $prefix . '-' . $template . '.php';

            if (file_exists($file)) {
                return $file;
            }
        }

        error_log('Lix Calculator: Template ' . $prefix . '-' . $template . '.php' . ' not found in any of the paths: ' . var_export($paths, true));

        if ($error) {
            trigger_error('Lix Calculator: Template ' . $prefix . '-' . $template . '.php' . ' not found in any of the paths: ' . var_export($paths, true), E_USER_WARNING);
        }
    }
}
