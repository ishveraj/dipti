<?php
namespace Engine;
use App;

class Main {

    /**
     * Default settings
     */ 
    // SEO
    public $metaSitename = 'Site Name';
    public $metaTitle = FALSE;
    public $metaDescription = 'Under Development';
    public $metaImage = SITE_URL . '/assets/images/siteimg.jpg';
    public $metaImageWidth  = '1024';
    public $metaImageHeight  = '512';
    public $metaKeywords = 'gaboola.com, neo';

    // Technical settings
    public $minify = TRUE;
    public $robotIndex = TRUE;
    public $useWPScripts = FALSE;
    public $csp = [
        'scripts' => TRUE,
        'iframes' => TRUE,
    ];
    private $edk;
    private $nonce;
    private $function_get_field_exist;
    private $site_settings;

    /**
     * Private settings
     * Used inside this class
     */
    // JS Scripts
    private static $inlineScripts;
    private static $externalScripts;

    // CSS scripts
    private static $externalStyles;
    private static $inlineStyles;

    // Main layout
    private static $mainLayout;
    private static $beforeMainLayout;
    private static $afterMainLayout;

    // CSP White Listings
    private static $cspWhitelistURLs = array();

    // Google Analytics
    private static $googleAnalytics = FALSE;

    // Google Tag Manager
    private static $googleTagManager_first_block  = FALSE;
    private static $googleTagManager_second_block = FALSE;

    // Render page arguments
    public static $pageSettings = array();
    public static $processOnly = FALSE; // ensures no html is run

    function __construct(){
        // Generate nonce
        $this->edk = md5( NONCE_KEY );
        $this->nonce = md5( uniqid( microtime(), TRUE ) . $this->edk );

        // Wordpress fields
        $this->function_get_field_exist = function_exists( 'get_field' );
        if ( $this->function_get_field_exist ){
            // Run code only after acf init
            add_action( 'acf/init', function(){
                // Navigation settings for logo & favicon
                $this->site_settings = get_field( 'site_settings', 'site-settings' );

                if ( !empty( $this->site_settings ) ){
                    // Set Sitename
                    $this->metaSitename = $this->site_settings['sitename'] ?? $this->metaSitename;

                    // Set Description
                    $this->metaDescription = $this->site_settings['description'] ?? $this->metaDescription;

                    // Set site image
                    $this->metaImage = $this->site_settings['siteimage']['url'] ?? $this->metaImage;

                    // Set site keywords
                    if ( !empty( $this->site_settings['keywords'] ) ){
                        $this->metaKeywords = $this->site_settings['keywords'] . ', ' . $this->metaKeywords;
                    }
                }
            });
        }    
        
        // Load global application settings
        new App\WP\Main; // Init WP settings
    }

    /**
     * Preset pages
     * Allows CMS to use templates to access the correct modules
     */
    public function renderPresetPage(){
        global $post;

        //! End early if post doesnt exist
        if ( empty( $post ) || empty( $post->ID ) ){
            header('Location:' . SITE_URL . '/404');
            exit;
        }

        // Get template name (must match class folder name in backend/Pages)
        $pageClassName = get_page_template_slug( $post->ID );
        $class = 'Pages\\' . $pageClassName . '\\Main'; 

        if ( !class_exists( $class ) ) {
            header('Location:' . SITE_URL . '/404');
            exit;
        }
        
        new $class;
        $this->renderPage();
    }


