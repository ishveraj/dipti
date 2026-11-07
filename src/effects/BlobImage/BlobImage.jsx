import './BlobImage.style.scss';
import demo from './demo.png';

/**
 * An animated blob with an image inside 
 * @param {string} props.src - PNG image src to be used in the blog
 * @param {string} props.color - Default CSS background of blob (support css background properties)
 */
export function BlobImage(props){
  return <>
  <div class={`neo-effects-blog-image`} style={`--color:${props?.color ?? '#EFC315'};}`}>
    <img src={props?.src ?? demo} alt={props?.alt ?? ""} />
  </div>
  </>;
}
