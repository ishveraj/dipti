import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onCleanup, onMount } from "solid-js";
import './Animations.style.scss';
import './DefaultAnimations.style.scss';

const easings = {
  'linear': 'cubic-bezier(.250, .250, .750, .750)',
  'ease': 'cubic-bezier(.250, .100, .250, 1)',
  'ease-in': 'cubic-bezier(.420, 0, 1, 1)',
  'ease-out': 'cubic-bezier(.000, 0, .580, 1)',
  'ease-in-out': 'cubic-bezier(.420, 0, .580, 1)',

  'ease-in-back': 'cubic-bezier(.6, -.28, .735, .045)',
  'ease-out-back': 'cubic-bezier(.175, .885, .32, 1.275)',
  'ease-in-out-back': 'cubic-bezier(.68, -.55, .265, 1.55)',

  'ease-in-sine': 'cubic-bezier(.47, 0, .745, .715)',
  'ease-out-sine': 'cubic-bezier(.39, .575, .565, 1)',
  'ease-in-out-sine': 'cubic-bezier(.445, .05, .55, .95)',

  'ease-in-quad': 'cubic-bezier(.55, .085, .68, .53)',
  'ease-out-quad': 'cubic-bezier(.25, .46, .45, .94)',
  'ease-in-out-quad': 'cubic-bezier(.455, .03, .515, .955)',

  'ease-in-cubic': 'cubic-bezier(.55, .085, .68, .53)',
  'ease-out-cubic': 'cubic-bezier(.25, .46, .45, .94)',
  'ease-in-out-cubic': 'cubic-bezier(.455, .03, .515, .955)',

  'ease-in-quart': 'cubic-bezier(.55, .085, .68, .53)',
  'ease-out-quart': 'cubic-bezier(.25, .46, .45, .94)',
  'ease-in-out-quart': 'cubic-bezier(.455, .03, .515, .955)',
}

export function Aos(){
  const triggers = [];
  let observer;

  const initAnimations = (elements) => {
    elements.forEach((el) => {
      const duration = el.getAttribute("data-aos-duration") || 1000;
      const setEasing = el.getAttribute("data-aos-easing") || 'ease';
      const setDelay = el.getAttribute("data-aos-delay") || 0;
      const setOffset = el.getAttribute("data-aos-offset") || 0;

      // remove show class initially
      el.classList.remove("show");

      el.style.transitionDuration = `${duration}ms`;
      el.style.transitionTimingFunction = easings[setEasing];
      el.style.transitionDelay = `${setDelay}ms`;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: `top+=${setOffset} 85%`,
        end: `bottom+=${setOffset} 15%`,
        onEnter: () => {
          el.classList.add("show");
        },
        onLeaveBack: () => {
          // remove when scrolling back up
          el.classList.remove("show");
        },
      });

      triggers.push(trigger);
    });
  }

  onMount(() => {
    setTimeout(() => {
      // Observe changes to dom
      observer = new MutationObserver((mutations) => {        
        for (const mutation of mutations) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              // only run on elements with data-aos
              const targets = node.matches?.('[data-aos]')
                ? [node]
                : node.querySelectorAll?.('[data-aos]') || [];

              // Reinit animation on new targets
              initAnimations(targets);
            }
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Init animations
      const elements = document.querySelectorAll('[data-aos]');
      initAnimations(elements);
    }, 0);
  });

  onCleanup(() => {
    observer?.disconnect();
    triggers.forEach((t) => t.kill());
    ScrollTrigger.refresh();
  });
}