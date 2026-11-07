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
      solidPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
      outDir: 'docs',
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
