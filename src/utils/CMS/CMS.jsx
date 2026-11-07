import { Navbar } from "@/pages/Dashboard/Navbar/Navbar";
import { Unauthorized } from "@/pages/Dashboard/Unauthorized/Unauthorized";
import { g } from "@/utils/Functions";
import { createRoot, createSignal, DEV, Match, onMount, Show, Switch } from "solid-js";

//* Get preview data
export const getPreviewFields = async (previewData) => {
    const response = await fetch(`${g.domain}hub/api/preview/?preview_nx=${previewData[1]}&preview_id=${previewData[0]}`);
    return await response.json();
};

//* Fetch cache of page/post
let formatted_base = g.base;
formatted_base = formatted_base[0] === '/' ? formatted_base.replace(/^\//, '') : formatted_base;
formatted_base = formatted_base[formatted_base.length-1] === '/' ? formatted_base.replace(/\/$/, '') : formatted_base;
formatted_base = formatted_base.length === 0 ? '/' : formatted_base;

const cacheStatic = new Map();
export const getStaticFields = async (pageSlug) => {
    // Remove base
    if ( pageSlug.length > 1 && pageSlug.startsWith(formatted_base) ){
        pageSlug = pageSlug.replace(formatted_base, '');
    }

    // Remove first slash if any
    if ( pageSlug.length > 1 && pageSlug[0] === '/' ){
        pageSlug = pageSlug.replace(/^\//, '');
    }

    // Remove last slash if any
    let tempSlugLength = pageSlug.length;
    if ( tempSlugLength > 1 && pageSlug[tempSlugLength-1] === '/' ){
        pageSlug = pageSlug.replace(/\/$/, '');
    }

    // Default to / if empty
    pageSlug = pageSlug.length === 0 ? '/' : pageSlug;

    // return cache data if already fetched
    const cachedData = cacheStatic.get(pageSlug);
    if ( cachedData ) return cachedData;

    // Prepare to fetch if no cache data
    let tempForm = new FormData();
    tempForm.append('slug', pageSlug);

    // Set options
    const options = {
        method: 'POST',
        body: tempForm,
    };

    // Set dev token
    if ( DEV ){
        options.headers = {'Authorization': 'Basic ' + g.devToken};
    }

    // Trigger client fetch
    const response = await fetch(`${g.domain}ssr/client.php`, options);

    try {
        const jsonData = await response.json();

        //! Throw err
        if (jsonData.err && DEV) {
            console.error(jsonData.err);
            return false;
        }

        // Set cache data after fetch
        cacheStatic.set(pageSlug, jsonData); 

        return jsonData;

    } catch (err) {
        if (DEV) {
            console.error(`${err} found when running ssr/client.php using ${pageSlug}`);
        }
    }
};

//* Use dynamic api feature
const cacheAPI = new Map();
export const useAPI = async (
    endPoint, {
        method = 'get', 
        cache = true,
        body = false,
        returnPDF = false,
    } = {}
) => {
    // return cache data if already fetched
    if (cache){
        const cachedData = cacheAPI.get(`${method}-${endPoint}`);
        if (cachedData) return cachedData;
    }

    // Set method parameters
    const options = {method: method.toUpperCase()};
    method = method.toLowerCase();

    // Set dev token
    if ( DEV ) options.headers = {'Authorization': 'Basic ' + g.devToken};

    // Set bearer if private api call
    if (endPoint.startsWith('private')){
        const atk = localStorage.getItem('aTK');

        //! No permission
        if (!atk){
            if ( DEV ) console.error('Private API calls require valid login tokens');
            return false;
        }

        options.headers = {'Authorization': 'Bearer ' + atk};
    }

    // Add body if set
    if (body){
        const formData = new FormData();

        Object.keys(body).forEach((v) => {
            formData.append(v, body[v]);
        });

        options.body = formData;
    }

    // Cache disabled hence ensure API calls are unique to bypass other caches
    if ( !cache ){
        const cacheTimestamp = new Date().getTime();
        if ( endPoint.includes('?') ) endPoint += '&' + cacheTimestamp;
        else endPoint += '?' + cacheTimestamp;
    }

    // Default endpoint
    let apiDomain = `${g.domain}hub/api/${method}/${endPoint}`;

    // External domain endpoint
    if (endPoint.startsWith('https://')) apiDomain = endPoint;

    //* Test API first
    try {
        // Trigger API fetch
        const response = await fetch(apiDomain, options);
        
        //! Has server error
        if ( !response.ok ){
            console.error(`Server error: ${response.status}`);
        } 
        //* API is fine!
        else {
            // Return PDF
            if ( returnPDF ){
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // You can now display the PDF in an <iframe>
                //document.getElementById('pdfFrame').src = url;

                // Or open it in a new tab
                window.open(url);

                // Cleanup: revoke the object URL when no longer needed
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 30000);
                
                return true;
            }

            const jsonData = await response.json();

            // Set cache data after fetch
            if (cache) {
                cacheAPI.set(`${method}-${endPoint}`, jsonData); 
            }

            // Return data
            return jsonData;
        }
    } 
    //! Has network error
    catch (error) {
        console.error('Fetch failed:', error);
    }

    return false;
};

//* Shows content only if user is authorized (handled in onMount below)
export const [authentication, setAuthentication] = createSignal('loading');
export const [getUser, setGetUser] = createSignal();
export const LogControl = (props) => {
    if ( props.onLoad ) props.onLoad();

    return <>
    <Show when={authentication()}>
        <Switch>
            <Match when={authentication() === 'success'}>{() => {
                onMount(() => {
                    const root = document.getElementById('root');
                    root.classList.remove('navbar-space');

                    const main = document.querySelector('main');
                    main.classList.add('dashboard-layout');

                    const navbar = document.querySelector('.navbar');
                    navbar.remove();

                    const footer = document.querySelector('footer');
                    footer.remove();
                });

                if ( props.success ) props.success();
                
                return <>
                    <Navbar/>
                    {props.children}
                </>;
            }}</Match>
        </Switch>

        <Switch>
            <Match when={authentication() === 'fail'}>
                <Show when={props.fail} fallback={<Unauthorized/>}>
                  {props.fail}
                </Show>
            </Match>
        </Switch>
    </Show>
    </>;
};

createRoot(() => {
    onMount(() => { 
        // Set html lang if single
        if ( g.langSupport === 'single' ) document.documentElement.lang = 'en';

        //* Check if user is logged
        if ( localStorage.getItem('aTK') ){
            const access = useAPI('private/accounts/users/auth');
            access.then(function(data){
                if ( !data.access ) setAuthentication('fail');
                else {
                    setAuthentication('success');
                    setGetUser(data.user);
                }
            });
        }
        else setAuthentication('fail');
    });
});