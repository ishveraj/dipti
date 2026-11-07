import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import './FCTemplate.style.scss';
import { HeroBanner } from "./Templates/HeroBanner";
 
/**
 * Register new FC components
 * Key is ACF name in CMS, value is name of component in /Templates folder
 */
const RegisterTemplates = {
  hero_banner: HeroBanner,
};

/**
 * ACF name that is using the flexible content
 * IF nested, specify into arrays
 * e.g. page_template.details is specified as below where
 * details is the Flexible Content field
 */ 
const ACF_Path_to_FC = ['page_template', 'details'];

// Prepare template for loading
const Templates = {};
Object.keys(RegisterTemplates).forEach((v,i) => {
  Templates[v] = (props) => <Dynamic component={RegisterTemplates[v]} {...props}/>;
});

// Checks FC with registered templates to load
export const LoadTemplate = (props) => {
  const FCField = ACF_Path_to_FC.reduce((obj, key) => obj?.[key], props.data);

  return <>
  <Show when={FCField}>
    <For each={FCField}>{(v,i) => {
      if ( Templates[v.acf_fc_layout] ){
        v.fc_count = `${props.data.post_details.ID}-${i()}`;
        return Templates[v.acf_fc_layout](v);
      }
    }}</For>
  </Show>
  </>;
}

export default function FCTemplate(props){
  //* On page load
  onMount(() => {
  });

  //* On page leave
  onCleanup(() => {
  });

  return <>
  <Meta data={props.meta}/>
  <Aos/>

  <div id="page-fc" class="page-fc">
    <LoadTemplate data={props}/>
  </div>
  </>;
}
