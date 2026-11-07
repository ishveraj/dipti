import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { onCleanup, onMount } from "solid-js";
import './Home.style.scss';

const introMessage = [
  'Well, well, well...look what the cat brought in...',
  'Oh look...somebody finally showed up...I was about to send a search party...',
  'Knock knock...who\'s there? Only the prettiest visitor this site has ever had...',
  'Psst...you\'re not supposed to be here...kidding, you\'re the whole reason I built this...',
  'Welcome back, gorgeous...I missed you...',
  'Plot twist...you\'re the main character here. Again...',
  'Ahem...this is a restricted area...Dipti only, VIPees of all VIPees...',
  'Oh hello trouble...I mean, hello wife...',
  'Look who decided to grace me with her presence...finally...',
  'Access granted...because obviously, who else would it be...',
  'Brace yourself...you\'re about to be adored, loudly, and with zero chill...',
];

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
    description: `Dipti's personal corner of the internet. Built by Bubu, for Pluplue, with more suu-pee-nehs loading...`,
  }}/>
  <Aos/>


  <div id="page-home">
    <section id="section-1">
      <div class="container">
        <h1 class="text-center" data-aos="fade-up">{introMessage[Math.floor(Math.random() * introMessage.length)]}</h1>
      </div>
    </section>
  </div>
  </>;
}
