import { onMount } from "solid-js";
import { isServer } from "solid-js/web";
import './vendor/jquery.fancybox.min.css';

const fancyPromise = !isServer ? import('./vendor/jquery.fancybox.min') : null;

export function Fancybox(props){
  onMount(() => {
    fancyPromise.then(() => {
      $(props.init.container).fancybox(props.init);
    });
  });
}