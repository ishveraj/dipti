import { renderToStringAsync, generateHydrationScript, getAssets } from 'solid-js/web';
import { App } from './base';

//* Rendering
export async function render(url) {
    let schema = null;

    const html = await renderToStringAsync(() => 
        <App url={url} setSchema={(s) => { schema = s; }} />
    );

    const hydrationScript = generateHydrationScript(); // get main
    const assets = getAssets(); // get meta tags

    return { html, hydrationScript, assets, schema };
}