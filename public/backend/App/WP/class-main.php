<?php
namespace App\WP;
use App\Forms;

class Main {

    function __construct(){
        //* Replace permalinks with frontend URLs
        add_filter( 'page_link', function( $permalink, $post ){
            return str_replace( '/hub/', '/', $permalink ); 
        }, 100, 2); 

        add_filter( 'post_link', function( $permalink, $post ){
            return str_replace( '/hub/', '/', $permalink ); 
        }, 100, 2); 

        add_filter( 'post_type_link', function( $permalink, $post ){
            return str_replace( '/hub/', '/', $permalink ); 
        }, 100, 2); 

        //* ACF Init settings
        add_action( 'acf/init', function(){
            // Disable shortcode for ACF
            acf_update_setting( 'enable_shortcode', false );

            //* Init options page for site settings
            if( function_exists('acf_add_options_page') ) {
                acf_add_options_page(array(
                    'page_title'    => 'Settings',
                    'menu_title'    => 'Site Settings',
                    'menu_slug'     => 'site-settings',
                    'capability'    => 'edit_posts',
                    'redirect'  => false,
                    'position' => 100,
                    'post_id' => 'site-settings',
                ));
            }
        });

        //* Disable all automatic updates
        add_filter( 'automatic_updater_disabled', '__return_true' );

        //* Disable default account reset notification
        add_filter( 'send_password_change_email', function( $send, $user, $userdata ){
            //if ( $user->roles[0] === 'customer' ) return false;
            return true;
        }, 10, 3);

        //* Prevent media from generating multiple images
        add_filter('intermediate_image_sizes', function( $sizes ){
            return array();
        });

        //* Add a file-less page template to the page template dropdown 
        require __DIR__ . '/../templates.php';
        add_filter( 'theme_page_templates', function( $page_templates, $wp_theme, $post ){
            if ( !empty( REGISTERED_TEMPLATES ) ) foreach ( REGISTERED_TEMPLATES as $key => $page ){
                if( !isset( $page_templates[ $key ] ) ){
                    $page_templates[ $key ] = $page;
                }
            }
            return $page_templates;
        }, PHP_INT_MAX, 3 );

        //* On Init start Session
        add_action('init', function(){
            // Create Menu for Navigation Menus in Admin Panel
            foreach ( REGISTERED_MENUS as $slug => $label ){
                register_nav_menu( $slug, __( $label ) );
            }

            // Register jquery to $
            wp_add_inline_script( 'jquery', 'var $ = jQuery;' );

            // Hide the admin wp bar for frontend
            add_filter( 'show_admin_bar', '__return_false' );

            // Preset permalinks; use postname without / at the back
            global $wp_rewrite;
            $wp_rewrite->set_permalink_structure( '/%postname%' );
        });

        //* Disable users in wordpress sitemap
        add_filter( 'wp_sitemaps_add_provider', function( $provider, $name ) {
            if ( 
                'users' === $name ||
                'taxonomies' === $name
            ){
                return false;
            }
            return $provider;
        }, 10, 2 );

        // Force 200 on sitemap
        add_action('template_redirect', function() {
            if (strpos($_SERVER['REQUEST_URI'], 'wp-sitemap') !== false) {
                status_header(200);
                header_remove('X-Robots-Tag');
            }
        }, 1);

        // Replace nodeJS hub sitemaps
        add_filter( 'wp_sitemaps_posts_entry', function( $entry ){
            if ( isset( $entry['loc'] ) ) {
                $entry['loc'] = str_replace( 'hub.', '', $entry['loc'] );
            }
            return $entry;
        });

        //* Rest API block (for direct access)
        add_filter( 'rest_authentication_errors', function( $result ) {
            if ( !empty( $result ) ) {
                return $result;
            }

            // Public user useAPI() allowed endpoints
            if ( !current_user_can( 'moderate_comments' ) ){
                $request_url = $_SERVER['REQUEST_URI'];
                if ( 
                    !isset( $_SERVER['HTTP_USER_AGENT'] )
                    || (
                        strpos( $request_url, '/api/post/' ) === false &&
                        strpos( $request_url, '/api/get/' ) === false &&
                        strpos( $request_url, '/api/preview/' ) === false
                    )
                ){
                    header('HTTP/1.0 404 Not Found');
                    exit(json_encode([
                        'err' => 'API resource not available or missing ID 1'
                    ]));
                }
            }

            return $result;
        });

        //* Cache pages and CPT into json files
        new \Engine\Cache\Main();

        //* Change REST prefix
        add_filter( 'rest_url_prefix', function(){
            return 'api';
        });
        
        //* POST route REST API
        add_action( 'rest_api_init', function () {
            register_rest_route( 'post', '/(?P<permission>[a-zA-Z0-9-]+)/(?P<class>.+)/(?P<method>[a-zA-Z0-9-]+)', array(
              'methods' => 'POST',
              'callback' => function( $data ){
                $runClass = self::generateClassMethod( $data, 'post' );

                //! Class not found
                if ( !$runClass ){
                    header('HTTP/1.0 404 Not Found');
                    exit(json_encode([
                        'err' => 'API resource not available or missing ID 2'
                    ]));
                }

                // Sanitize POST values
                $check = Forms\Main::validatePOST();
                if ( $check !== 'success' ) exit( json_encode(['status' => $check]) );

                $return = $runClass();
                
                if ( !empty( $return ) ) exit( json_encode( $return ) );
                else exit( json_encode(['err' => 'no-data']) );
              },
              'permission_callback' => function( $data ){
                $request_origin = $_SERVER['HTTP_REFERER'] ?? $_SERVER['HTTP_ORIGIN'] ?? false;

                //! No proper referral
                if ( !$request_origin ) return false;

                // Localhost requires token
                if ( strpos($request_origin, 'localhost:3000') !== false ){
                    // Checks for WP application token
                    if ( 
                        $data['permission'] === 'public' 
                        && !is_user_logged_in()
                    ) return FALSE;
                } 

                if ( $data['permission'] === 'public' ) return TRUE;

                $user = self::checkJWT();

                if ( !$user ) return FALSE;

                // Success logs user temporarily to use private REST API features
                wp_set_current_user( $user->ID );
                return TRUE;
              }
            ));
        });

        //* GET route REST API
        add_action( 'rest_api_init', function () {
            register_rest_route( 'get', '/(?P<permission>[a-zA-Z0-9-]+)/(?P<class>.+)/(?P<method>[a-zA-Z0-9-]+)', array(
              'methods' => 'GET',   
              'callback' => function( $data ){          
                $runClass = self::generateClassMethod( $data, 'get' );

                //! Class not found
                if ( !$runClass ){
                    header('HTTP/1.0 404 Not Found');
                    exit(json_encode([
                        'err' => 'API resource not available or missing ID 3'
                    ]));
                }

                $return = $runClass();

                if ( !empty( $return ) ) exit( json_encode( $return ) );
                else exit( json_encode(['err' => 'no-data']) );
              },
              'permission_callback' => function( $data ){
                $request_origin = $_SERVER['HTTP_REFERER'] ?? $_SERVER['HTTP_ORIGIN'] ?? false;

                // Localhost requires token
                if ( strpos($request_origin, 'localhost:3000') !== false ){        
                    // Checks for WP application token
                    if ( 
                        $data['permission'] === 'public' 
                        && !is_user_logged_in()
                    ) return FALSE;
                }  

                // For public users
                if ( $data['permission'] === 'public' ) return TRUE;

                // For WP admin and editor roles; requires wp_nonce in headers
                if ( 
                    $data['permission'] === 'admin' 
                    && current_user_can('edit_pages')
                ){
                    return TRUE;
                }

                // For private users
                $user = self::checkJWT();

                if ( !$user ) return FALSE;

                // Success logs user temporarily to use private REST API features
                wp_set_current_user( $user->ID );
                return TRUE;
              }
            ));
        });

        //* Preview route REST API
        add_action( 'rest_api_init', function () {
            register_rest_route( 'preview', '/', array(
              'methods' => 'GET',
              'callback' => function( $data ){
                // Get the last post revision
                $preview_id = sanitize_text_field( $_GET['preview_id'] );
                $return = get_posts([
                    'numberposts' => 1,
                    'post_type' => 'revision',
                    'post_status' => 'inherit',
                    'post_parent' => $preview_id,
                    'order'         => 'DESC',
                    'orderby'       => 'date ID',
                ]);

                // Return post revision data if exist
                if ( !empty( $return[0] ) && !empty( $return[0]->ID ) ){
                    $acf = get_fields( $return[0]->ID ); // get revision acfs
                    $acf['meta']['canonical'] = get_the_permalink( $preview_id ); // get canonical
                    $acf['post_details'] = $return[0]; // set revision post

                    // Get component
                    if ( $return[0]->post_type != 'page' ){
                        $acf['component'] = ucwords( $return[0]->post_type, '_' );
                    }
                    else $acf['component'] = get_page_template_slug( $preview_id );

                    exit( json_encode( $acf ) );
                }
                else {
                    header('HTTP/1.0 404 Not Found');
                    exit( json_encode(['err' => 'No previews found']) );
                }
              },
              'permission_callback' => function( $data ){
                //! Preview data missing
                if ( 
                    empty( $_GET['preview_nx'] )
                    || empty( $_GET['preview_id'] )
                ) return FALSE;

                // Ensures preview has proper nonce generated from CMS
                // Nonce last current day only
                global $neo;
                $nonce = $neo->Decrypt( sanitize_text_field( $_GET['preview_nx'] ), date('Ymd') );
                $nonceID = str_replace( 'preview-nonce-', '', $nonce );
                if ( $nonceID === sanitize_text_field( $_GET['preview_id'] ) ) return TRUE;
                return FALSE;
              }
            ));
        });

        //* Generate preview link in CMS
        // Nonce last for current day only
        add_filter( 'preview_post_link', function( $preview_link, $post ){
            global $neo;
            return get_permalink() . '?preview_nx=' . $neo->Encrypt( 'preview-nonce-' . $post->ID, date('Ymd') ) . '&preview_id=' . $post->ID;
        }, 10, 2);

        //* Remove Webmaster user for other users
        add_action( 'pre_user_query', function( $user_search ){
            global $current_user;
            $username = $current_user->user_login;
            if ( $username != 'Webmaster' ){
                global $wpdb;
                $user_search->query_where .= $wpdb->prepare(
                    " AND {$wpdb->users}.user_login != %s",
                    'Webmaster'
                );
            }
        });

        //* Remove the count for number of users
        add_action( 'admin_head', function(){ 
            global $pagenow;
            $screen = get_current_screen();
            $screen->remove_help_tabs();
        ?>
            <style>
                .wp-admin.users-php li.all span.count {display: none;}
                .wp-admin.users-php li.administrator span.count {display: none;}
            </style>

            <script>
                document.addEventListener('DOMContentLoaded', function(){
                    $('#wp-admin-bar-site-name .ab-item').attr('href', '<?= SITE_URL ?>' );
                });
            </script>
        <?php 
            if ( 
                $pagenow === 'admin.php'
                && !empty( $_GET['page'] ) && $_GET['page'] === 'site-settings'
            ){ ?>
                <script>
                    document.addEventListener('DOMContentLoaded', function(){
                        const button = document.getElementById('neo-clear-cache');
                        button.addEventListener('click', function() {
                            const options = {};
                            options.headers = {
                                'X-WP-Nonce': '<?= wp_create_nonce('wp_rest'); ?>'
                            };
                            fetch(`<?= SITE_URL ?>/hub/api/get/admin/site/pages/clear-cache?<?= uniqid() ?>`, options)
                            .then(response => response.json())
                            .then(data => {
                                alert(data.err);
                            });
                        });
                    });
                </script>
            <?php }
        });

        //* Add customize to Appearance
        add_action( 'admin_menu', function(){
            add_theme_page( 'Customize', 'Customize', 'administrator', 'customize.php' );
        });

        //* Register jquery above
        add_filter( 'wp_enqueue_scripts', function(){
            wp_enqueue_script( 'jquery', false, array(), false, false );
        }, 1 );

        //* Apperance Admin Layout Customizer	    }
        add_action( 'customize_register', function( $wp_customize ){
            $wp_customize->remove_panel( 'themes' );
            $wp_customize->remove_section( 'colors' );
            $wp_customize->remove_section( 'header_image' );
            $wp_customize->remove_section( 'custom_css' );
            $wp_customize->remove_panel( 'widgets' );
        }, 50);

        //* Theme Logo
        add_action( 'after_setup_theme', function(){
            $defaults = array(
                'height'      => 1000,
                'width'       => 1000,
                'flex-height' => true,
                'flex-width'  => true,
                'header-text' => array( 'site-title', 'site-description' ),
            );
            add_theme_support( 'custom-logo', $defaults );
        });

        //* Remove Dashboard Widgets
        add_action( 'wp_dashboard_setup', function(){
            global $wp_meta_boxes;
            unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']);
            unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);
            unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);
            unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']);
            unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary']);
            unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);
        }, 999);

        //* Add styling to logo in cms login page
        add_action('login_head', function(){
            echo '<style>
                body.login div#login h1 a {
                    background-size: contain;
                    background-position: center;
                }
            </style>';
        });
    }

    /*
     * Pagination
     * @param $query - returned value of WP_Query OR WP_User_Query
     * @param $paged - the current active pagination no
     * @param $isUserQuery - current number of data to show in a pagination (special for WP_User_Query only)
     */
    public static function Pagination( $query, $paged, $isUserQuery = false){
        // Default total no
        $total = $query->max_num_pages;
        // Total no for WP_User_Query
        if ( $isUserQuery ){
            $total = ceil( $query->total_users / $isUserQuery );
        }

        $paginations = paginate_links(array(
            'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
            'total'        => $total,
            'current'      => $paged,
            'format'       => '?paged=%#%',
            'show_all'     => false,
            'type'         => 'plain',
            'end_size'     => 2,
            'mid_size'     => 1,
            'prev_next'    => true,
            'prev_text'    => sprintf( '<i></i> %1$s', __( '<i class="fa fa-angle-left"></i>', 'text-domain' ) ),
            'next_text'    => sprintf( '%1$s <i></i>', __( '<i class="fa fa-angle-right"></i>', 'text-domain' ) ),
            'add_args'     => false,
            'add_fragment' => '',
        ));

        return str_replace('href=', 'data-passive=', $paginations);
    }

    /**
     * * Login helpers
     */
    // Generate token for client
    public static function generateJWT( $user ){
        global $neo;
        $atk = $neo->Encrypt( $user->ID . '[-]' . $neo->Encrypt($user->user_pass) );
        return $atk;
    }

    // Check if token is valid
    private static function checkJWT(){
        $token = apache_request_headers();
        if ( empty( $token['Authorization'] ) ) return FALSE; // Token missing

        // Decode token
        global $neo;
        $credentials = $neo->Decrypt( str_replace('Bearer ', '', $token['Authorization'] ) );
        if ( empty( $credentials ) ) return FALSE; // Token missing or broken

        [$ID, $password] = explode( '[-]', $credentials );

        // Find user by login OR email
        $user = get_user_by( 'ID', $ID ); 
        if ( !$user ) return FALSE; //! User not found

        //! Password does not match
        if ( $user->user_pass != $neo->Decrypt($password) ) return FALSE;

        return $user;
    }

    //* Generate class::method() from API
    private static function generateClassMethod( $data, $type ){
        $data['permission'] = sanitize_text_field( $data['permission'] );
        $data['class'] = sanitize_text_field( $data['class'] );
        $data['method'] = sanitize_text_field( $data['method'] );

        // Format class
        $class_args = explode( '/', $data['class'] );
        $class = [];
        foreach ( $class_args as $ca ){
            $class[] = str_replace(' ', '', ucwords( str_replace( '-', ' ', $ca ) ) );
        }

        // Format method
        $method = $data['permission'] . '_' . $type . '_' . str_replace( '-', '_', $data['method'] );
        
        // Generate class path
        $class = '\REST\\' . implode('\\', $class);

        //! API not found
        if ( !method_exists( $class, $method ) ) return false;

        // Return API path
        return $class . '::' . $method;
    }
}
