<?php

//* Preflight http ok
if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) exit;

//* Data type JSON
header('Content-Type: application/json');

//! Checks request type and parameter
if ( 
    !isset( $_SERVER['HTTP_USER_AGENT'] )
    || $_SERVER['REQUEST_METHOD'] !== 'POST' 
    || empty( $_POST['slug'] )
){
    header('HTTP/1.1 403 Forbidden');
    exit(json_encode([
        'err' => 'Bad client load request ID 1'
    ]));
}

//* Get request origin
$request_origin = $_SERVER['HTTP_REFERER'] ?? $_SERVER['HTTP_ORIGIN'] ?? false;

// Load token constants
define('ALLOW_TOKEN_LOAD', true);
require dirname(__FILE__) . '/token.php';

//* Client to server
if ( $_SERVER['HTTP_USER_AGENT'] != 'neo-curl-api' ){
    /**
     * Localhost needs token
     * Others are handled by CORS
     */ 
    if (
        $request_origin 
        && strpos($request_origin, 'localhost:3000') !== false
        && ( 
            !isset( $_SERVER['PHP_AUTH_PW'] ) 
            || API_TOKEN != $_SERVER['PHP_AUTH_PW']    
        )
    ){
        //! Authorization does not match
        header('HTTP/1.1 403 Forbidden');
        exit(json_encode([
            'err' => 'Bad client load request ID 2'
        ]));
    }
}
//* Server to server
elseif ( $_SERVER['HTTP_USER_AGENT'] === 'neo-curl-api' ){
    // Any server requests requires token
    if ( 
        !isset( $_SERVER['PHP_AUTH_PW'] ) 
        || API_TOKEN != $_SERVER['PHP_AUTH_PW']    
    ){
        //! Authorization does not match
        header('HTTP/1.1 403 Forbidden');
        exit(json_encode([
            'err' => 'Bad client load request ID 3'
        ]));
    }
}
//! Unauthorized access
else {
    header('HTTP/1.1 403 Forbidden');
    exit(json_encode([
        'err' => 'Bad client load request ID 4'
    ]));
}

//* Return request
$slug = $_POST['slug'];
define('ALLOW_CACHE_LOAD', true);
require 'cache.php';
echo json_encode( get_cache( [$slug] )[$slug] );
exit;