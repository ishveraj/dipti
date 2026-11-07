import { gsap, ScrollTrigger } from "gsap/all";
import { onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import SplitType from 'split-type';
import './HighlightTextOnScroll.style.scss';

/**
 * Set default colors for global effect
 */
const defaultInitialColor = '#FFFFFF61';
const defaultFinalColor = '#ffffff';

/**
 * Scroll to change text color
 * @param {string} props.tag - HTML tag to use for this
 * @param {string} props.initialColor - Default color before scroll
 * @param {string} props.finalColor - Final color after scroll
 * @param {string} props.class - any class names
 * @param {string} props.style - any inline styles
 */
export function HighlightTextOnScroll(props){
  let thisRef;

  onMount(() => {
    setTimeout(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      function initSplitText() {
        // Split the text into chars
        const splitInstance = new SplitType(thisRef, { types: "words, chars" });

        // Initial style
        gsap.set(splitInstance.chars, { color: props?.initialColor ?? defaultInitialColor });

        // Animate colors on scroll
        gsap.to(splitInstance.chars, {
          color: props?.finalColor ?? defaultFinalColor,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: thisRef,
            start: "top 50%",
            end: "bottom 50%",
            scrub: 0.6,
            markers: false,
            invalidateOnRefresh: true // critical for iOS Chrome viewport changes
          }
        });
      }

      document.fonts.ready.then(() => {
        initSplitText();
        ScrollTrigger.refresh();
      });

      ScrollTrigger.addEventListener("refreshInit", () => {
        document.fonts.ready.then(() => initSplitText());
      }); 
    }, 0);
  });

  return <>
  <Dynamic 
    component={props?.tag ?? 'h2'}
    ref={thisRef} 
    class={`neo-effects-highlight-text-on-scroll ${props?.class ?? ''}`} 
    style={props?.style ?? null}
  >
    {props.children}
  </Dynamic>
  </>;
}
