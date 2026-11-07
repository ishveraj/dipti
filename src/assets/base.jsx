import Footer from '@/components/Footer/Footer';
import { Navbar } from '@/components/Navbar/Navbar';
import { CSPWhiteList, RegisteredMenus } from '@/index';
import NotFound from '@/pages/404/404';
import { CSP } from '@/tools/CSP/CSP';
import { Favicon } from '@/tools/Meta/Meta';
import { currentLang, setCurrentLang } from '@/tools/Polylang/Polylang';
import { getStaticFields, useAPI } from '@/utils/CMS/CMS';
import Routing from '@/utils/CMS/Routing';
import { envGuard, g } from '@/utils/Functions';
import { MetaProvider } from '@solidjs/meta';
import { Router, useRoutes } from '@solidjs/router';
import { createContext, createResource, createSignal, DEV, onMount, Suspense, useContext } from 'solid-js';
import './scss/style.scss';

const routes = [
    {
        path: '/*slug',
        component: Routing,
    },
    {
        path: g.base + '404-not-found',
        component: NotFound,
    },
];

const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export function App({ url, setSchema }) {
    const Routes = useRoutes(routes);

    // Tabs global signal tracker
    const [tabs, setTabs] = createSignal({}, { equals: false }); 
    
    // Import lottie scripts
    onMount(async () => {
        await import('@lottiefiles/lottie-player');
    });

    // Call global functions
    onMount(() => {

    });

    // Default language
    if ( g.langSupport === 'single' ) setCurrentLang('en');

    // Get site settings
    const [siteSettings] = createResource(currentLang, async (lang) => {
        const data = await getStaticFields('site_settings');

        if ( g.langSupport === 'single' ){
            data.meta = {
                siteName: data.site_settings.sitename,
                title: data.site_settings.sitename,
                description: data.site_settings.description,
                image: data.site_settings.siteimage,
                keywords: data.site_settings.keywords,
                canonical: g.domain,
                favicon: data.site_settings.favicon.url,
            };
        }
        else {
            data.meta = {
                siteName: data[lang].site_settings.sitename,
                title: data[lang].site_settings.sitename,
                description: data[lang].site_settings.description,
                image: data[lang].site_settings.siteimage,
                keywords: data[lang].site_settings.keywords,
                canonical: g.domain,
                favicon: data[lang].site_settings.favicon.url,
            };

            data.site_settings = data[lang].site_settings;
        }

        return data;
    });

    // Get menus/pages
    const [menu] = createResource(currentLang, async (lang) => {
        const data = await useAPI('public/site/menus/list-menus');

        // generate navbar menu
        const tempMenus = {};
        const generateMenu = (m, menuName) => {
            //! Menu does not exist
            if ( !m ){
                if ( DEV ){
                    console.error(`Menu ${menuName} is used in src/index.jsx but does not exist in public/backend/App/templates.php`);
                }

                return false;
            }

            const menu = [];

            Object.keys(m).forEach(i => {
                let childLinks = [];

                if ( m[i].has_children ){
                    let subm = m[i];

                    Object.keys(subm.children).forEach(i => {
                        if ( typeof subm.children[i] === 'object' ){
                            childLinks.push({
                                id: subm.children[i].id,
                                class: subm.children[i].class,
                                path: envGuard(subm.children[i].slug),
                                label: subm.children[i].label
                            });
                        }
                    });
                }
            
                menu.push({
                    id: m[i].id,
                    class: m[i].class,
                    path: envGuard(m[i].slug),
                    label: m[i].label,
                    child: childLinks
                });
            });
    
            tempMenus[menuName] = menu;
        }

        if ( g.langSupport === 'single' ){
            if ( data.menus ){
                RegisteredMenus.forEach(menuName => {
                    generateMenu( data.menus[menuName], menuName ); 
                });
            }

            // Localize page for single lang
            for (const key in data.pages) {
                if (Object.prototype.hasOwnProperty.call(data.pages, key)) {
                    if ( 
                        typeof data.pages[key] === 'undefined'
                        && DEV 
                    ){
                        console.error('Please ensure CMS > Pages templates are set.');
                    }

                    data.pages[key] = envGuard(data.pages[key]);
                }
            }

            // Set menus
            const menus = tempMenus;

            // Set pages
            const pages = data.pages;

            // Return single menu/pages
            return { menus, pages };
        }
        else {
            RegisteredMenus.forEach(menuName => {
                generateMenu( data.menus[menuName][lang], menuName ); 
            });

            // Get current lang pages
            for (const key in data.pages) {
                if (Object.prototype.hasOwnProperty.call(data.pages, key)) {
                    if ( 
                        typeof data.pages[key][lang] === 'undefined'
                        && DEV 
                    ){
                        console.error(`Please ensure CMS > Pages templates are set for {${lang}} language.`);
                    }
                    
                    data.pages[key] = envGuard(data.pages[key][lang]);
                }
            }

            // Set menus
            const menus = tempMenus;

            // Set pages
            const pages = data.pages;

            return { menus, pages };
        }
    });
    
    return <>
    <CSP whiteList={CSPWhiteList}/>

    <GlobalContext.Provider value={{ 
        siteSettings: siteSettings, 
        menu: () => menu()?.menus, 
        pages: () => menu()?.pages,
        setSchema: setSchema,
        tabs,
        setTabs
    }}>
    <Router url={url}>
        <MetaProvider>
            <Suspense> 
                <Show when={siteSettings()}>        
                    <Favicon favicon={siteSettings().meta.favicon}/>
                </Show>
                
                <Navbar/>
                <main>
                    <Routes/>
                </main>
                <Footer/>
            </Suspense> 
        </MetaProvider>
    </Router>
    </GlobalContext.Provider>
    </>;
}