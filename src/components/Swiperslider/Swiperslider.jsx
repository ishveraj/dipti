import { onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import 'swiper/css/bundle';

const swiperPromise = !isServer ? import('swiper/bundle') : null;

export function Swiperslider(props) {
  let swiper;

  onMount(() => {
    swiperPromise.then(({ default: Swiper }) => {
      if (props.init) {
        swiper = new Swiper(`#${props.id}`, props.init);
      }
    });
  });

  onCleanup(() => swiper?.destroy(true, true));

  return (
    <div class={`swiper ${props.class ?? ''}`} id={props.id}>
      <div class="swiper-wrapper">
        {props.children}
      </div>
    </div>
  );
}

export function Item(props) {
  return (
    <div class={`swiper-slide ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
}