import { Modal, ModalTrigger } from "@/components/Modals/Modal";
import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { createSignal, onMount } from "solid-js";
import './Home.style.scss';
import { SeventyReasons } from "./SeventyReasons";
import { WheneverYouFeelDown } from "./WheneverYouFeelDown";
import { g } from "@/utils/Functions";

const introMessages = [
  [
    ['Well, well, well...', 'look what the cat brought in...'], 
    `${g.base}static/videos/sayang-3.webm`
  ],
  [
    ['Oh look...', 'somebody finally showed up...', 'I was about to send a search party...'], 
    `${g.base}static/videos/sayang-2.webm`
  ],
  [
    ['Knock knock...', 'who\'s there?', 'Only the prettiest baby girl I ever had...'], 
    `${g.base}static/videos/knock.webm`
  ],
  [
    ['Psst...', 'you\'re not supposed to be here...', 'kidding...', 'you\'re the whole reason I built this...'],
    `${g.base}static/videos/cool-2.webm`
  ],
  [
    ['Welcome back, gorgeous...', 'I missed you...'],
    `${g.base}static/videos/piles-3.webm`
  ],
  [
    ['Breaking news...', 'you\'re the best part of this site...', 'obviously...'],
    `${g.base}static/videos/cool-3.webm`
  ],
  [
    ['Ahem...', 'this is a restricted area ma\'am...', 'you\'ll have to bribe me first...'],
    `${g.base}static/videos/cool-4.webm`
  ],
  [
    ['Oh hello trouble...', 'I mean, hello princess...'],
    `${g.base}static/videos/me.webm`
  ],
  [
    ['Well hello there...', 'miss me already?', 'Such a sweetheart aren\'t you...'],
    `${g.base}static/videos/cool.webm`
  ],
];

export default function Home(){
  const introMessageRandomIndex = Math.floor(Math.random() * introMessages.length);
  let afterIntroDelay = 0;

  const [accessPass, setAccessPass] = createSignal();

  onMount(() => {
    (async () => {
      const pw = prompt("Halt, who goes there...");
      if (pw === null) return;

      const res = await fetch("https://projects.gaboola.com/archives/test/test.php", {
        method: "POST",
        body: new URLSearchParams({ pw })
      });

      const text = await res.text();

      if ( text === "ok") setAccessPass(true);
      return;
    })();
  });

  return <>
  <Meta data={{
    title: `Dear Dipti...`,
    description: `Built by Bubu...for Pluplue...with more suu-pee-nehs loading...`,
  }}/>
  <Aos/>

  <Show when={accessPass()} fallback={
    <section data-aos="zoom-in" data-aos-delay="500">
      <div className="container text-center">
        <h1>Nothing...to see here kid...</h1>
      </div>
    </section>
  }>
    <div id="page-home">
      <section id="section-1">
        <div class="container">
          <video src={introMessages[introMessageRandomIndex][1]} autoplay loop muted playsinline width="200" class="d-block mx-auto" data-aos="fade-in"/>

          <h1 class="text-center">
            <For each={introMessages[introMessageRandomIndex][0]}>{(v,i) => {
              afterIntroDelay = i() === 0 ? null : 2000 * i() - 1000;

              return <>
                <span class="d-block" data-aos="fade-in" data-aos-delay={afterIntroDelay}>
                  {introMessages[introMessageRandomIndex][0][i()]}
                </span>
              </>;
            }}</For>
          </h1>

          <div class="mt-5" data-aos="zoom-in" data-aos-delay={afterIntroDelay + 1500}>
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-4 mt-2 text-center">
                <ModalTrigger target="seventy-reasons-why" class="col-box">
                  <p>Some reasons why me laps you</p>
                </ModalTrigger>

                <Modal id="seventy-reasons-why" size="large">
                  <SeventyReasons/> 
                </Modal>
              </div>

              <div className="col-lg-4 mt-2 text-center">
                <ModalTrigger target="whenever-you-feel-down" class="col-box">
                  <p>Whenever you feel down...</p>
                </ModalTrigger>

                <Modal id="whenever-you-feel-down" size="large">
                  <WheneverYouFeelDown/> 
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Show>
  </>;
}
