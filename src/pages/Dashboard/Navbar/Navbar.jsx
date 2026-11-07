import { useGlobal } from '@/assets/base';
import { match } from '@/components/Navbar/utils/Pages';
import { createMemo } from 'solid-js';
import './Navbar.style.scss';

export function Navbar(props){
  const links = createMemo(() => [
    {
      label: 'NAVIGATION',
      links: [
        {
          label: 'Dashboard',
          href: useGlobal()?.pages()?.['Dashboard'],
          icon: 'fa fa-dashboard',
        },
        {
          label: 'Settings',
          href: useGlobal()?.pages()?.['Settings'],
          icon: 'fa fa-gear',
        },
      ],
    },
  ]);

  return <>
  <div id="neo-dashboard-navbar">
    <a link class="navbar-brand" href={useGlobal()?.pages()?.['Dashboard']}>
      <img src={useGlobal()?.siteSettings()?.site_settings.logo.url} class="logo" alt={`${useGlobal()?.siteSettings()?.meta.siteName}'s logo`}/>
    </a>

    <div class="dashboard-links">
      <For each={links()}>{(v,i) => 
      <>
        <p class="small mb-3">{v.label}</p>

        <For each={v.links}>{(sv,si) => 
          <a classList={{ active: match(sv.href ?? false) }}  href={sv.href} link>
            <i class={`${sv.icon} mr-2`}/> {sv.label}
          </a>
        }</For>
      </>
      }</For>
    </div>
  </div>
  </>;
}
