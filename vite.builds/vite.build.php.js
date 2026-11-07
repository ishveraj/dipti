const fs = require('fs');
const path = require('path');
const { robotsData, tokenData, htaccessData } = require('./globals');
require('dotenv').config();

const isProduction = process.env.BUILD_MODE;
const appBase = isProduction === 'production' ? process.env.PRODUCTION_PATH : process.env.STAGING_PATH;
const appURL = process.env.HUB_DOMAIN;
const corsWhitelist = process.env.CORS_WHITELIST ? `['${process.env.CORS_WHITELIST.split(', ').join("', '")}']` : false;

// Add SSR to index.html
const newIndexPHPPath = 'dist/index.html';
let content = fs.readFileSync(newIndexPHPPath, 'utf8');
// The "Real" PHP code
content = content.replace(
'PHP_SSR_INIT', 
`<?php 
define('APP_ENV', '${isProduction}');
define('APP_BASE', '${appBase}');
define('HUB_DOMAIN', '${appURL}');
define('API_TOKEN', '${process.env.LOCALHOST_API_TOKEN}');
define('CORS_WHITELIST', ${corsWhitelist});
define('LANG_SUPPORT', '${process.env.LANGUAGE_SUPPORT}');

//* If is preview, set to no index (CMS site preview)
if ( !empty( $_GET['preview_id'] ) ) header('X-Robots-Tag: noindex, nofollow', true);

//* Prepare meta for setup
$useMeta = array();

//* Set current page slug
$page_slug  = parse_url( $_SERVER['REQUEST_URI'] )['path'] ?? APP_BASE;
// Remove project app base from URL
if ( APP_BASE != '/' ) $page_slug = str_replace( APP_BASE, '', $page_slug );
$page_slug = trim( $page_slug, '/' );
$page_slug = empty( $page_slug ) ? '/' : $page_slug;

//! Set to 404 if URL matches
if ( strpos($page_slug, '404-not-found') !== false ) header("HTTP/1.0 404 Not Found");

// Get cache
define('ALLOW_CACHE_LOAD', true);
require __DIR__ . '/ssr/cache.php';
$data = get_cache( ['site_settings', $page_slug], true );

// Default single lang
$set_sitedetails = isset($data['site_settings']->site_settings) ? $data['site_settings']->site_settings : false;

// Multi lang
if ( LANG_SUPPORT === 'multiple' ){
    $parts = explode('/', $page_slug);
    $lang = (strlen($parts[0]) === 2) ? $parts[0] : false;

    // Default to en
    $set_sitedetails = $data['site_settings']->en->site_settings;

    if ( 
        $lang 
        && isset($data['site_settings']->$lang->site_settings) 
    ) $set_sitedetails = $data['site_settings']->$lang->site_settings;
}

//* Site settings meta
$site_details = $set_sitedetails;
$siteName               = $site_details->sitename;
$useMeta['title']       = $site_details->sitename;
$useMeta['description'] = $site_details->description;
$useMeta['image']       = $site_details->siteimage->url;
$useMeta['width']       = $site_details->siteimage->width;
$useMeta['height']      = $site_details->siteimage->height;
$useMeta['favicon']     = $site_details->favicon->url;
$useMeta['keywords']    = $site_details->keywords;
$useMeta['canonical']   = HUB_DOMAIN; // Default to URL as its home

//* Page metas
$page = $data[$page_slug] ?? false;
if ( is_object($page) && !empty($page->meta) ){
    $page = $page->meta;
    $useMeta['title'] = !empty( $page->title ) ? $page->title .' | '. $siteName : $siteName;
    $useMeta['description'] = !empty( $page->description ) ? $page->description : $site_details->description;
    if ( !empty( $page->image ) ){
        $useMeta['image']  = $page->image->url;
        $useMeta['width']  = $page->image->width;
        $useMeta['height'] = $page->image->height;
    }
    $useMeta['keywords'] = !empty( $page->keywords ) ? $page->keywords : $site_details->keywords;
    $useMeta['canonical'] = $page->canonical ?: HUB_DOMAIN;
}

//* Prepare meta for html rendering
$setTitle = $useMeta['title'] ?? 'Loading...';
$setDescription = $useMeta['description'] ?? 'Generating site...';
$setCanonical = $useMeta['canonical'];

$useMetas = [
    'title' => $setTitle,
    'description' => $setDescription,
    'image' => $useMeta['image'] ?? HUB_DOMAIN . 'static/defaults/siteimg.jpg',
    'width' => $useMeta['width'] ?? '1024',
    'height' => $useMeta['height'] ?? '512',
    'keywords' => $useMeta['keywords'] ?? $setTitle,
    'favicon' => $useMeta['favicon'] ?? HUB_DOMAIN . 'static/defaults/favicon.svg',
    'canonical' => $setCanonical,
];
?>`
)
.replace(
'PHP_SSR_META_INIT', 
`<?php
    // Prepare html metas
    $htmlMetas = '';

    // Add robots noindexing if staging env
    if ( APP_ENV === 'staging' ){
      $htmlMetas .= <<<HTML
      <meta name="robots" content="noindex, nofollow">

      HTML;
    }

    $htmlMetas .= <<<HTML
        <meta name="description" content="{$useMetas['description']}">
        <meta name="keywords" content="{$useMetas['keywords']}">

        <meta property="og:type" content="website">
        <meta id="headOGURL" property="og:url" content="{$useMetas['canonical']}">
        <meta id="headOGSiteName" property="og:site_name" content="$siteName">
        <meta id="headOGTitle" property="og:title" content="{$useMetas['title']}">
        <meta id="headOGDescription" property="og:description" content="{$useMetas['description']}">
        <meta id="headOGImage" property="og:image" content="{$useMetas['image']}">
        <meta id="headOGImageWidth" property="og:image:width" content="{$useMetas['width']}">
        <meta id="headOGImageHeight" property="og:image:height" content="{$useMetas['height']}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site">
        <meta name="twitter:title" content="{$useMetas['title']}">
        <meta name="twitter:description" content="{$useMetas['description']}">
        <meta name="twitter:image" content="{$useMetas['image']}">

        <link rel="icon" href="{$useMetas['favicon']}" sizes="32x32">
        <link rel="icon" href="{$useMetas['favicon']}" sizes="192x192">
        <link rel="apple-touch-icon" href="{$useMetas['favicon']}">

        <link rel="canonical" href="{$useMetas['canonical']}">

        <title>{$useMetas['title']}</title>

    HTML;

  echo $htmlMetas;
?>`
);
fs.writeFileSync(newIndexPHPPath, content);

