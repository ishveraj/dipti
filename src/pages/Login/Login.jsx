import { useGlobal } from "@/assets/base";
import { Form, Input, Response, Submit } from "@/components/Forms/Form";
import { Modal, ModalTrigger } from "@/components/Modals/Modal";
import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { useLocation } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";
import { isServer } from "solid-js/web";
import './Login.style.scss';

if ( !isServer ){
  $('html').on('form.done', '#signInForm', function(e,args,data){
      if ( data.atk ) localStorage.setItem('aTK', data.atk);
      else localStorage.removeItem('aTK');
  });

  $('html').on('form.done', '#forgotPasswordForm', function(e,args,data){
    if (!data.err){
      setTimeout(function(){
          $('html').find('#forgot-password').modal('hide');
      }, 5000);
    }
  });
}

export default function Login(props){
  if ( !isServer ) localStorage.removeItem('aTK');
  const URLSearchParam = useLocation();
  const params = new URLSearchParams(URLSearchParam.search);
  
  return <>
  <Meta data={props.meta}/>
  <Aos/>

  <div id="page-login">
    <section>
      <div class="container">
        <Show when={useGlobal()}>
        <Form 
          id="signInForm" 
          action="public/accounts/users/sign-in"
          redirect={useGlobal()?.pages()?.['Home']}
        >
          <Switch>
              <Match when={typeof params.get('registered') === 'string'}>
                  <p class="text-center alert-success mt-3 mb-3">
                      You have registered successfully!<br/>
                      You can now login with your registered email & password.
                  </p>
              </Match>
              <Match when={typeof params.get('log-out') === 'string'}>
                  <p class="text-center alert-success mt-3 mb-3">You have logged out successfully!</p>
              </Match>
              <Match when={typeof params.get('recovery-sent') === 'string'}>
                  <p class="text-center alert-success mt-3 mb-3">
                      Recovery email has been successfully sent.<br/>
                      Please check your email for the account recovery steps.
                  </p>
              </Match>
              <Match when={typeof params.get('reset-successful') === 'string'}>
                  <p class="text-center alert-success mt-3 mb-3">
                      Account reset successful!<br/> 
                      You can now login with your credentials.
                  </p>
              </Match>
              <Match when={typeof params.get('expired') === 'string'}>
                  <p class="text-center alert-danger mt-3 mb-3">Request has expired.</p>
              </Match>
              <Match when={typeof params.get('kicked') === 'string'}>
                  <p class="text-center alert-danger mt-3 mb-3">
                      We detected abnormalies & have logged you out for security measures.
                  </p>
              </Match>
          </Switch>

          <Input type="email" name="uname" placeholder="Username" class="mt-3" required/>
          <Input type="password" name="password" placeholder="Password" class="mt-3" required/>

          <Response/>

          <Submit class="btn mt-3">Sign In</Submit>
          <ModalTrigger class="btn mt-3 mt-3" target="forgot-password">Forgot Password?</ModalTrigger>
          <p class="text-center mt-2">Don't have an account? <a link class="alink" href={useGlobal()?.pages()?.['Register']}>Sign Up here</a></p>
        </Form>
        </Show>

        <Modal id="forgot-password">
          <h2 class="text-center color-1">Forgot Password?</h2>
          <p class="text-center mt-3 mb-3">Submit your registered email to request for a recovery email.</p>

          <Show when={useGlobal()}>
            <Form 
              id="forgotPasswordForm" 
              action="public/accounts/users/request-password-reset" 
              redirect={`${useGlobal()?.pages()?.['Login']}?recovery-sent`}
            >
              <div class="form-box-span mt-4"> 
                  <Input type="email" name="email_address" placeholder="Email" required/>
                  <span>Email</span>
              </div>
              <Submit class="btn mt-4 d-block mx-auto">Request for Account Recovery</Submit>
              <Response/>
            </Form>
          </Show>
        </Modal>
      </div>
    </section>
  </div>
  </>;
}