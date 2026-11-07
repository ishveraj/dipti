import { Meta } from '@/tools/Meta/Meta';
import { onCleanup, onMount } from "solid-js";
import { LogControl } from '@/utils/CMS/CMS';
import './Dashboard.style.scss';

export default function Dashboard(props){
  //* On page load
  onMount(() => {

  });

  //* On page leave
  onCleanup(() => {
  });

  return <>
  <Meta data={props.meta}/>

  <LogControl>
  <div class="page-dashboard">
    <section>
      <div className="container">
        <h1>Welcome</h1>
      </div>
    </section>
  </div>
  </LogControl>
  </>;
}
