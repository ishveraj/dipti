import { Item, Swiperslider } from "@/components/Swiperslider/Swiperslider";

export const HeroBanner = (props) => {
  let timeoutSlider;

  return <>
    <section class={`fc-hero-banner p-0`} id={`${props.fc_count}-fc-hero-banner`} data-aos="zoom-out">
      <Swiperslider id={`fc-hero-banner-slider-${props.fc_count}`} init={{
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        autoplay: false,
        pagination: {
          el: `.swiperpagination-${props.fc_count}`,
          clickable: true,
        },
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        on: {
          init: function () {
            const interval = $(`#${props.fc_count}-fc-hero-banner .swiper-slide-active .container`).attr('data-interval') * 1000;

            clearTimeout(timeoutSlider);
            timeoutSlider = setTimeout(() => {
              document.querySelector(`#fc-hero-banner-slider-${props.fc_count}`).swiper.slideNext();
            }, interval);

          },
          slideChangeTransitionStart: function () {
            const ele = $(`#${props.fc_count}-fc-hero-banner .content-box`);
            ele.css('transition-duration', '100ms');
            ele.removeClass('show');
          },
          slideChangeTransitionEnd: function () {
            const ele = $(`#${props.fc_count}-fc-hero-banner .content-box`);
            ele.css('transition-duration', '1000ms');
            ele.addClass('show');

            const interval = $(`#${props.fc_count}-fc-hero-banner .swiper-slide-active .container`).attr('data-interval') * 1000;
            clearTimeout(timeoutSlider);
            timeoutSlider = setTimeout(() => {
              document.querySelector(`#fc-hero-banner-slider-${props.fc_count}`).swiper.slideNext();
            }, interval);
          },
        }
      }}>
        <For each={props?.details}>{(v,i) =>
          <Item>
            <Show when={v.background_image}>
              <img class="bg-item" src={v.background_image.url} alt={v.background_image.alt} />
            </Show>

            <Show when={v.video}>
              <video class="bg-item" autoplay="" muted="" playsinline="" loop="" src={v.video.url}/>
            </Show>
            
            <div class="container" data-interval={v?.change_slide_after || '7'}>
              <div class="content-box" data-aos="fade-left">
                <h1 innerHTML={v?.title} class="mb-3 secondary"/>
                <p innerHTML={v?.description} class="white-100 mb-3"/>

                <Show when={v?.link}>
                  <a href={v.link?.url} target={v.link?.target ?? null} class="btn mt-4 border-secondary">{v.link?.title}</a>
                </Show>
              </div>
            </div>
          </Item>
        }</For>
      </Swiperslider>
      <div class={`swiperpagination swiperpagination-${props.fc_count}`}/>
    </section>
  </>;
}