    /*
     * Renders the page
     * Load all finalized tag to setup the page
     */
    public function renderPage(){
        // Minify html
        if ( !is_admin() && $this->minify ){
            ob_start( function( $buffer ){
                $Search = array(
                    '/(\n|^)(\x20+|\t)/',
                    '/(\n|^)\/\/(.*?)(\n|$)/',
                    '/\n/',
                    '/\<\!--.*?-->/',
                    '/(\x20+|\t)/', # Delete multispace (Without \n)
                    '/\>\s+\</', # strip whitespaces between tags
                    '/(\"|\')\s+\>/', # strip whitespaces between quotation ("') and end tags
                    '/=\s+(\"|\')/'
                ); # strip whitespaces between = "'

                $Replace = array(
                    "\n",
                    "\n",
                    " ",
                    "",
                    " ",
                    "><",
                    "$1>",
                    "=$1"
                );
                $Html = preg_replace($Search,$Replace,$buffer);
                return $Html;
            });
        }

        // Turn off CSP if WP scripts are used
        if ( $this->useWPScripts ){ 
            $this->csp['scripts'] = FALSE; 
        }

        // Robot indexing
        if ( !$this->robotIndex ){ 
            header("X-Robots-Tag: noindex, nofollow", true); 
        }

        /**
         * CSP
         */
        // Setup whitelisted URLs if any
        if ( !empty( self::$cspWhitelistURLs ) ){
            foreach ( self::$cspWhitelistURLs as $key => $urls ){
                $temp = array_unique( $urls );
                self::$cspWhitelistURLs[ $key ] = implode( ' ', $temp );
            }
        }

        // CSP scripts
        $script_csp = "script-src 'self' 'nonce-" . $this->nonce . "'";
        if ( !$this->csp['scripts'] ){
            $script_csp = ''; // CSP scripts turned off
        }
        elseif ( !empty( self::$cspWhitelistURLs['scripts'] ) ) {
            $script_csp = "script-src 'self' 'nonce-" . $this->nonce . "' " . self::$cspWhitelistURLs['scripts'];
        }

        // CSP iframes
        $iframe_csp = "frame-src 'none'";
        if ( !$this->csp['iframes'] ){
            $iframe_csp = ''; // CSP iframes turned off
        }
        elseif ( !empty( self::$cspWhitelistURLs['iframes'] ) ) {
            $iframe_csp = "frame-src 'self' " . self::$cspWhitelistURLs['iframes']; 
        }
        
        header("Content-Security-Policy: " . ( $this->isAppLive() ? "upgrade-insecure-requests;" : "" ) . " frame-ancestors 'none'; object-src 'none'; base-uri 'self'; ".$script_csp."; form-action 'none'; ".$iframe_csp.";");

        if ( !self::$processOnly ){
            echo '<!DOCTYPE html><html lang="en">';
                $this->headSection( self::$pageSettings );
                $this->bodySection( self::$pageSettings );
                $this->footerSection( self::$pageSettings );
            echo '</html>';
        }
        elseif ( !empty( self::$mainLayout ) ) echo implode( '', self::$mainLayout );  
    }

    // Head tag
    private function headSection( $args ){
        echo '<head>';

        // Maybe need to load wpmedia to ensure media popup in frontend works
        if( $this->useWPScripts ){
            // Add media styling to fix broken media popup in frontend
            //$this->addExternalStyle([ THEME_URL . '/assets/css/wpmedia.css' ]);
        }

        // Overide title if set in code
        if( $this->metaTitle ){
            $this->metaTitle = $this->metaTitle . ' | ' . $this->metaSitename;
        }
        else {
            $this->metaTitle = $this->metaSitename;
        }

        // Check if CMS has set SEO
        if( $this->function_get_field_exist ){
            global $post;

            $arg = get_field('meta');

            // Set Title
            if( !empty( $arg['title'] ) ){ 
                $this->metaTitle = $arg['title'] . ' | ' . $this->metaSitename; 
            }
            
            // Set Description
            $this->metaDescription = $arg['description'] ?? $this->metaDescription;
            
            // Set Site Image
            $this->metaImage = $arg['url'] ?? $this->metaImage;
            
            // Set Keywords
            if( !empty( $arg['keywords'] ) ){
                $this->metaKeywords = $arg['keywords'] . ', ' . $this->metaKeywords;
            }
        }

        /**
         * For hardcoded meta in pageSettings
         */
        if ( !empty( $args['meta']['title'] ) ){
            $this->metaTitle = $args['meta']['title'] . ' | ' . $this->metaSitename; 
        }

        if( !empty( $args['meta']['keywords'] ) ){
            $this->metaKeywords = $args['meta']['keywords'] . ', ' . $this->metaKeywords;
        }
        $this->metaDescription = $args['meta']['description'] ?? $this->metaDescription;
        $this->metaImage = $args['meta']['image'] ?? $this->metaImage;

        /**
         * ************
         * Render tags
         * ************
         */
        // Meta tags
        $this->renderMetas();

        // Render google analytics
        if( self::$googleAnalytics ){ echo self::$googleAnalytics; }

        // Render google tag manager
        if( self::$googleTagManager_first_block ){ echo self::$googleTagManager_first_block; }

        echo '</head>';
    }

