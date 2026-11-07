import { useGlobal } from '@/assets/base';
import { useLocation } from '@solidjs/router';
import { createContext, createSignal, onMount, Show, useContext } from 'solid-js';
import './Tab.style.scss';

const TabsParent = createContext();

//* Parent Tabs
export function Tabs(props){
  const [ showTab, setShowTab ] = createSignal(false);
  const { setTabs } = useGlobal();

  // Add tab ID to init lists
  setTabs(tabs => {
    if ( !tabs[props.target] ){
      tabs[props.target] = {
        get: showTab,
        set: setShowTab,
      }
    }
    return tabs;
  });

  return <>
  <TabsParent.Provider value={{
    target: props.target,
    allowURLChange: !props?.disableURLChange,
  }}>
    <div class={`tabs ${props.target}`}>
      {props.children}
    </div>
  </TabsParent.Provider>
  </>;
}

//* Each tab buttons
export function Tab(props){
  const thisParent = useContext(TabsParent);
  const { tabs } = useGlobal();

  // Set selected tab
  if ( props.selected ) onMount(() => tabs()[thisParent.target].set(props.target) );

  return <>
  <div 
    class={`tab ${props.target} ${props.class ?? ''}`}
    classList={{ selected: tabs()[thisParent.target].get() === props.target }} 
    onClick={(e) => {
      if ( thisParent.allowURLChange ){
        const url = new URL(window.location);
        url.searchParams.set('tab', props.target);
        window.history.replaceState({}, '', url);
      }

      tabs()[thisParent.target].set(props.target);
      if ( props.onClick ) props.onClick(e);
    }}
  >
    {props.children}
  </div>
  </>;
}

//* Parent TabResult
export function TabResult(props){
  const URLParams = useLocation();

  return <>
  <TabsParent.Provider value={{
    target: props.id,
    allowURLChange: !props?.disableURLChange,
    URLParams: URLParams
  }}>
    <div class={`${props.id} ${props?.class ?? ''}`}>
      {props.children}
    </div>
  </TabsParent.Provider>
  </>;
}

//* Each result div
export function Result(props){
  const thisParent = useContext(TabsParent);
  const { tabs } = useGlobal();

  onMount(() => {
    // Set selected tab
    if ( props.selected ) tabs()[thisParent.target].set(props.id);

    // Auto select tabs based on URL
    if ( thisParent.allowURLChange ){
      const params = new URLSearchParams(thisParent.URLParams.search);
      const isTabSet = params.get('tab');
      if ( isTabSet && props.id === isTabSet ) tabs()[thisParent.target].set(props.id);
    }
  });

  return <>
    <Show when={tabs()[thisParent.target].get() === props.id}>
      <div class={`tabresult ${props.id}`} classList={{ selected: tabs()[thisParent.target].get() === props.id }}>
        {props.children}
      </div>
    </Show>
  </>;
}