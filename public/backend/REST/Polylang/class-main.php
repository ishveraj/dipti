<?php
namespace REST\Polylang;
class Main {
    public static function public_get_lang_switcher(){
        // Ensure function exist before running as recomended by polylang docs
        if ( function_exists('pll_the_languages') ){
            $postID = sanitize_text_field( $_GET['postID'] );

            // Get language switcher in array
            $getLangs = pll_the_languages([
                'post_id' => $postID,
                'raw' => 1,
            ]);

            // Get current active language
            $current_language = pll_get_post_language( $postID );

            // Remove hub from urls
            if ( !empty( $getLangs ) ) foreach ( $getLangs as $key => $cleanUp ){
                $getLangs[$key]['url'] = str_replace( '/hub/', '/', $cleanUp['url'] );
                $getLangs[$key]['current_lang'] = false;
            }

            // Set current language to true
            $getLangs[$current_language]['current_lang'] = true;

            // Return language switching links
            return [
                'langSwitcher' => $getLangs,
                'defaultLang'  => pll_default_language()
            ];
            exit;
        }

        //! Polylang function does not exist
        return ['status' => 'Language switcher does not exist'];
        exit;
    }
}