    // Body tag
    private function bodySection( $args ){
        // Body tag
        echo '<body 
        ' . ( empty( $args['body']['class'] ) ? '' : 'class="' . $args['body']['class'] . '"' ) . ' 
        ' . ( empty( $args['body']['id'] ) ? '' : 'id="' . $args['body']['id'] . '"' ) . ' 
        ' . ( empty( $args['body']['attr'] ) ? '' : ' ' . $args['body']['attr'] ) . '
        >';

        // Render google tag manager
        if( self::$googleTagManager_second_block ){ echo self::$googleTagManager_second_block; }

        // For layouts before main tag
        if ( !empty( self::$beforeMainLayout ) ){ 
            echo implode( '', self::$beforeMainLayout );
        }

        // Main content tag
        echo '<main 
        ' . ( empty( $args['main']['class'] ) ? '' : 'class="' . $args['main']['class'] . '"' ) . ' 
        ' . ( empty( $args['main']['id'] ) ? '' : 'id="' . $args['main']['id'] . '"' ) . ' 
        ' . ( empty( $args['main']['attr'] ) ? '' : ' ' . $args['main']['attr'] ) . '
        >';
            // Render layout
            if ( !empty( self::$mainLayout ) ){ 
                echo implode( '', self::$mainLayout );
            }
            else { echo 'Create a class module & use the base trait layout to fetch contents'; }
        echo '</main>';

        // For layouts after main tag
        if ( !empty( self::$afterMainLayout ) ){ 
            echo implode( '', self::$afterMainLayout );
        }
    }

    // Footer tag
    private function footerSection( $args ){        
        // Set PHP to JS Value Transfers
        echo '<script nonce="' . $this->nonce . '">
            var phptojs_url = "'. SITE_URL .'";
            var phptojs_path = "'. THEME_URL .'";
            var phptojs_wp_ajax = "' . SITE_URL . '/wp-admin/admin-ajax.php";
        </script>';

        // Load WP Footer if useWPScripts set to TRUE
        if( $this->useWPScripts ){
            wp_enqueue_script( 'jquery', SITE_URL . '/wp-includes/js/jquery/jquery.js');
            wp_footer();
            echo '<script nonce="' . $this->nonce . '">var $ = jQuery;</script>';
        }

        // Load external JS
        if ( !empty( self::$externalScripts ) ){     
            $arr = array_unique( self::$externalScripts );
            foreach ( $arr as $a ){ echo '<script nonce="' . $this->nonce . '" src="' . $a . '"></script>'; }
        }

        // Load inline JS
        if ( !empty( self::$inlineScripts ) ){
            ?> <script nonce="<?= $this->nonce ?>"> <?php
            echo implode( '', self::$inlineScripts );
            ?> </script> <?php
        }

        // Close body tag
        echo '</body>';
    }
    
