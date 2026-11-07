import { useMatch } from "@solidjs/router";

export function Pages(props){
    return <>
    <ul class={`navbar-nav ${props.class ?? ''}`}>
        {props.children}
    </ul>
    </>;
}

export function Page(props){
    return <>
    <li class={`nav-item ${props.liclass ?? ''}`}>
        <a
        class={`nav-link ${props.class ?? ''}`}
        id={`page-${props.id ?? ''}`}
        classList={{ active: match(props.href ?? false) }} 
        href={props.href}
        style={props.style ?? ''}
        link
        >
            {props.children}
        </a>
    </li>
    </>;
}

export function Dropdown(props){
    return <>
    <div class="nav-link-dropdown">
        <ul class={props.class}>
            {props.children}
        </ul>
    </div>
    </>;
}

export const match = (href) => {
    if (!href) return false;
    let c = useMatch(() => href);
    return Boolean(c());
};