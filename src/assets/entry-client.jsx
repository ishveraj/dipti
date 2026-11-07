import { render } from 'solid-js/web';
import { App } from './base';
import { gsap, ScrollTrigger } from "gsap/all";
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
window.lenis = new Lenis({
  autoRaf: true,
});

//* Rendering
const root = document.getElementById('root');
root.innerHTML = '';
render(() => <App/>, document.getElementById('root'));