    // Meta Tags
    private function renderMetas(){
        // Default Meta
        echo '<meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta name="description" content="' . $this->metaDescription . '"/>
        <meta name="keywords" content="' . $this->metaKeywords . '"/>
        <meta property="og:url" content="' . 'https://' . htmlspecialchars( $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] ) . '"/>
        <meta property="og:title" content="' . $this->metaTitle . '"/>
        <meta property="og:description" content="' . $this->metaDescription . '"/>
        <meta property="og:image" content="' . $this->metaImage . '"/>
        <meta property="og:image:width" content="' . $this->metaImageWidth . '"/>
        <meta property="og:image:height" content="' . $this->metaImageHeight . '"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="' . $this->metaSitename . '"/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:image" content="' . $this->metaImage . '"/>
        <meta name="twitter:title" content="' . $this->metaTitle . '"/>
        <meta name="twitter:description" content="' . $this->metaDescription . '"/>
        <meta name="twitter:site" content=""/>';

        // Favicons
        if( !empty( $this->site_settings['favicon']['url'] ) ){
            echo '<link rel="icon" href="' . $this->site_settings['favicon']['url'] . '" sizes="32x32" />
            <link rel="icon" href="' . $this->site_settings['favicon']['url'] . '" sizes="192x192" />
            <link rel="apple-touch-icon-precomposed" href="' . $this->site_settings['favicon']['url'] . '" />
            <meta name="msapplication-TileImage" content="' . $this->site_settings['favicon']['url'] . '" />';
        }

        echo '<title>' . $this->metaTitle . '</title>';

        // Load WP Head if useWPScripts set to TRUE
        if( $this->useWPScripts ){ wp_head(); }

        // Load external CSS
        if ( !empty( self::$externalStyles ) ){     
            $arr = array_unique( self::$externalStyles );
            foreach ( $arr as $a ){ echo '<link nonce="' . $this->nonce . '" rel="stylesheet" type="text/css" href="' . $a . '"/>'; }
        }

        // Load inline CSS
        if ( !empty( self::$inlineStyles ) ){
            ?> <style nonce="<?= $this->nonce ?>"> <?php
            echo implode( '', self::$inlineStyles );
            ?> </style> <?php
        }
    }

    /*
     * CSP Whitelisting URLs
     */
    public function cspWhitelistURLs( $arg ){
        if( !empty( $arg ) ){ 
            foreach ( $arg as $key => $a ){
                $temp = self::$cspWhitelistURLs[ $key ] ?? array();
                self::$cspWhitelistURLs[ $key ] = array_merge( $temp, $a );
            }
        }
    }

