import { CSPWhiteList } from '@/index';
import NotFound from '@/pages/404/404';
import Home from '@/pages/Home/Home';
import { CSP } from '@/tools/CSP/CSP';
import { g } from '@/utils/Functions';
import { MetaProvider } from '@solidjs/meta';
import { Router, useRoutes } from '@solidjs/router';
import { createContext, createSignal, Suspense, useContext } from 'solid-js';
import './scss/style.scss';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/404-not-found',
        component: NotFound,
    },
    {
        path: '*',
        component: NotFound,
    },
];

const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export function App() {
    const Routes = useRoutes(routes);

    // Tabs global signal tracker
    const [tabs, setTabs] = createSignal({}, { equals: false }); 
    
    return <>
    <CSP whiteList={CSPWhiteList}/>

    <GlobalContext.Provider value={{ 
        tabs,
        setTabs
    }}>
    <Router base={g.base}>
        <MetaProvider>
            <Suspense> 
                <main>
                    <Routes/>
                </main>
            </Suspense> 
        </MetaProvider>
    </Router>
    </GlobalContext.Provider>
    </>;
}