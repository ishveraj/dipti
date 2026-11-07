import { useGlobal } from "@/assets/base";
import { Accordion, Body, Card, Header } from "@/components/Accordions/Accordion";
import { Modal, ModalTrigger } from "@/components/Modals/Modal";
import { createEffect, createSignal, on, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import './DataProtectionBanner.style.scss';

export function DataProtectionBanner(){
  const [thisBanner, setThisBanner] = createSignal();

  onMount(() => {
    const PDPASettings = localStorage.getItem('pdpa');
    if ( !PDPASettings ) setThisBanner('init');
  });

  createEffect(on(thisBanner, (thisBanner) => {
    if ( thisBanner === 'init' ) setTimeout(() => setThisBanner('show'), 3000);
    else if ( thisBanner === 'false' ) setTimeout(() => setThisBanner(false), 500);
  }));

  const Accept = (props) => {
    return <>
      <button type="button" class={`btn-pdap ${props.class ?? ''}`} 
        onClick={() => {
          localStorage.setItem('pdpa', true);
          $('html').find('#neo-pdap-modal').modal('hide');
          setThisBanner('false');
        }}>
          {props.children}
      </button>
    </>;
  }

  return <>
  <Show when={thisBanner()}>
  <Portal>
    <div class={`neo-widget-pdap-banner ${thisBanner() === 'show' ? 'show' : ''}`}>
      <p>
        We process your personal information to measure and improve our sites and service, to assist our marketing campaigns and to provide personalised content and advertising. By clicking the "More Options" button, you can exercise your privacy rights. For more information see our Privacy Policy.
      </p>

      <div>
        <ModalTrigger target="neo-pdap-modal" class="btn-pdap btn-pdap-transparent mt-3 mr-1">
          Preferences
        </ModalTrigger>

        <Accept class="mt-3 mr-2 btn-pdap btn-pdap-transparent">Decline</Accept>
        <Accept class="mt-3">Accept</Accept>
      </div>

      <Modal id="neo-pdap-modal" size="large">
        <Show when={useGlobal()?.siteSettings()}>
          <img src={useGlobal().siteSettings().site_settings.logo.url}/>
        </Show>

        <h3 class="mt-3">Privacy Preference Center</h3>
        <p class="mt-2">
          When you visit our website, we store cookies on your browser to collect information. The information collected might relate to you, your preferences or your device, and is mostly used to make the site work as you expect it to and to provide a more personalized web experience. However, you can choose not to allow certain types of cookies, which may impact your experience of the site and the services we are able to offer. Click on the different category headings to find out more and change our default settings according to your preference. You cannot opt-out of our First Party Strictly Necessary Cookies as they are deployed in order to ensure the proper functioning of our website (such as prompting the cookie banner and remembering your settings, to log into your account, to redirect you when you log out, etc.).
        </p>

        <h3 class="mt-4">Manage Consent Preferences</h3>

        <Accordion id="pdap-accor" class="mt-3">
          <Card>
            <Header>Strictly Necessary Cookies</Header>
            <Body>
                <p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.</p>
            </Body>
          </Card>

          <Card>
            <Header>Performance Cookies</Header>
            <Body>
                <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.    All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.</p>
            </Body>
          </Card>

          <Card>
            <Header>Manage Your Cookies</Header>
            <Body>
            <p class="font-bold">What are cookies, how are they used and how are they managed?</p>

            <p class="mt-3">Cookies are small text files that contain letters and numbers and are placed on your computer or device. Cookies are set when you visit a website that uses cookies and may be used to keep track of pages visited within the site, help you continue where you left off or remember your preferences, such as language settings.</p>

            <p class="mt-3">Cookies are very important to help us make online services easier to use, to monitor the use of our site and to help us improve the service to you.</p>

            <p class="mt-3">To make it easier for you to understand the way a website uses cookies, we have grouped them into easy to understand categories. The category to which a cookie belongs can be seen in the Cookie Panel.</p>

            <p class="mt-3">The information in the Cookie Panel is provided to you in an open and transparent way, so that you can see how cookies are used to enrich your visitor experience and make an informed choice to allow their usage. However, if you wish to control and remove cookies, this can be done via settings in your web browser.</p>

            <p class="mt-3">Please be aware that restricting cookies may impact the functionality of a website. Many of the interactive functions offered by websites are dependent on cookies and disabling or blocking cookies can prevent these services from working or reduce their usefulness.</p>

            <p class="mt-3">Different web browsers may use different methods for managing cookies. Please follow the instructions below, from the web browser manufacturers directly, to configure your browser settings*.</p>

            <ul class="mt-2">
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">Microsoft Edge</a></li>

              <li><a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank">Google Chrome</a></li>

              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank">Apple Safari</a></li>

              <li><a href="http://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank">Mozilla Firefox</a></li>
            </ul>

            <p class="mt-3">* These links are to third party sites, over which we have no control - no liability can be claimed if they are inaccurate.</p>
            </Body>
          </Card>
        </Accordion>

        <div class="text-right">
          <Accept class="mt-3 btn-pdap btn-pdap-transparent">Decline</Accept>
          <Accept class="mt-3 btn-pdap ml-1">Accept</Accept>
        </div>
      </Modal>
    </div>
  </Portal>
  </Show>
  </>;
};