import { useGlobal } from '@/assets/base';
import './Unauthorized.style.scss';

export function Unauthorized(props){
  return <>
  <div id="neo-widget-unauthorized">
  <section>
    <div class="container">
      <h1 class="text-center">Oops!</h1>
      <p class="text-center mt-2">
        Seems like you do not have access to this section.
      </p>

      <p class="mt-3 text-center"><a class="alink" href={useGlobal()?.pages()?.['SignIn']}>Sign in</a></p>
    </div>
  </section>
  </div>
  </>;
}
