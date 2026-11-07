import './GhostOrbs.style.scss';

/**
 * An orb effect that floats around the screen
 * @param {string} props.position - Align the orb position (center, right)
 * @param {string} props.static - Whether to have float animation
 * @param {speed} props.speed - Speed of animation e.g. 20s (defaults to 15s) 
 */
export function GhostOrbs(props){
  return <>
  <div class={`neo-effects-ghost-orbs ${props?.position ?? ''} ${props?.static ? 'static' : ''}`} style={`--speed:${props?.speed ?? '15s'}`}/>
  </>;
}