    /*
     * Google Analytics
     */
    public function googleAnalytics( $arg ){
        if( !empty( $arg ) ){
            foreach( $arg as $a ){
                if( !empty( $a ) ){
                    self::$googleAnalytics .= "
                    <script nonce='$this->nonce' async src='https://www.googletagmanager.com/gtag/js?id=$a'></script><script nonce='$this->nonce'>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '$a');</script>";
                }
            }
        }
    }

    /*
     * Google Tag Manager
     */
    public function googleTagManager( $arg ){
        if( !empty( $arg ) ){
            foreach( $arg as $a ){
                if( !empty( $a ) ){
                    self::$googleTagManager_first_block .= "                    
                    <script nonce='$this->nonce'>
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','$a');</script>
                    ";

                    self::$googleTagManager_second_block .= "                    
                    <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=$a' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>
                    ";
                }
            }

            if ( self::$googleTagManager_first_block ){
                $this->cspWhitelistURLs([
                    'scripts' => [ 'https://www.googletagmanager.com/gtm.js' ],
                ]);
            }
        }
    }

    /**
     * Base layout functions
     */
    
    // Adds external style
    public function addExternalStyle( array $style ){
        foreach ( $style as $s ){ 
            self::$externalStyles[] = $s;
        }
    }

    // Adds inline style
    public function addInlineStyles( $style ){
        self::$inlineStyles[] = $style;
    }

    // Adds into before main tag
    public function addBeforeMainLayout( $layout ){ 
        self::$beforeMainLayout[] = $layout;
    }

    // Adds into main tag
    public function addMainLayout( $layout ){ 
        self::$mainLayout[] = $layout; 
    }

    // Adds into after main tag
    public function addAfterMainLayout( $layout ){ 
        self::$afterMainLayout[] = $layout; 
    }

    // Adds external scripts
    public function addExternalScript( array $script ){
        foreach ( $script as $s ){ 
            self::$externalScripts[] = $s;
        }
    }

    // Adds inline scripts
    public function addInlineScript( $script ){
        self::$inlineScripts[] = $script;
    }


    //* Encryption Decryption
    public function Encrypt( $data, $edk = false ){
        if ( !$edk ) $edk = $this->edk;

        // Generate a random IV (Initialization Vector)
        $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-128-CBC'));
        
        // Encrypt the data using CBC mode
        $encrypted = openssl_encrypt($data, 'AES-128-CBC', $edk, OPENSSL_RAW_DATA, $iv);
        
        // Concatenate the IV with the encrypted data and encode the result using base64
        $result = base64_encode($iv . $encrypted);
        
        return $result;
    }

    public function Decrypt( $encryptedData, $edk = false ){
        if ( !$edk ) $edk = $this->edk;

        // Decode the base64-encoded input
        $decoded = base64_decode($encryptedData);
        
        // Extract the IV and the encrypted data
        $ivLength = openssl_cipher_iv_length('AES-128-CBC');
        $iv = substr($decoded, 0, $ivLength);
        $encrypted = substr($decoded, $ivLength);
        
        // Decrypt the data using CBC mode
        $decrypted = openssl_decrypt($encrypted, 'AES-128-CBC', $edk, OPENSSL_RAW_DATA, $iv);
        
        return $decrypted;
    }

    //* JS Encrypt Decrypt
    public function EncryptJS( $arg ){
        $today = date_i18n('mdY');
        $key = 'gaboolsneo' . $today;
        $stringBytes = mb_convert_encoding($arg, 'UTF-8');
        $keyBytes = mb_convert_encoding($key, 'UTF-8');

        $encryptedBytes = [];
        for ($i = 0; $i < strlen($stringBytes); $i++) {
            $byte = ord($stringBytes[$i]) ^ ord($keyBytes[$i % strlen($keyBytes)]);
            $encryptedBytes[] = $byte;
        }

        $encryptedString = base64_encode(implode(array_map("chr", $encryptedBytes)));
        return $encryptedString . $today;
    }

    public function DecryptJS( $arg ){
        $theday = substr( $arg, -8 );
        $key    = 'gaboolsneo' . $theday;
        $arg    = substr( $arg, 0, -8 ); 

        $encryptedBytes = array_map("ord", str_split(base64_decode($arg)));
        $keyBytes = mb_convert_encoding($key, 'UTF-8');
      
        $decryptedBytes = [];
        for ($i = 0; $i < count($encryptedBytes); $i++) {
          $byte = $encryptedBytes[$i] ^ ord($keyBytes[$i % strlen($keyBytes)]);
          $decryptedBytes[] = $byte;
        }
      
        $decryptedString = mb_convert_encoding(implode(array_map("chr", $decryptedBytes)), 'UTF-8');
        return $decryptedString;
    }

    // Check if local or live
    public static function isAppLive(){
        if ( $_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1' ){
            return FALSE;
        }
        else {
            return TRUE;
        }
    }
}


// Extend this class to create Pages & Components
class Base {
    function __construct(){
        global $neo;

        $neo->addExternalStyle( $this->styleSrc() );
        $neo->addInlineStyles( call_user_func(function(){
            ob_start();
            $this->style();
            return str_replace( [ '<style>', '</style>' ], '', ob_get_clean() );
        }) );
        
        $neo->addBeforeMainLayout( call_user_func(function(){
            ob_start();
            $this->beforeMain();
            return ob_get_clean();
        }) );

        $neo->addMainLayout( call_user_func(function(){
            ob_start();
            $this->main();
            return ob_get_clean();
        }) );

        $neo->addAfterMainLayout( call_user_func(function(){
            ob_start();
            $this->afterMain();
            return ob_get_clean();
        }) );

        $neo->addExternalScript( $this->scriptSrc() );
        $neo->addInlineScript( call_user_func(function(){
            ob_start();
            $this->script();
            return str_replace( [ '<script>', '</script>' ], '', ob_get_clean() );
        }) );
    }

    protected function styleSrc(){ return array(); }
    protected function style(){}
    protected function navbar(){}
    protected function beforeMain(){}
    protected function main(){}
    protected function afterMain(){}
    protected function footer(){}
    protected function scriptSrc(){ return array(); }
    protected function script(){}
}