//* Rename index.html to index.php
const oldIndexHTMLName = 'dist/index.html';
const newIndexHTMLName = 'dist/index.php';
fs.rename(oldIndexHTMLName, newIndexHTMLName, (err) => {
  if (err) {
    console.error('Error renaming index.html:', err);
  }
});

// Generate robots file
const robotsPath = path.join(__dirname, '..', 'dist', 'robots.txt');

// Generate Token file
const tokenPath = path.join(__dirname, '..', 'dist/ssr', 'token.php');

// Generate .htaccess
const htaccesPath = path.join(__dirname, '..', 'dist', '.htaccess');

// Generate files
fs.writeFileSync(robotsPath, robotsData(appURL, isProduction));
fs.writeFileSync(tokenPath, tokenData(process.env.LOCALHOST_API_TOKEN));
fs.writeFileSync(htaccesPath, htaccessData(process.env.CORS_WHITELIST, 'isPHP'));

//! Remove files
// Remove manifest.json (CMS auto generates)
const manifestFilePath = path.join(__dirname, '..', 'dist', 'manifest.json');
fs.unlink(manifestFilePath, (err) => {
  if (err) {
    console.error(`Error removing manifest.json (MUST be removed as CMS generates dynamic manifest.json) - ${err}`);
  }
});

// Remove google file if not production
if (isProduction != 'production') {
    const googleFilePath = path.join(__dirname, '..', 'dist', 'google66e18e915af0a880.html');
    fs.unlink(googleFilePath, (err) => {
        if (err) {
            console.error(`Error removing google verification (production file) - ${err}`);
        }
    });
}