<?php
/**
 * Plugin Name:     Bob_shortcode_plugin
 * Plugin URI:      https://www.tictawf.com/bob_shortcode_plugin
 * Description:     Plugin to imitate  the googlemaps embed on wordpress.com
 * Author:          admin
 * Author URI:      https://www.tictawf.com
 * Text Domain:     bob-shortcode-plugin
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Bob_Shortcode_Plugin
 */

// Your code starts here.
function embed_googlemaps_iframe($url){
  $html = '<iframe src="' . $url[0] . '" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  return $html;
}
add_shortcode('googlemaps', 'embed_googlemaps_iframe');

//https://stackoverflow.com/questions/21785478/force-wordpress-gallery-to-use-media-file-link-instead-of-attachment-link
remove_shortcode('gallery', 'gallery_shortcode'); // removes the original shortcode
function bob_gallery_shortcode( $atts )
{
    $atts['link'] = 'file';
    $atts['size'] = 'medium';
    return gallery_shortcode( $atts );
}
add_shortcode('gallery', 'bob_gallery_shortcode');

function bob_gallery_add_scripts() {
// wp-content/plugins/bob-shortcode-plugin# 
// https://developer.wordpress.org/reference/functions/plugins_url/
    wp_register_script('bob-shortcode-plugin', plugins_url( 'bob-shortcode-plugin.js' , __FILE__ ), array(), '1.0', true);
    wp_enqueue_script('bob-shortcode-plugin');
} 
add_action( 'wp_enqueue_scripts', 'bob_gallery_add_scripts', 999 ); 

?>
