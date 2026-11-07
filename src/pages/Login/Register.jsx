import { useGlobal } from "@/assets/base";
import { Form, Input, Response, Submit } from "@/components/Forms/Form";
import { Aos } from "@/tools/AOS/AOS";
import { Meta } from '@/tools/Meta/Meta';
import { Show } from "solid-js";
import './Login.style.scss';

export default function Register(props){
  return <>
  <Meta data={props.meta}/>
  <Aos/>

  <div id="page-login">
    <section>
      <div class="container">
      <Show when={useGlobal()}>
        <Form 
          id="registerform" 
          action="public/accounts/users/register"
          redirect={`${useGlobal()?.pages()?.['Login']}?registered`}
        >
          <Input type="email" name="uname" placeholder="Username" class="mt-3" required/>
          <Input type="password" name="password" placeholder="Password" class="mt-3" required/>
          <Response/>

          <Submit class="btn mt-4 d-block mx-auto">Register</Submit>
          <p class="text-center mt-4">
            Already have an account? <a link class="alink" href={useGlobal()?.pages()?.['Login']}>Sign In here</a>
          </p>
        </Form>
      </Show>
      </div>
    </section>
  </div>
  </>;
}