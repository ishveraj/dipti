import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

dotenv.config(); // Load environment configs

export default defineConfig(() => {
  const isSSR = (process.env.NODE_APP === 'yes' && process.env.BUILD_TARGET === 'server') ? true : false;

  // Local dev
  let basePath = '/';
  let localAPIToken = process.env.LOCALHOST_API_TOKEN ? btoa(`Webmaster:${process.env.LOCALHOST_API_TOKEN}`) : false;

  // Building app
  if ( process.env.BUILD_MODE ){
    basePath = (process.env.BUILD_MODE === 'production') ? process.env.PRODUCTION_PATH : process.env.STAGING_PATH;
    localAPIToken = false;
  }

  return {
    server: {
      port: 3000,
      hmr: true, // auto refresh on save (turn off during dev if lots of API calls)
    },
    plugins: [
      solidPlugin({ ssr: isSSR }),
      {
        name: 'dev-start',
        apply: 'serve',
        transformIndexHtml(html) {
          // For nodeJS app
          if ( process.env.NODE_APP === 'yes' ){
            return html
            .replace(/\s*PHP_SSR_INIT\s*/g, '')
            .replace('PHP_SSR_META_INIT' ,'<!--metatags-->')
          }
          // For PHP app
          else {
          return html
            .replace(/\s*PHP_SSR_INIT\s*/g, '')
            .replace(
              'PHP_SSR_META_INIT', 
              `<meta name="description">
    <meta name="keywords">

    <meta property="og:type" content="website">
    <meta id="headOGURL" property="og:url">
    <meta id="headOGSiteName" property="og:site_name">
    <meta id="headOGTitle" property="og:title">
    <meta id="headOGDescription" property="og:description">
    <meta id="headOGImage" property="og:image">
    <meta id="headOGImageWidth" property="og:image:width">
    <meta id="headOGImageHeight" property="og:image:height">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site">
    <meta name="twitter:title">
    <meta name="twitter:description">
    <meta name="twitter:image">

    <link rel="icon" sizes="32x32">
    <link rel="icon" sizes="192x192">
    <link rel="apple-touch-icon">

    <link rel="canonical">

    <title></title>`);
          }
        },
      }
    ],
    ssr: isSSR ? {
      noExternal: /./,
    } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
      outDir: 'dist',
      emptyOutDir: !isSSR,
      ssr: isSSR,
      copyPublicDir: isSSR ? false : true,
      rollupOptions: isSSR
      ? { 
        input: 'server.js',
        output: {
          format: 'esm',
          inlineDynamicImports: true,  // ← forces everything into one file
          entryFileNames: 'server.js',
        }
      }
      : {},
    },
    base: basePath,
    define: {
      VITE_SERVER_URL: JSON.stringify(process.env.HUB_DOMAIN),
      VITE_LANG_SUPPORT: JSON.stringify(process.env.LANGUAGE_SUPPORT),
      VITE_LOCAL_API_TOKEN: JSON.stringify(localAPIToken),
      VITE_NODE_APP: JSON.stringify(process.env.NODE_APP)
    }
  };
});
