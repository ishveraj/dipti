import { useGlobal } from "@/assets/base";
import { g, listenForEvent } from '@/utils/Functions';
import { For, Match, Show, Switch } from "solid-js";
import './Navbar.style.scss';
import { Dropdown, Page, Pages } from "./utils/Pages";

//* Structure of navbar links
/**
 * Page ids will be appended into page-{ID name}
 * Example: id="home" will be page-home
 */ 
const Links = () => {
  return<>
  <Pages class="ml-auto">
    <Show when={useGlobal().menu()}>
      <For each={useGlobal().menu()['navbar-menu']}>{(v,i) =>
        <Switch>
          <Match when={v.child.length === 0}>
            <Page href={v.path} class={v.class} id={v.id}>{v.label}</Page>
          </Match>
          <Match when={v.child.length != 0}>
            <Page class={v.class} id={v.id}>{v.label}
              <Show when={v.child.length != 0}>
              <Dropdown>
                  <For each={v.child}>{(v, i) =>
                    <Page href={v.path} class={v.class} id={v.id}>{v.label}</Page>
                  }</For>  
              </Dropdown>
              </Show>
            </Page>
          </Match>
        </Switch>
      }</For>    
    </Show>
  </Pages>
  </>;
};


//* Used to close mobile navbar when click outside
function clickOutsideCloseMobileNavbar(el, accessor) {
  listenForEvent(document.body, "click", function(e){
      if ( 
          !el.contains(e.target) || 
          (
            e.target.href ||
            $(e.target).closest('a').attr('href')
          )
      ) $('.navbar-collapse').collapse('hide');
  });
}

export function Navbar(){
  return <>
    <nav class="navbar prio navbar-expand-lg affix affix-default" data-affix-offset="1" use:clickOutsideCloseMobileNavbar data-lenis-prevent>
      <div class="container">
          <Show when={useGlobal().siteSettings()}>
            <a link class="navbar-brand" href={useGlobal()?.pages()?.['Home']}>
              <img src={useGlobal().siteSettings().site_settings.logo.url} class="logo" alt={`${useGlobal().siteSettings().meta.siteName}'s logo`}/>
            </a>
          </Show>

          <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
              <span class="icon-bar i1"></span>
              <span class="icon-bar i2"></span>
              <span class="icon-bar i3"></span>
          </button>

          <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <Links/>
          </div>
      </div>
      </nav>
  </>;
}