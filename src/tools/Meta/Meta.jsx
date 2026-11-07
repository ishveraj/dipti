import { useGlobal } from "@/assets/base";
import { g } from "@/utils/Functions";
import { Link, Meta as MetaTag, Title } from '@solidjs/meta';
import { onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";

// Load favicon once only
export function Favicon(props){
    onMount(() => { 
        if ( !g.isNodeApp ){
            const icon = document.querySelectorAll('[rel="icon"]');
            icon[0].href = props.favicon;
            icon[1].href = props.favicon;
            document.querySelectorAll('[rel="apple-touch-icon"]')[0].href = props.favicon;
        }
    });

    return <>
    <Show when={g.isNodeApp}>
        <Link rel="icon" href={props.favicon} sizes="32x32"/>
        <Link rel="icon" href={props.favicon} sizes="192x192"/>
        <Link rel="apple-touch-icon" href={props.favicon} />
    </Show>
    </>;
}

// Generate SEO markup schema
const generateSchema = (props, siteDetails) => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${props.canonical}#webpage`,
                "url": props.canonical,
                "name": props.title,
                "description": props.description,
                "isPartOf": { "@id": `${g.domain}#website` },
                "publisher": { "@id": `${g.domain}#organization` }
            },
            {
                "@type": "WebSite",
                "@id": `${g.domain}#website`,
                "url": g.domain,
                "name": siteDetails.site_settings.sitename,
                "publisher": { "@id": `${g.domain}#organization` }
            },
            {
                "@type": "Organization",
                "@id": `${g.domain}#organization`,
                "name": siteDetails.site_settings.sitename,
                "url": g.domain,
                "logo": siteDetails.site_settings.logo.url
            },
        ]
    };

    return JSON.stringify(schema);
};

export function Meta(props){
    const global = useGlobal();

    return <>
    <Show when={global?.siteSettings()}>{(s) => {
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
            useMeta[element] = (d && Object.keys(d).length !== 0) ? d : s().meta[element];
        });
            
        // Set title to ensure doesn't duplicate
        const useTitle = useMeta['title'] && useMeta['title'] != s().meta.siteName ? 
                        `${useMeta['title']} | ${s().meta.siteName}` : 
                        s().meta.siteName;

        // Pass back to global for Node SSR
        const schema = generateSchema(useMeta, s());
        global.setSchema?.(schema);

        // Mount schema for client side
        if ( !isServer ){
            let el = document.getElementById('headSchema');
            if (!el) {
                el = document.createElement('script');
                el.type = 'application/ld+json';
                el.id = 'headSchema';
                document.head.appendChild(el);
            }
            el.innerText = schema;
        }

        // PHP app must clear tags for repopulation
        if ( !g.isNodeApp ){
            document.querySelectorAll('meta').forEach(meta => meta.remove());
            document.querySelectorAll('[rel="canonical"]').forEach(canonical => canonical.remove());
            document.querySelector('title')?.remove();
        }

        return <>
        <MetaTag name="description" content={useMeta['description']} />
        <MetaTag name="keywords" content={useMeta['keywords']} />

        <MetaTag property="og:type" content="website" />
        <MetaTag property="og:url" content={useMeta['canonical']} />
        <MetaTag property="og:site_name" content={s().meta.siteName} />
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
    }}</Show>
    </>;
}

