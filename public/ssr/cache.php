<?php
if ( !defined('ALLOW_CACHE_LOAD') ) {
    header('HTTP/1.1 403 Forbidden');
    exit(json_encode([
        'err' => 'Bad cache load request ID 1'
    ]));
}

function get_cache( $slugs, $return_data = false ){
    //* Check if server to server request
    if ( defined('HUB_DOMAIN') ){
        $this_host = $_SERVER['SERVER_NAME'];
        $api_host = parse_url(HUB_DOMAIN, PHP_URL_HOST);

        // Host & API host not same, hence send request API host
        if ( 
            $this_host != $api_host 
            && function_exists('curl_multi_exec')
        ){
            $prepare_token = base64_encode('Webmaster:' . API_TOKEN);
            $site_ch = curl_init();
            $page_ch = curl_init();
        
            //* Site settings
            curl_setopt_array( $site_ch, [
                CURLOPT_URL => HUB_DOMAIN . 'ssr/client.php',
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => ['slug' => $slugs[0]],
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Basic ' . $prepare_token,
                    'User-Agent: neo-curl-api',
                ],
            ]);
        
            //* Page meta
            curl_setopt_array( $page_ch, [
                CURLOPT_URL => HUB_DOMAIN . 'ssr/client.php',
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => ['slug' => $slugs[1]],
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Basic ' . $prepare_token,
                    'User-Agent: neo-curl-api',
                ],
            ]);
        
            //* Run multi curl
            $mh = curl_multi_init();

            // add handles
            curl_multi_add_handle( $mh, $site_ch );
            curl_multi_add_handle( $mh, $page_ch );

            // execute the multi handle
            $running = null;
            do {
                curl_multi_exec( $mh, $running );
            } while ( $running );

            // close the handles
            curl_multi_remove_handle( $mh, $site_ch );
            curl_multi_remove_handle( $mh, $page_ch );
            curl_multi_close( $mh );
        
            $site_details = curl_multi_getcontent( $site_ch );
            $page_details = curl_multi_getcontent( $page_ch );

            return [
                'site_settings' => json_decode($site_details),
                $slugs[1] => json_decode($page_details),
            ];
            exit;
        }
    }

    // Load WP functions
    function load_wp(){
        if ( !defined('WP_USE_THEMES') ) {
            define('WP_USE_THEMES', false);

            // Default
            if ( file_exists(dirname(__FILE__) . '/../hub/wp-load.php') ){
                require dirname(__FILE__) . '/../hub/wp-load.php';
            }
            // Default hub missing (staging only)
            elseif ( 
                APP_ENV === 'staging' 
                && file_exists(dirname(__FILE__) . '/../../hub/wp-load.php') 
            ){
                require dirname(__FILE__) . '/../../hub/wp-load.php';
            }
        }
    }

    // Generate DB file for faster connection
    function load_db_config( $db_config ){
        // Define the path to your existing PHP file
        $save_path = dirname(__FILE__) . '/db.php';

        // The code you want to add after the specific line
        $data = '<?php' . PHP_EOL .
        'if (!defined("ALLOW_DB_LOAD")){' . PHP_EOL .
        '    header("HTTP/1.1 403 Forbidden");' . PHP_EOL .
        '    exit(json_encode(["err" => "Bad DB load request ID 1"]));' . PHP_EOL .
        '}' . PHP_EOL .
        'define("CACHE_DB_CONFIG", ' . var_export($db_config, true) . ');' . PHP_EOL;

        $f = fopen( $save_path , "w" );
        fwrite($f , $data );
        fclose($f);
    }

    // Load DB constants
    if ( file_exists( dirname(__FILE__) . '/db.php') ){
        define('ALLOW_DB_LOAD', true);
        require dirname(__FILE__) . '/db.php';
    }

    $cache_data = []; 
    $db_config = defined('CACHE_DB_CONFIG') ? CACHE_DB_CONFIG : false;

    // Load WP to get db config if missing
    if ( empty( $db_config ) ){
        load_wp();
        global $wpdb;

        $db_config = [
            'DB_HOST' => DB_HOST, 
            'DB_USER' => DB_USER, 
            'DB_PASSWORD' => DB_PASSWORD, 
            'DB_NAME' => DB_NAME,
            'DB_PREFIX' => $wpdb->prefix,
        ];

        load_db_config($db_config);
    }

    // Check DB for cache data
    $mysqli = new mysqli(
        $db_config['DB_HOST'], 
        $db_config['DB_USER'], 
        $db_config['DB_PASSWORD'], 
        $db_config['DB_NAME']
    );

    if ( !$mysqli->connect_error ){
        $options_table = $db_config['DB_PREFIX'] . 'options';

        //* Get cache data
        foreach ( $slugs as $slug ){
            $slug_name = $slug;

            // Use special name for front page
            if ( $slug === '/' ) $slug_name = 'front_page';

            $search_value = '_neo_cache_' . $slug_name;
            $stmt = $mysqli->prepare("SELECT option_value FROM `$options_table` WHERE option_name = ? LIMIT 1");
            $stmt->bind_param("s", $search_value);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($option_value);
    
            if ( $stmt->fetch() ){
                $cache_data[$slug] = json_decode( $option_value );
            }
    
            $stmt->close();
        }

        $mysqli->close();
    }

    //* Generate cache if not found
    if ( empty( $cache_data ) ){
        load_wp();
        global $wpdb;

        // Ensures DB saved matches WP DB
        if ( 
            array_diff(
                array_values( $db_config ), 
                [DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, $wpdb->prefix]
            ) 
        ){
            load_db_config([
                'DB_HOST' => DB_HOST, 
                'DB_USER' => DB_USER, 
                'DB_PASSWORD' => DB_PASSWORD, 
                'DB_NAME' => DB_NAME,
                'DB_PREFIX' => $wpdb->prefix,
            ]);
        }

        // Get IDs based on slug to generate cache
        foreach ( $slugs as $slug ){
            $slug = sanitize_text_field( $slug );

            // For front page
            if ( $slug === '/' ){
                $page = get_option('page_on_front');
                $postID = $page;
            }
            // For site settings
            elseif ( $slug === 'site_settings' ) $postID = 'site-settings';
            // For other pages
            else {
                $slug_name = $slug;

                //* Polylang language
                if ( function_exists('pll_languages_list') ){
                    // break slug where language is found
                    $languages = pll_languages_list();
                    if ( !empty( $languages ) ) foreach ( $languages as $l ){
                        if ( strpos( '/'.$slug, '/'.$l.'/' ) !== false ) {
                            $slug_name = implode('/', explode( '/'.$l.'/', '/'.$slug, 2 ) );
                            break;
                        }
                    }
                }

                // Find in page or post
                $thePage = get_page_by_path( 
                    $slug_name, 
                    OBJECT,
                    [ 'page', 'post' ]
                );

                // Break into array
                $split = explode( '/', $slug_name ); 

                // Find in CPT
                if ( empty( $thePage ) && count( $split ) > 1 ){
                    $post_type_exist = get_post_types([
                        'rewrite' => true,
                        '_builtin' => false,
                    ], 'object');

                    if ( !empty( $post_type_exist ) ) foreach ( $post_type_exist as $pte ){
                        if ( $pte->rewrite['slug'] === $split[0] ){
                            $post_type = [ $pte->name ];
                            array_shift( $split );
                            $slug_name = implode( '/', $split ); // Combine into string
                            break;
                        }
                    }
                    
                    // Search data in post types
                    if ( !empty( $post_type ) ){
                        $thePage = get_page_by_path( 
                            $slug_name, 
                            OBJECT,
                            $post_type
                        ); 
                    }
                }

                //! No data
                if ( empty( $thePage->ID ) ){
                    header('HTTP/1.0 404 Not Found');
                    exit(json_encode(['err' => 'Cache resource not available or missing ID 1']));
                }

                $postID = $thePage->ID;
            }

            // Assign cache data
            $generated_data = Engine\Cache\Main::createCache( 
                $postID, 
                (!$return_data ? 'partial' : $return_data ) 
            );
            if ( !empty( $generated_data ) ) $cache_data[$slug] = $generated_data;
        }
    }

    //! Still empty after cache
    if ( empty( $cache_data ) ){
        header('HTTP/1.0 404 Not Found');
        exit(json_encode(['err' => 'Cache resource not available or missing ID 2']));
    }

    //* Return json data
    return $cache_data;
    exit;
}