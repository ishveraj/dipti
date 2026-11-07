import { useGlobal } from "@/assets/base";
import { Form, Input, Response, Submit } from "@/components/Forms/Form";
import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { useAPI } from '@/utils/CMS/CMS';
import { g } from '@/utils/Functions';
import { useLocation } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import { isServer } from "solid-js/web";
import '../Login.style.scss';

export default function ResetPassword(props){
  const URLSearchparam = useLocation();
  const params = new URLSearchParams(URLSearchparam.search);
  const u = params.get('u');
  const r = params.get('r');

  // Check if link is active
  const [isLinkValid] = createResource(
    () => useAPI(`public/accounts/users/check-reset-link`, {
      method: 'post',
      body: {
        username: u,
        key: r, 
      }
    })
  );


  return <>
  <Meta data={props.meta}/>
  <Aos/>

  <div id="page-login">
    <section>
      <div class="container">
        <Show when={isLinkValid() && !isLinkValid().isValid}>{() => { 
          if ( !isServer ) window.location.href = g.base; 
        }}</Show>

        <Show when={isLinkValid() && isLinkValid().isValid && useGlobal()}>
          <h2 class="mb-5 text-center">Set New Password</h2>
          <Form 
            id="resetPasswordForm" 
            action="public/accounts/users/reset-password" 
            reset="true" 
            redirect={`${useGlobal()?.pages()?.['Login']}?reset-successful`}
          >
            <Input type="hidden" name="r" value={r}/>
            <Input type="hidden" name="u" value={u}/>
            <Input type="password" name="password" placeholder="New Password" class="mt-3" required/>
            <Submit class="btn mt-5 w-100">Update</Submit>
            <Response/>
          </Form>
        </Show>
      </div>
    </section>
  </div>
  </>;
}