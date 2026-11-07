// Robots txt
export const robotsData = (appURL, env) => {
  if ( env === 'production' ){
  return `Sitemap: ${appURL}hub/wp-sitemap.xml

User-Agent: *
Allow: /
Allow: /hub/media/
Allow: /hub/wp-sitemap*
Allow: /hub/api/get/public/*
Allow: /ssr/client.php

Disallow: /backend/
Disallow: /hub/
Disallow: /ssr/
`;
}
else return `User-agent: *
Disallow: /
`;
}

// Token file
export const tokenData = (token) => {
  return `<?php 
if ( !defined('ALLOW_TOKEN_LOAD' ) ){
    header("HTTP/1.1 403 Forbidden");
    exit(json_encode(["err" => "Bad token load request ID 1"]));
}

define('API_TOKEN', '${token}');
`;
}

// htaccess file
export const htaccessData = (cors, type) => {
let htaccessData = `# Prevent view of web folders
Options -Indexes`;

// Add CORS to .htaccess
if ( cors ){
  htaccessData = `${htaccessData}

# CORS whitelist
<IfModule mod_headers.c>
  SetEnvIf Origin "^http(s)?://(.+\.)?(${cors.split(", ").join("|")})$" origin_is=$0
  Header always set Access-Control-Allow-Origin %{origin_is}e env=origin_is

  Header always set Access-Control-Allow-Credentials "true"
  Header always set Access-Control-Allow-Methods "GET, POST"
  Header always set Access-Control-Allow-Headers "Authorization"
  Header always set Access-Control-Max-Age "3600"
  SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
</IfModule>
`;
}

htaccessData = `${htaccessData}
# X Protection
<IfModule mod_headers.c> 
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-XSS-Protection "0" 
  Header set X-Content-Type-Options nosniff
  Header set X-Frame-Options DENY  
  Header unset X-Powered-By
  Header set Server Gaboola
  Header always edit Set-Cookie ^(.*)$ $1;Secure;SameSite=None
  
  <filesMatch "index\.php$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </filesMatch>

  <filesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </filesMatch>

  <filesMatch "\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </filesMatch>

  <filesMatch "\.(ico|pdf|flv|jpg|jpeg|png|gif|swf|woff|woff2|ttf|eot|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </filesMatch>

  <FilesMatch "\.(mp4)$">
    Header set Cache-Control "max-age=31536000, public"
    Header set Accept-Ranges bytes
    Header set Content-Type "video/mp4"
  </FilesMatch>

  <FilesMatch "\.(webm)$">
    Header set Cache-Control "max-age=31536000, public"
    Header set Accept-Ranges bytes
    Header set Content-Type "video/webm"
  </FilesMatch>

  <FilesMatch "\.(ogg)$">
    Header set Cache-Control "max-age=31536000, public"
    Header set Accept-Ranges bytes
    Header set Content-Type "video/ogg"
  </FilesMatch>
</IfModule>

# Block access to php.ini
<Files php.ini>
order allow,deny
deny from all
</Files>

# SSL Rewrite & Redirect www to non-www
<IfModule mod_rewrite.c>
  RewriteEngine on

  # Ensure Authorization header goes to PHP
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
  
  # Redirect www to non-www
  RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
  RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [R=301,L]

  # Redirect from HTTP to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
  
  # Remove trailing slash
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} (.+)/$
  RewriteRule ^ %1 [R=301,L]
  
  # Disable TRACE method
  RewriteCond %{REQUEST_METHOD} ^TRACE
  RewriteRule .* - [F,L]
  
  # Prevent malicious query strings
  RewriteCond %{QUERY_STRING} (<|%3C).*script.*(>|%3E) [NC,OR]
  RewriteCond %{QUERY_STRING} GLOBALS(=|[|%[0-9A-Z]{0,2}) [OR]
  RewriteCond %{QUERY_STRING} _REQUEST(=|[|%[0-9A-Z]{0,2})
  RewriteRule ^(.*)$ ${type === 'isNodeJS' ? 'index.html' : 'index.php' } [F,L]
  
  ${type === 'isPHP' ? `# Rewrite requests to index.php if the requested file is not found
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.php [QSA,L]` : ''}
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
  # Compress HTML, CSS, JavaScript, Text, XML and fonts
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml

  # Remove browser bugs (only needed for really old browsers)
  BrowserMatch ^Mozilla/4 gzip-only-text/html
  BrowserMatch ^Mozilla/4\.0[678] no-gzip
  BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
  SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|zip|gz|tgz|htc)$ no-gzip dont-vary
  SetEnvIfNoCase Referer .* self_referer=no
  SetEnvIfNoCase Referer ^https://%{HTTP_HOST}% self_referer=yes
  SetEnvIf self_referer ^no$ no-gzip
  Header append Vary User-Agent env=!dont-vary
</IfModule>

Options +FollowSymLinks`;

return htaccessData;
}