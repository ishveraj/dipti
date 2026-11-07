import { Accordion, Body, Card, Header } from "@/components/Accordions/Accordion";
import { Form, Input, Response, Submit } from "@/components/Forms/Form";
import { Modal, ModalTrigger } from "@/components/Modals/Modal";
import { Item, Swiperslider } from "@/components/Swiperslider/Swiperslider";
import { Result, Tab, TabResult, Tabs } from "@/components/Tabs/Tab";
import { Tooltip, initializeTooltips } from '@/components/Tooltips/Tooltip';
import { Aos } from "@/tools/AOS/AOS";
import { Fancybox } from '@/tools/Fancybox/Fancybox';
import { Meta } from '@/tools/Meta/Meta';
import { useAPI } from '@/utils/CMS/CMS'; // IF has CMS
import { g } from '@/utils/Functions';
import { createResource, createSignal, onCleanup, onMount } from "solid-js";
import './Home.style.scss';

export default function Home(props){
  const [someParameter, setSomeParameter] = createSignal();
  const [response] = createResource(
    someParameter,  // can pass createSignal or leave empty to trigger API on the spot
    async (someParameter) => {
      const data = await useAPI(`public/pagination-example/main/test?param=${someParameter}`);

      // Do something with API data if any

      // Return API data to response()
      return data;
  });

  // Trigger createResource above with this value
  setSomeParameter('Test'); 

  /**
   * Signals can support complex data
   * Suitable for filter type of features
   */
  const [paginationData, setPaginationData] = createSignal({
    filters: [],
    search: false,
    page: 1,
  });

  // Add data to existing signal without disrupting other filters
  setPaginationData((current) => ({
    ...current,
    filters: [],
    search: 'something',
    page: 1,
  }));


  //* On page load
  onMount(() => {
    initializeTooltips();
  });

  //* On page leave
  onCleanup(() => {
  });

  
  return <>
  <Meta data={props.meta}/>
  <Aos/>
  <Fancybox init={{
    container : 'a.fancybox-tag',
    transitionIn  : 'elastic',
    transitionOut : 'elastic',
    speedIn :600,
    speedOut :200,
    overlayShow	:false,
    arrows: true,
    infobar: true,
    toolbar: "auto",
    smallBtn: "auto",
    buttons: [
      "zoom",
      "slideShow",
      "fullScreen",
      "download",
      "thumbs",
      "close"
    ]
  }}/>

  <div id="page-home">
    <section id="section-1" class="pt-0">
      <div class="container">
        <h1 class="mt-5">Heading 1</h1>
        <h2 class="mt-2">Heading 2</h2>
        <h3 class="mt-2">Heading 3</h3>

        <p class="mt-3">Lorem Ipsum is <strong>simply dummy</strong> text of the printing and typesetting industry. Lorem Ipsum has <a href="#" class="anchor">been the industry's</a> standard dummy text ever <Tooltip content="This is a tooltip"><strong>Hover Me!</strong></Tooltip> the 1500s, when an unknown printer took a galley of type and scrambled it to make a type <em>specimen book.</em> </p>

        <button class="btn mt-4">Primary Button</button>
        <button class="btn secondary mt-4 ml-2">Secondary Button</button>
        <button class="btn tertiary mt-4 ml-3">Tertiary Button</button>

        <ul class="mt-4">
          <li>This is an unordered list</li>
          <li>It has no numbered values</li>
          <li>And will appear as bullets</li>
        </ul>

        <ol class="mt-4">
          <li>This is an ordered list</li>
          <li>It has numbered values</li>
          <li>And will appear with numbers</li>
        </ol>

      <Swiperslider id="swiper-slider" init={{
        slidesPerView: 5,
        slidesPerGroup: 5,
        autoplay: {
            delay: 2000,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.1,
                slidesPerGroup: 1,
            },
            450: {
                slidesPerView: 1.5,
                slidesPerGroup: 1,
            },
            767: {
                slidesPerView: 2.5,
                slidesPerGroup: 2,
            },
            1199: {
                slidesPerView: 3.5,
                slidesPerGroup: 2,
                autoplay: {
                    enabled: false,
                }
            },
            1299: {
                slidesPerView: 5,
                autoplay: {
                    enabled: false,
                }
            }
        },
        pagination: {
          el: '.swiperpagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }}>
        <Item>Slide 1</Item>
        <Item>Slide 2</Item>
        <Item>Slide 3</Item>
        <Item>Slide 4</Item>
        <Item>Slide 5</Item>
        <Item>Slide 6</Item>
      </Swiperslider>
      <div class="swiperpagination"/>
      <div class="swiper-button-prev"/>
      <div class="swiper-button-next"/>

      <Accordion id="a1" class="mt-5 mb-5" singleToggle>
        <Card selected>
          <Header>Accordion 1</Header>
          <Body>
              <p>Accordion 1 content goes here.</p>
          </Body>
        </Card>

        <Card>
          <Header>Accordion 2</Header>
          <Body>
              <p>Accordion 2 content goes here.</p>
          </Body>
        </Card>
      </Accordion>

      <Tabs target="tab1">
        <div class="row">
          <div class="col-lg-4">
            <Tab target="t1" class="" selected onClick={(e) => {
              alert('tab click example. check inspect for console log.');
              console.log(e);
            }}><button class="btn d-block w-100">Test 1</button></Tab>
          </div>
          <div class="col-lg-4">
            <Tab target="t2" class=""><button class="btn d-block w-100">Test 2</button></Tab>
          </div>
          <div class="col-lg-4">
            <Tab target="t3" class=""><button class="btn d-block w-100">Test 3</button></Tab>
          </div>
        </div>
      </Tabs>

      <TabResult id="tab1" class="">
        <Result id="t1" selected>
          <h1 class="mt-3" data-aos="fade-up">Tab 1</h1>
        </Result>

        <Result id="t2">
          <h1 class="mt-3" data-aos="fade-up">Tab 2</h1>
        </Result>

        <Result id="t3">
          <h1 class="mt-3" data-aos="fade-up">Tab 3</h1>
        </Result>
      </TabResult>

      <ModalTrigger class="btn mt-4 mr-3 d-inline-block" target="modal1">
          Open normal modal
      </ModalTrigger>
      <Modal id="modal1">
        <p>Modal 1 body</p>
      </Modal>

      <ModalTrigger class="btn mt-4 mr-3 d-inline-block" target="modal2">
          Open large modal
      </ModalTrigger>
      <Modal id="modal2" size="large">
        <h1>Modal 2 body</h1>
      </Modal>

      <ModalTrigger class="btn mt-4 mr-3 d-inline-block" target="modal3">
          Open fullscreen modal
      </ModalTrigger>
      <Modal id="modal3" size="fullscreen">
        <h1>Modal 3 body</h1>
      </Modal>

      <h1 class="mt-5">Fancybox</h1>
      <a class="mb-5 fancybox-tag" data-fancybox='gallery' data-src={`${g.base}static/defaults/siteimg.jpg`}>
			  <img src={`${g.base}static/defaults/siteimg.jpg`} class='img-fluid' />
		  </a>

      <h1>Form</h1>
      <Form 
        id="contactform" 
        action="public/contact/main/send-email"
        reset="false" 
        redirect="/thank-you"
      >
          <Input type="text" name="name" placeholder="Name" class="mt-3" required/>
          <Input type="email" name="email" placeholder="Email" class="mt-3" required/>
          <Input type="tel" name="phone" placeholder="Phone" class="mt-3" required/>
          <Input type="number" name="number" placeholder="Number" class="mt-3" required/>
          <Input type="password" name="password" placeholder="Password" class="mt-3" required/>
          <Input type="date" name="dob" placeholder="Date of Birth" class="mt-3" required/>
          <Input type="textarea" name="message" placeholder="Message" class="mt-3" required/>

          <Input type="select" name="service" class="mt-3" required>
            <option disabled selected>Select a Service...</option>
            <option value="s1">Service 1</option>
            <option value="s2">Service 2</option>
            <option value="s3">Service 3</option>
          </Input>
    
          <Input type="checkbox" name="checkboxname[]" class="mt-4" vertical required>
            <option value="Check 1" class="mt-3 mr-3" selected>Checkbox 1 Label</option>
            <option value="Check 2" class="mt-3 mr-3">Checkbox 2 Label</option>
            <option value="Check 3" class="mt-3 mr-3">Checkbox 3 Label</option>
          </Input>

          <Input type="radio" name="radioname" class="mt-4" required>
            <option value="Radio 1">Radio 1 Label</option>
            <option value="Radio 2" class="mt-3">Radio 2 Label</option>
            <option value="Radio 3" class="mt-3">Radio 3 Label</option>
          </Input>

          <Input 
            type="file" 
            name="attachment[]" 
            class="mt-3" 
            placeholder="Upload your file here" 
            maxFiles="2"
            accept=".png, .jpeg, .jpg, .json"
            limit="25mb"
            hasImagePreview
            multiple
            required
          />

          <Submit class="btn dark mt-3">Submit</Submit>
          <Response/>
        </Form>
      </div>
    </section>
  </div>
  </>;
}
