<?php
namespace Engine\Cache;
class Main {

    function __construct(){
        //* When a post is updated or published
        // use do_action( 'acf/save_post', $postID ); to trigger this manually
        // update_field will NOT trigger cache
        // hence must trigger manually using do_action
        add_action( 'acf/save_post', function( $postid ){
            self::createCache( $postid );
        });

        //* When scheduled post are published
        add_action('future_to_publish', function( $post ){
            self::createCache( $post->ID );
        });

        //! Remove cache file when delete post is executed (to trash)
        // Runs code before the post is trashed
        add_action( 'wp_trash_post', function( $postid ){
            // Stop if post type is user
            if ( strpos( $postid, 'user_' ) !== false ) return FALSE;

            // Run only if its page or CPT
            if ( $postid != 'site-settings' ){
                $post = get_post( $postid ); // Get the post details

                // Stop if no post data
                if ( empty( $post ) ) return FALSE;

                // Get filename
                $getFileName_Canonical = self::getFileName_Canonical( get_the_permalink( $postid ) );
                $useFileName = $getFileName_Canonical['useFileName'];

                //! Delete the cache file
                delete_option( '_neo_cache_' . $useFileName );
            }
        });
    }

    //* Set default filename & canonical URL
    private static function getFileName_Canonical( $theURL ){
        // Remove first / if exist
        if ( $theURL[0] === '/' ){
            $return['useFileName'] = ltrim( $theURL, '/' );
            $return['meta_canonical'] = SITE_URL . $theURL;
        }
        // Remove site URL with first /
        else {
            $return['useFileName'] = str_replace( SITE_URL . '/', '', $theURL );
            $return['meta_canonical'] = $theURL;
        }

        return $return;
    }

    //* Generate configuration files when saving site settings
    private static function generateConfigFiles( $args ){
        //* Generate manifest
        $config_savePath = get_template_directory() . '/../../../../' . 'manifest.json';
        $config_f = fopen( $config_savePath , "w" );
        $config_content = [
            'start_url' => 
                str_replace(
                    'https://' . $_SERVER['SERVER_NAME'], '', 
                    SITE_URL
                )
             . '/',
            'name' => $args['manifest']['name'],
            'short_name' => 'PWA App',
            'description' => 'Run this app locally',
            'background_color' => "#000000",
            'theme_color' => "#212121",
            'icons' => [
                [
                    'src' => $args['manifest']['favicon'],
                    'sizes' => '512x512',
                    'type' => $args['manifest']['type'],
                ]
            ],
            'display' => 'standalone'
        ];
        fwrite( $config_f , json_encode( $config_content ) );
        fclose( $config_f );
    }

    /**
     * $useFilename derived from slugs of posts
     * $useComponent derived from page template OR CPT slug
     * @param $postid
     *   - can be page, CPT, site-settings
     * @param $return
     *   - TRUE means frontend request to API
     *   - FALSE means it is a CMS update
     */
    public static function createCache( $postid, $return = FALSE ){
        // Decides if cache should be created
        $create_cache = TRUE; 
                
        //* For site-settings
        if ( $postid === 'site-settings' ){
            $useFileName = 'site_settings';
            $acf_default_site_settings = get_fields( $postid ); // get default site settings

            // Get site settings data if multi lang
            if ( function_exists('pll_languages_list') ){
                $acf_multi_lang_site_settings = array();

                // Get existing languages in locale format (e.g en_EN) for ACF
                $languages = pll_languages_list(['fields' => 'locale']);
                if ( !empty( $languages ) ) foreach ( $languages as $l ){
                    $hasValue = get_fields( $postid . '_' . $l );
                    $acf_multi_lang_site_settings[explode('_', $l)[0]] = !empty( $hasValue ) ? $hasValue : $acf_default_site_settings;
                }
            }
        }
        //* For pages & CPT
        else {
            $post = get_post( $postid ); // Get the post details

            //! Stop if no post data or data not type page/CPT
            if ( 
                empty( $post ) 
                || (
                    $post->post_type !== 'page' 
                    && $post->post_type !== 'post' 
                    && strpos( $post->post_type, 'cpt_' ) === false
                )
            ) return FALSE;

            //* Set default page component
            $useComponent = get_page_template_slug( $postid ); // derived from page template

            //* Set default filename & canonical URL
            $get_the_permalink = get_the_permalink( $postid );
            $getFileName_Canonical = self::getFileName_Canonical( $get_the_permalink );
            $useFileName = $getFileName_Canonical['useFileName'];
            $meta_canonical = $getFileName_Canonical['meta_canonical'];

            //! Stop if file is of type trash
            if ( strpos( $useFileName, '__trashed' ) !== false ){
                return FALSE;
            }

            //* Reset filename for front page since there is no slug
            if ( 
                get_option('page_on_front') == $postid &&
                str_replace( SITE_URL, '', $get_the_permalink ) === '/'
            ){
                $useFileName = 'front_page';
            }
            //* Set component for CPT
            elseif ( $post->post_type != 'page' ){
                // Derived from CPT slug
                $useComponent =  ucwords( $post->post_type, '_' );

                //! Stop if REST API disabled or partial return
                $post_type = get_post_type_object( $post->post_type );
                $create_cache = $post_type->show_in_rest;
                if ( !$create_cache ){
                    // CMS process, hence return false to do nothing
                    if ( !$return ) return false;

                    // API requests, hence return partial data
                    if ( $return === 'partial' ){
                        $meta = get_field('meta', $post->ID);
                        $meta['title'] = $meta['title'] ?: $post->post_title;
                        $meta['canonical'] = $meta_canonical;

                        $return_partial = [
                            'meta' => $meta,
                            'post_details' => $post,
                            'component' => $useComponent
                        ];
                        return $return_partial;
                    }
                }

                
            }
        }

        //* Get acf fields
        // setup site settings config files
        if ( $postid === 'site-settings' ){
            $acf = $acf_default_site_settings;
            $manifest_name = $acf['site_settings']['sitename'];
            $manifest_favicon = $acf['site_settings']['favicon']['url'];
            $manifest_favicon_type = $acf['site_settings']['favicon']['mime_type'];

            // IF multi lang set
            if ( !empty( $acf_multi_lang_site_settings ) ){
                $acf = $acf_multi_lang_site_settings;
                if ( !empty( $acf ) ) foreach ( $acf as $a ){
                    $manifest_name = $a['site_settings']['sitename'];
                    $manifest_favicon = $a['site_settings']['favicon']['url'];
                    $manifest_favicon_type = $a['site_settings']['favicon']['mime_type'];
                    break;
                }
            }

            self::generateConfigFiles([
                'manifest' => [
                    'name' => $manifest_name,
                    'favicon' => $manifest_favicon,
                    'type' => $manifest_favicon_type
                ]
            ]);
        }
        else $acf = get_fields( $postid ); // get page/cpt data

        // Set meta canonical URL
        if ( !empty( $meta_canonical ) ) $acf['meta']['canonical'] = $meta_canonical;

        // Set post details
        if ( !empty( $post ) ) $acf['post_details'] = $post;

        // Set component
        if ( !empty( $useComponent ) ) $acf['component'] = $useComponent;

        $acf['timestamp'] = date_i18n('Y-m-d H:i:s');

        //* Final data to return
        $data = $acf;

        //* Create cache if allowed
        if ( $create_cache ) update_option( '_neo_cache_' . $useFileName, json_encode($data), false );

        //* Return data if return allowed
        if ( $return ) return $data;
    }
}