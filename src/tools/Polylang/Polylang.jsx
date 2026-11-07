import { createEffect, createResource, createSignal, on } from "solid-js";
import { render } from "solid-js/web";
import { useAPI } from "@/utils/CMS/CMS";
import { envGuard } from "@/utils/Functions";

//* Adjust html code here to return for your language switch
const LangButtons = (props) => {
  //! cannot <a link> as must refresh on lang change
  return <>
  <li>
    <a
      class={currentLang() === props.data.slug ? 'active' : ''} 
      href={envGuard(props.data.url)} 
      onClick={() => setAppLang( props.data.slug )}
    >
      {props.data.name}
    </a>
  </li>
  </>;
}

// Navbar menu switcher
export const [currentLang, setCurrentLang] = createSignal();

// Ensures default lang is set correctly on page load (only once)
let hasPageLoaded = false;

// Static content change controller
export const LangController = (props) => {
    return <>
    <Show when={currentLang() === props.lang}>
      {props.children}
    </Show>
    </>;
}

// Set the cookie language when changed
const setAppLang = (slug) => {
  setCurrentLang( slug );
  document.documentElement.lang = slug;
}

// Main language switch button controller
export const PolyLangSwitcher = (props) => {
  const [response] = createResource(() => useAPI(`public/polylang/main/lang-switcher?postID=${props.postID}`));

  createEffect(on(response, (response) => {
    if ( response ){
      // Runs everytime page is changed
      if ( response.langSwitcher && response.defaultLang ){
        // Empty lang switcher once when page changes
        const el = document.querySelectorAll(props.el),
               r = response.langSwitcher;

        el.forEach(polyLangElem => {
            polyLangElem.innerHTML = '';
        });
        
        // Loop through languages
        Object.keys(r).forEach(function(key){
          if ( !hasPageLoaded  ){
            if ( window.location.href.includes(`/${r[key].slug}/`) ){
              setAppLang( r[key].slug );
              hasPageLoaded = true;
            }
          }

          // Create the menu that has languages
          if ( !r[key].no_translation && el ){
            el.forEach(polyLangElem => {
              render(() => <LangButtons data={r[key]}/>, polyLangElem);
            });
          }
        });

        // Set default translation if does not exist
        if ( !hasPageLoaded ) setAppLang( response.defaultLang );
      }
    }
  }));
};

export default { 
  PolyLangSwitcher,
  LangController,
  currentLang
};