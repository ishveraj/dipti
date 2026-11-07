import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { onCleanup, onMount } from "solid-js";
import './Home.style.scss';

export default function Home(){
  //* On page load
  onMount(() => {

  });

  //* On page leave
  onCleanup(() => {
  });

  
  return <>
  <Meta data={{
    title: `Dear Dipti...This One's For You`,
    description: `Dipti's personal corner of the internet. Built by Bubu, for Pluplue, with more su-pee-nehs loading...`,
  }}/>
  <Aos/>


  <div id="page-home">
    <section id="section-1" class="pt-0">
      <div class="container">
        <h1>Well, well, well...look what the cat brought in...</h1>
      </div>
    </section>
  </div>
  </>;
}
