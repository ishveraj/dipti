const fs = require('fs');
const path = require('path');
const { robotsData, tokenData, htaccessData } = require('./globals');
require('dotenv').config();

const isProduction = process.env.BUILD_MODE;
const appURL = process.env.HUB_DOMAIN;

// Before build
function pre() {
    let serverData = `import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '@/assets/entry-server';

const BASE = '${isProduction === 'production' ? process.env.PRODUCTION_PATH?.replace(/\/$/, '') : process.env.STAGING_PATH?.replace(/\/$/, '')}';

const __dirname = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(__dirname, 'index.html'), 'utf-8');

// Remove duplicate tags
function dedupeTags(assetsHtml) {
    const seen = new Set();
    return assetsHtml.replace(/<(meta|link|title)[^>]*>/gi, (tag) => {
        // normalize tag for comparison
        const key = tag.replace(/\s+/g, ' ').trim();
        if (seen.has(key)) return ''; // remove duplicate
        seen.add(key);
        return tag;
    });
}
    
createServer(async (req, res) => {
    req.url = req.url.replace(BASE, '');

    if (req.url.startsWith('/assets/') || req.url.startsWith('/static/')) {
    const file = readFileSync(join(__dirname, req.url));
    
    const ext = req.url.split('.').pop();
    const mime = {
        'js':    'application/javascript',
        'css':   'text/css',
        'json':  'application/json',
        'png':   'image/png',
        'jpg':   'image/jpeg',
        'jpeg':  'image/jpeg',
        'gif':   'image/gif',
        'svg':   'image/svg+xml',
        'ico':   'image/x-icon',
        'webp':  'image/webp',
        'woff':  'font/woff',
        'woff2': 'font/woff2',
    };

    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(file);
    return;
    }

    const { html: appHtml, hydrationScript, assets, schema } = await render(req.url);
    const dedupedAssets = dedupeTags(assets);

    const html = template
    .replace('<!--app-->', appHtml)
    .replace('<!--metatags-->', dedupedAssets)
    .replace('<script type="application/ld+json" id="headSchema"></script>', \`\${schema ? \`<script type="application/ld+json" id="headSchema">\${schema}</script>\` : ''}\`)
    .replace('</head>', \`\${hydrationScript}</head>\`);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}).listen(3000);
    `;

    const serverPath = path.join(__dirname, '..', '', 'server.js');
    fs.writeFileSync(serverPath, serverData);
}

// After build
function post() {

// Remove PHP SSR points
const newIndexPath = 'dist/index.html';
let content = fs.readFileSync(newIndexPath, 'utf8');
content = content
.replace('PHP_SSR_INIT', '')
.replace('PHP_SSR_META_INIT', '<!--metatags-->');
fs.writeFileSync(newIndexPath, content);

// Generate robots file
const robotsPath = path.join(__dirname, '..', 'dist', 'robots.txt');

// Generate Token file
const tokenPath = path.join(__dirname, '..', 'dist/ssr', 'token.php');

// Generate .htaccess
const htaccesPath = path.join(__dirname, '..', 'dist', '.htaccess');

// Generate files
fs.writeFileSync(robotsPath, robotsData(appURL, isProduction));
fs.writeFileSync(tokenPath, tokenData(process.env.LOCALHOST_API_TOKEN));
fs.writeFileSync(htaccesPath, htaccessData(process.env.CORS_WHITELIST, 'isNodeJS'));

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

// Remove server.js generated
const serverJSFilePath = path.join(__dirname, '..', '', 'server.js');
fs.unlink(serverJSFilePath, (err) => {
  if (err) {
    console.error(`Error removing server.js - ${err}`);
  }
});

}


module.exports = { pre, post };