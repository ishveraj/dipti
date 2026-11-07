<?php
namespace REST\Site;

class Pages {
    //* Clear cache
    public static function admin_get_clear_cache(){
        global $wpdb;
        $options_table = $wpdb->prefix . 'options';

        $stmt = $wpdb->prepare("DELETE FROM `$options_table` WHERE option_name LIKE %s", '_neo_cache_%');
        $result = $wpdb->query( $stmt );

        if ( $result !== false && $result > 0 ) return ['err' => $result . ' cache cleared'];
        else return ['err' => 'No cache found'];

        exit;
    }
}