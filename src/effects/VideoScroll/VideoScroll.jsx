import { ScrollTrigger, gsap } from "gsap/all";
import { onCleanup, onMount } from "solid-js";
import './VideoScroll.style.scss';

/**
 * Video scroll effect
 * @param props.video - video source URL (mp4)
 * NOTE: must encode to keyint=1:min-keyint=1:scenecut=0 for best results (see ffmpeg docs)
 * example use Handbrake windows app to encode
 */
export function VideoScroll(props){
  let videoSection, videoTag, blobURL;

  //* On page load
  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    setTimeout(() => {
      const video = videoTag;

      function once(el, event, fn, opts) {
        var onceFn = function(e) {
          el.removeEventListener(event, onceFn);
          fn.apply(this, arguments);
        };
        el.addEventListener(event, onceFn, { ...opts, once: true });

        return onceFn;
      }

      function initGSAP() {
        video.pause();
        video.currentTime = 0;

        ScrollTrigger.create({
          trigger: videoSection,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          onUpdate: self => {
            if (!video.duration || isNaN(video.duration)) return; // guard
            const t = self.progress * video.duration;
            if (Math.abs(video.currentTime - t) > 0.05) {
              video.currentTime = t;
            }
          }
        });

        ScrollTrigger.refresh();
      }

      function loadVideo() {
        // Wait until src is available — iOS delays this
        let src = video.currentSrc || video.src;

        if (!src || src === window.location.href) {
          // src not ready yet, wait for it
          once(video, "loadstart", () => {
            src = video.currentSrc || video.src;
            fetchAndInit(src);
          });
          return;
        }

        fetchAndInit(src);
      }

      function fetchAndInit(src) {
        fetch(src)
          .then(r => r.blob())
          .then(blob => {
            blobURL = URL.createObjectURL(blob);
            video.src = blobURL;
            video.load();

            // iOS needs play() before seeking is possible
            const playPromise = video.play();

            if (playPromise !== undefined) {
              playPromise.then(() => {
                video.pause();
                video.currentTime = 0;

                once(video, "seeked", () => {
                  initGSAP();
                });
              }).catch(() => {
                // Autoplay blocked — wait for user touch then retry
                once(document.documentElement, "touchstart", () => {
                  video.muted = true;
                  video.currentTime = 0;
                  video.play().then(() => {
                    video.pause();
                    video.currentTime = 0;
                    once(video, "seeked", initGSAP);
                  });
                });
              });
            }
          })
          .catch(err => {
            once(video, "loadeddata", () => {
              video.muted = true;
              video.currentTime = 0;
              video.play().then(() => {
                video.pause();
                video.currentTime = 0;
                once(video, "seeked", initGSAP);
              });
            });
          });
      }

      video.play();
      video.pause();

      loadVideo();
    }, 0);
  });

  onCleanup(() => {
    if (blobURL) URL.revokeObjectURL(blobURL); // add this
    ScrollTrigger.getAll().forEach(trigger => trigger?.kill());
  });
  
  return <>
  <section class="neo-widget-video-scroll p-0" ref={videoSection}>
    <video 
      class="video-background"
      playsinline  
      muted    
      preload="auto"
      ref={videoTag}
    >
      <source src={props.video} type="video/mp4"/>
    </video>
  </section>
  </>;
}