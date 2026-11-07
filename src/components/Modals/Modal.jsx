import { onCleanup } from "solid-js";
import { isServer, Portal } from "solid-js/web";
import './Modal.style.scss';

export function ModalTrigger(props){
  const propClass = props.class;
  const propTarget = props.target;
  delete props.class;
  delete props.target;

  return <>
  <span class={propClass ?? null} data-bs-toggle="modal" data-bs-target={`#${propTarget}`} {...props}>
    {props.children}
  </span>
  </>;
}

export function Modal(props){
  const isLarge = props.size === 'large' ? 'modal-lg' : '';
  const isFullScreen = props.size === 'fullscreen' ? 'modal-full' : '';

  // Remove any open modals when leaving
  onCleanup(() => {
    if ( !isServer ){
      document.querySelectorAll('.modal-backdrop').forEach(e => e.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  });

  return <>
    <Portal>
    <div class={`modal fade ${isFullScreen}`} id={props.id} data-lenis-prevent>
        <div class={`modal-dialog modal-dialog-centered ${isLarge}`}>
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-bs-dismiss="modal">X</button>
                    {props.children}
                </div>
            </div>
        </div>
    </div>
    </Portal>
  </>;
}