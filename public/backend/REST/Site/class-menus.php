<?php
namespace REST\Site;

// Only supports 2 levels for now
class Menus {
    public static function public_get_list_menus(){
        $all_menus = get_nav_menu_locations();

         //* Multilanguage Polylang for menus
         // Check if pll exist first to ensure plugin is running
         if ( function_exists('pll_languages_list') ){
            $get_polylang_options = get_option( 'polylang' );
            if ( 
                !empty( $get_polylang_options ) &&
                !empty( $get_polylang_options['nav_menus'][WP_DEFAULT_THEME] )
            ){
                $all_menus = $get_polylang_options['nav_menus'][WP_DEFAULT_THEME];
            }
        }

        if ( !empty( $all_menus ) ) foreach ( $all_menus as $navbar_key => $temp_all_menu ){
            // go to next if empty
            if ( 
                empty( $temp_all_menu ) ||
                ( is_array( $temp_all_menu ) && in_array( 0, $temp_all_menu, true ) )
            ){
                continue; 
            }

            $all_menu = array(); // empty array when new loop

            // single lang site
            if ( !is_array( $temp_all_menu ) ){
                $all_menu[] = $temp_all_menu; 
                $is_multi_lang = FALSE;
            }
            // multi lang site
            else {
                $all_menu = $temp_all_menu; 
                $is_multi_lang = TRUE;
            }

            if ( !empty( $all_menu ) ) foreach ( $all_menu as $key => $am ){
                $menu = wp_get_nav_menu_items( $am );
                if ( !$is_multi_lang ) $key = $navbar_key; // overide key if single

                $tree = array();
                $references = array();

                // 1. Create a map of all items. 
                // We use the ID as the key so we can find any item instantly.
                foreach ($menu as $item) {
                    $references[$item->object_id] = [
                        'id'       => $item->object_id,
                        'label'    => html_entity_decode($item->title),
                        'slug'     => $item->url,
                        'class'    => !empty($item->classes) ? implode(' ', (array)$item->classes) : '',
                        'has_children' => false,
                        'children' => []
                    ];
                }

                foreach ($menu as $item) {
                    $parentId = (int) $item->menu_item_parent;

                    if ($parentId === 0) {
                        // Top level: add a reference to the main tree
                        $tree[] = &$references[$item->object_id];
                    } else {
                        // Child: find the parent in our map and add a reference to the children array
                        $newparentId = current(array_filter($menu, function($item) use ($parentId){
                            return $item->ID == $parentId;
                        }));

                        if (isset($references[$newparentId->object_id])) {
                            $references[$newparentId->object_id]['has_children'] = true;
                            $references[$newparentId->object_id]['children'][] = &$references[$item->object_id];
                        }
                    }
                }

                // Final result for your specific variable
                $menu_lists[$key] = $tree;
            }

            // For multi lang reassign navbar theme location name
            if ( $is_multi_lang ){
                $merge_lists[ $navbar_key ] = $menu_lists;
                $menu_lists = $merge_lists;
            }
        }

        //* Get all pages
        // Multi lang
        if ( function_exists('pll_languages_list') ){
            // Get existing languages in CMS
            $existing_languages = pll_languages_list();

            if ( !empty( $existing_languages ) ) foreach ( $existing_languages as $el ){
                $page_query = get_posts([
                    'numberposts' => -1,
                    'post_type'   => 'page',
                    'lang'        => $el,
                ]);

                if ( !empty( $page_query ) ) foreach ( $page_query as $page ){
                    $pages[ get_page_template_slug( $page->ID ) ][$el] = get_the_permalink( $page->ID );
                }
            }
        }
        // Single lang
        else {
            $page_query = get_posts([
                'numberposts' => -1,
                'post_type'   => 'page',
            ]);

            if ( !empty( $page_query ) ) foreach ( $page_query as $page ){
                $pages[ get_page_template_slug( $page->ID ) ] = get_the_permalink( $page->ID );
            }
        }

        $menus['menus'] = $menu_lists ?? null;
        $menus['pages'] = $pages;
        return $menus;
        exit;
    }
}