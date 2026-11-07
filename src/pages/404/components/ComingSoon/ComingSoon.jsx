import { g } from '@/utils/Functions';
import './ComingSoon.style.scss';

export function ComingSoon(){
  return <>
    <section id="coming-soon-template-1">
      <div class="container d-flex align-items-center justify-content-center">
        <div>
          <div class="barrier d-flex justify-content-center mx-auto"></div>
          <h1 class="text-center mt-4">Coming Soon</h1>
          <p class="text-center mx-auto mt-4">We are currently working on populating this page. Stay tuned for upcoming content. Meanwhile, visit other pages.</p>
          <a link class="btn d-flex justify-content-center mx-auto mt-5" href={g.base}>Homepage</a>
        </div>
      </div>
    </section>
  </>;
}

export default {
  ComingSoon
};
