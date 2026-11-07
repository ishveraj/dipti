import { Meta } from '@/tools/Meta/Meta';
import { g } from '@/utils/Functions';
import { onCleanup, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import './404.style.scss';

export default function NotFound(){
  //* Add remove noindex meta
  onMount(() => {
    document.body.classList.remove('isloading');
    $('html head').append('<meta name="robots" content="noindex">');
  });
    
  onCleanup(() => {
    if (isServer) return;

    $('html head').find('meta[name="robots"]').remove();
  });

  const metaTags = {
    meta: {
      title: '404 Not Found',
    }
  };


  return <>
  <Meta data={metaTags.meta}/>
  
  <section id="not-found-page">
    <div class="container">
        <lottie-player src={g.base + 'static/defaults/hub_404.json'} background="transparent" speed="1" style="width: 200px;height:200px;margin-top:-100px;" class="d-block mx-auto" loop="" autoplay=""></lottie-player>
        
        <h1 class="text-center">404! Page not found!</h1>

        <p class="text-center mt-2">Ooopss, looks like you're lost, use the button below to get back to the site.</p>

        <div class="text-center mt-4">
          <a class="btn text-center" href={g.base}>Back to Site</a>
        </div>
    </div>
  </section>
  </>;
}
