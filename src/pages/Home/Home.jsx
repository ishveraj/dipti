import { Modal, ModalTrigger } from "@/components/Modals/Modal";
import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { createSignal, onMount } from "solid-js";
import './Home.style.scss';
import { SeventyReasons } from "./SeventyReasons";

const introMessages = [
  ['Well, well, well...', 'look what the cat brought in...'],
  ['Oh look...', 'somebody finally showed up...', 'I was about to send a search party...'],
  ['Knock knock...', 'who\'s there?', 'Only the prettiest baby girl I ever had...'],
  ['Psst...', 'you\'re not supposed to be here...', 'kidding...', 'you\'re the whole reason I built this...'],
  ['Welcome back, gorgeous...', 'I missed you...'],
  ['Breaking news...', 'you\'re the best part of this site...', 'obviously...'],
  ['Ahem...', 'this is a restricted area ma\'am...', 'you\'ll have to bribe me first...'],
  ['Oh hello trouble...', 'I mean, hello princess...'],
  ['Well hello there...', 'miss me already?', 'Such a sweetheart aren\'t you...'],
  ['Access granted...', 'because obviously, who else would it be...'],
  ['Warning...', 'you\'re about to be spoiled...', 'adored...', 'tickled...', 'and I\'m going to have zero regrets about it...'],
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
    title: `Dear Dipti...This One's For You`,
    description: `Dipti's personal corner of the internet. Built by Bubu, for Pluplue, with more suu-pee-nehs loading...`,
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
          <h1 class="text-center">
            <For each={introMessages[introMessageRandomIndex]}>{(v,i) => {
              afterIntroDelay = i() === 0 ? null : 2000 * i() - 1000;

              return <>
                <span class="d-block" data-aos="fade-in" data-aos-delay={afterIntroDelay}>
                  {introMessages[introMessageRandomIndex][i()]}
                </span>
              </>;
            }}</For>
          </h1>

          <div class="mt-5" data-aos="zoom-in" data-aos-delayx={afterIntroDelay + 1500}>
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-4 mt-4 text-center">
                <ModalTrigger target="seventy-reasons-why" class="col-box">
                  <p>70 reasons why me laps you</p>
                </ModalTrigger>

                <Modal id="seventy-reasons-why" size="large">
                  <SeventyReasons/> 
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
