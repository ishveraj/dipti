import { RegisteredTemplates } from '@/index';
import { PolyLangSwitcher } from "@/tools/Polylang/Polylang";
import { g } from '@/utils/Functions';
import { useLocation, useParams } from "@solidjs/router";
import { createEffect, createMemo, createResource, on, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { getPreviewFields, getStaticFields } from './CMS';

//* Routing page change controllers
export default function Routing(){
    let timeoutPageExit, timeoutPageEnter, pageExitDuration, pageEnterDuration, pageEl, rootEl;

    onMount(() => {
       pageEl = document.querySelector('main'); 
       rootEl = document.getElementById('root'); 
    });

    // Get current slug
    const params = useParams();

    // Get search params
    const searchParams = useLocation();

    // Fetch page data
    const [pageData] = createResource(() => params.slug, async (slug) => {
        // Page exit animation control
        if ( !isServer && pageEl ){
            const pageHeight = pageEl.offsetHeight;
            if ( pageHeight > 0 ) pageEl.style.minHeight = `${pageHeight}px`;
            rootEl.querySelectorAll('a').forEach(a => a.classList.add('locked'));
            pageEl.classList.add('page-exit');
            pageExitDuration = parseFloat(getComputedStyle(pageEl).animationDuration) * 1000;
            clearTimeout(timeoutPageExit);
        }

        // Fetch main or preview
        let data;
        const params = new URLSearchParams(searchParams.search);
        const previewID = params.get('preview_id'), 
              previewNX = params.get('preview_nx');
        if ( previewID && previewNX ) data = await getPreviewFields(slug);
        else data = await getStaticFields(slug);

        // Only delay on the client (e.g. to let an exit animation play out)
        if (!isServer) {
            await new Promise((resolve) => setTimeout(resolve, pageExitDuration));
        }

        return data;
    });

    // Prepare page template
    const Template = createMemo(() => {
        if (!pageData()) return null;

        // Redirect/Return 404 if not found
        if ( pageData()['404'] || !RegisteredTemplates[pageData()?.component] ){
            if ( !isServer ) window.location.href = g.base + '404-not-found';
            else return { 
                component: '404',
                data: null,
            };
        }
        else if ( g.langSupport === 'multiple' && !isServer ){
            /**
             * Multi Lang Support
             * you need to add a tag in navbar, or anywhere else for the lang switch widget
             * el refers to the class OR ID of that tag
             */
            PolyLangSwitcher({
                el: '.polylangswitcher',
                postID: pageData().post_details.ID
            });
        }

        // Return template data back to page
        const templateKey = pageData().component;
        
        return {
            component: templateKey,
            data: pageData(),
        };
    });

    // Animate page after change
    createEffect(on(Template, (t) => {
        if (!t) return;

        // Load new template data
        timeoutPageExit = setTimeout(() => {
            requestAnimationFrame(() => {
                // Lenis page change, start from top
                if ( window.lenis ) window.lenis.scrollTo(0, { immediate: true });
                else window.scrollTo(0, 0);
            });
        }, 0);

        // Page enter animation control (run onload)
        pageEl.classList.add('page-enter');
        pageEnterDuration = parseFloat(getComputedStyle(pageEl).animationDuration) * 1000;
        clearTimeout(timeoutPageEnter);

        timeoutPageEnter = setTimeout(() => {
            requestAnimationFrame(() => {
                rootEl.querySelectorAll('a').forEach(a => a.classList.remove('locked'));
                pageEl.classList.remove('page-exit');
                pageEl.classList.remove('page-enter');
                pageEl.style.minHeight = '';
            });
        }, pageEnterDuration);
    }));

    //* Render the page component
    return <>
    <Show when={Template()} keyed>
        {() => {
            const Component = RegisteredTemplates[Template().component].component;
            return <Component {...Template().data} />;
        }}
    </Show>
    </>;
}