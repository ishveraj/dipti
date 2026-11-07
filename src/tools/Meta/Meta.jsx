import { useGlobal } from "@/assets/base";
import { g } from "@/utils/Functions";
import { Link, Meta as MetaTag, Title } from '@solidjs/meta';
import { isServer } from "solid-js/web";

// Load favicon once only
export function Favicon(props){
    return <>
        <Link rel="icon" href={`${g.base}static/defaults/favicon.png`} sizes="32x32"/>
        <Link rel="icon" href={`${g.base}static/defaults/favicon.png`} sizes="192x192"/>
        <Link rel="apple-touch-icon" href={`${g.base}static/defaults/favicon.png`} />
    </>;
}

export function Meta(props){
    const global = useGlobal();

    const defaultMeta = [
        'title',
        'description',
        'image',
        'keywords',
        'canonical',
    ];
    const useMeta = [];

    // Check if meta is set, else use defaults
    defaultMeta.forEach(element => {
        const d = props.data[element];
        useMeta[element] = (d && Object.keys(d).length !== 0) ? d : false;
    });
        
    // Set title to ensure doesn't duplicate
    const useTitle = useMeta['title'] && useMeta['title'] != false ? 
                    `${useMeta['title']}` : 
                    false;

    // Mount schema for client side
    if ( !isServer ){
        let el = document.getElementById('headSchema');
        if (!el) {
            el = document.createElement('script');
            el.type = 'application/ld+json';
            el.id = 'headSchema';
            document.head.appendChild(el);
        }
    }

    // PHP app must clear tags for repopulation
    if ( !g.isNodeApp ){
        document.querySelectorAll('meta').forEach(meta => meta.remove());
        document.querySelectorAll('[rel="canonical"]').forEach(canonical => canonical.remove());
        document.querySelector('title')?.remove();
    }

    return <>
        <Favicon/>
        <MetaTag name="description" content={useMeta['description']} />
        <MetaTag name="keywords" content={useMeta['keywords']} />

        <MetaTag property="og:type" content="website" />
        <MetaTag property="og:url" content={useMeta['canonical']} />
        <MetaTag property="og:site_name" content={useTitle} />
        <MetaTag property="og:title" content={useTitle} />
        <MetaTag property="og:description" content={useMeta['description']} />
        <MetaTag property="og:image" content={useMeta['image']?.url} />
        <MetaTag property="og:image:width" content={useMeta['image']?.width} />
        <MetaTag property="og:image:height" content={useMeta['image']?.height} />

        <MetaTag name="twitter:card" content="summary_large_image" />
        <MetaTag name="twitter:site" />
        <MetaTag name="twitter:title" content={useTitle} />
        <MetaTag name="twitter:description" content={useMeta['description']} />
        <MetaTag name="twitter:image" content={useMeta['image']?.url} />

        <Link rel="canonical" href={useMeta['canonical']} />

        <Title>{useTitle}</Title>
    </>;
}

