import { useGlobal } from "@/assets/base";
import { DataProtectionBanner } from "@/components/DataProtectionBanner/DataProtectionBanner";
import { g } from '@/utils/Functions';
import { Show } from "solid-js";
import { Page } from "../Navbar/utils/Pages";
import './Footer.style.scss';

export default function Footer(){
  return <>
  <footer class="py-4">
    <DataProtectionBanner/>
    
    <div class="container pt-3">
        <div class="upper-row pb-4">
            <Show when={useGlobal()?.siteSettings()}>
                <a link class="navbar-brand mb-4" href={g.base}>
                <img src={useGlobal().siteSettings().site_settings.logo.url} class="logo" alt={`${useGlobal().siteSettings().meta.siteName}'s logo`}/>
                </a>
            </Show>
            <div class="row justify-content-lg-between justify-content-start">
                <div class="col-xl-4 col-lg-5 col-12">
                    <p class="font-bit-larger font-semibold secondary mb-2">Address</p>
                    <p class="mb-4 white-100">
                        <strong class="white-100">Kuala Lumpur</strong><br/>
                        0-0-0 Summit Subang<br/>
                        Business Suites, South City,<br/>
                        012345 Kuala Lumpur, Malaysia.
                    </p>
                </div>

                <div class="col-lg-5 mt-lg-0 d-block d-xl-none">
                    <p class="font-bit-larger font-semibold secondary mb-2">WhatsApp Number</p>
                    <p class="white-100">
                        <a href="https://wa.me/60123456789" target="_blank">+6012-345 6789</a>
                    </p>
                </div>

                <div class="col-lg-5 mt-lg-0 mt-4 d-block d-xl-none">
                    <p class="font-bit-larger font-semibold secondary mb-2">Email</p>
                    <p class="mb-lg-4 white-100">
                        <a link href="mailto:hello@newsite.com">hello@newsite.com</a>
                    </p>
                </div>

                <div class="col-xl-2 col-lg-5 d-none d-lg-block">
                    <p class="font-bit-larger font-semibold secondary mb-2 d-lg-block d-none">Sitemap</p>
                    <Show when={useGlobal()?.menu()}>
                        <ul class="footer-link">
                        <For each={useGlobal().menu()['navbar-menu']}>{(v,i) =>
                            <Page href={v.path} class={v.class} id={v.id}>{v.label}</Page>
                        }</For> 
                        </ul>   
                    </Show>
                </div>

                <div class="col-xl-2 col-lg-5 mt-lg-0 mt-4">
                    <p class="font-bit-larger font-semibold secondary mb-2">Follow us at</p>
                    <div class="social-icons mt-3">
                        <a href="https://www.facebook.com/" target="_blank" link class="social-link mr-2"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/" target="_blank" link  class="social-link mr-2"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/" target="_blank" link class="social-link"><i class="fa-brands fa-linkedin-in"></i></a>
                    </div>
                    <p class="font-bit-larger font-semibold secondary mb-2 mt-5">Terms & Policies</p>
                    <ul class="footer-link mb-4">
                        <li><a href={`${useGlobal()?.pages()?.['Privacy']}`} target="_blank" link>Privacy Policy</a></li>
                        <li><a href={`${useGlobal()?.pages()?.['Disclaimer']}`} target="_blank" link>Disclaimer</a></li>
                        <li><a href={`${useGlobal()?.pages()?.['Terms']}`} target="_blank" link>Terms & Conditions</a></li>
                    </ul>
                </div>

                <div class="col-xl-4 mt-lg-0 mt-4 d-none d-xl-block">
                    <p class="font-bit-larger font-semibold secondary mb-2">WhatsApp Number</p>
                    <p class="mb-4 white-100">
                        <a href="https://wa.me/60123456789" target="_blank">+6012-345 7890</a>
                    </p>
                </div>

                <div class="col-xl-4 mt-lg-0 mt-4 mr-auto d-none d-xl-block">
                    <p class="font-bit-larger font-semibold secondary mb-2">Email</p>
                    <p class="mb-lg-4 white-100">
                        <a link href="mailto:hello@newsite.com">hello@newsite.com</a>
                    </p>
                </div>
            </div>
        </div>

        <small class="pt-4 white-100 copy d-block text-xl-center text-left">
            Copyright Protected. All Rights Reserved.<br/>
            New Site Sdn. Bhd. <span class="smaller">123456789 (00000-D)</span><br/>
            Web Development by Gaboola.com
        </small>
    </div>
  </footer>
  </>;
}