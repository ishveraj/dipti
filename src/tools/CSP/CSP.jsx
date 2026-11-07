import { onMount, DEV } from 'solid-js';

export function CSP(props){
    // Custom whitelist
    const whitelist = props.whiteList ?? [];

    const defaultList = [
        // GTM
        'https://*.googletagmanager.com', 
        'https://tagmanager.google.com',
        // Google
        'https://*.google.com',
        // Analytics
        'https://*.gstatic.com',
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://stats.g.doubleclick.net',
        'https://*.g.doubleclick.net',
        // Youtube
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://i.ytimg.com',
        // Social media sharing addtoany
        'https://static.addtoany.com',
        'https://stats.addtoany.com',
        // Lottie JS
        'https://unpkg.com/@lottiefiles/',
    ];

    // Merge whitelists
    const combinedList = [...defaultList, ...whitelist].join(' ');

    onMount(() => {
      if ( !DEV ){
        setTimeout(() => {
            const metaCSPTag = document.createElement('meta');
            metaCSPTag.setAttribute('http-equiv', 'Content-Security-Policy');
            metaCSPTag.setAttribute('content', `object-src 'none'; base-uri 'self';upgrade-insecure-requests; form-action 'none'; default-src 'self' ${combinedList} blob:; style-src 'self' 'unsafe-inline'; frame-src 'self' ${combinedList}; font-src 'self' data:; img-src 'self' ${combinedList} data: blob:;`);
            document.head.appendChild(metaCSPTag);
            metaCSPTag.remove();
        }, 0);
      }
    });
}