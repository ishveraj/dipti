<?php
namespace App\Forms;
class Main {
    private static $siteKey = FALSE; // Fill to use recaptcha
    private static $secretKey = FALSE; // Fill to use recaptcha

    function __construct(){
        // Local development recaptchas
        if ( $_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1' ){
            self::$siteKey   = '6LcmtYIUAAAAACY-QEoeMn0FOuyO7QJv7iRPrSDM';
            self::$secretKey = '6LcmtYIUAAAAAN5nuJhsn7v6D5y2lVtt3pyrlblo';
        }
    }

    /*
     * Form Validation
     * On form submit the values are crosschecked with the ones
     * created initially in the form
     * External fields will throw errors and end
     */
    public static function validatePOST(){
        if ( isset( $_POST['g-recaptcha-response'] ) ){
            if( !self::RecaptchaValidate( $_POST['g-recaptcha-response'] ) ){
                return 'Validation Failed. Please try again.';
            }
        }

        // Sanitize
        foreach ( $_POST as $key => $arg ){
            // For arrays
            if ( is_array( $arg ) ){
                array_walk_recursive( $arg, function( &$value, $varname ){
                    if ( strpos( $varname, 'textarea' ) !== false ){
                        $value = sanitize_textarea_field( $value );
                    }
                    else $value = sanitize_text_field( $value );
                });
                
                $_POST[ $key ] = $arg;
            }
            // For strings
            else {
                $value = sanitize_text_field( $arg );
                $_POST[ $key ] = $value;
            }
        }

        return 'success';
    }

    /*
     * Recaptcha Validation
     */
    private static function RecaptchaValidate( $returnGrepCha ){
        // Use local key if dev locally
        if ( $_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1' ){
            self::$secretKey = '6LcmtYIUAAAAAN5nuJhsn7v6D5y2lVtt3pyrlblo';
        }
        $r = 'https://www.google.com/recaptcha/api/siteverify?secret=' . self::$secretKey . '&response=' . $returnGrepCha;
        $handle = curl_init( $r );
        curl_setopt( $handle,  CURLOPT_RETURNTRANSFER, TRUE );
        curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, TRUE );
        $response = curl_exec( $handle );
        $httpCode = curl_getinfo( $handle, CURLINFO_HTTP_CODE );
        curl_close( $handle );
        if ( $httpCode >= 200 && $httpCode < 300 ){
            if ( strlen($response) > 0 ){
                $responseobj = json_decode( $response );
                if ( !$responseobj->success ){ return false; }
                else { return true; }
            }
        }
        else { return false; }
    }
}