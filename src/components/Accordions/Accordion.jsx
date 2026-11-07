import { createSignal, createContext, useContext } from 'solid-js';
import './Accordion.style.scss';

const ParentProps = createContext();
const CardProps = createContext();

export function Accordion(props){
  const [counter, setCounter] = createSignal(-1);

  return <>
  <ParentProps.Provider value={{
    ID: props.id,
    count: counter,
    setCount: setCounter,
    toggleType: props.singleToggle ? `#${props.id}` : null,
  }}>
    <div class={`accordion ${props.class ?? ''}`} id={props.id}>
      {props.children}
    </div>
  </ParentProps.Provider>
  </>;
}

export function Card(props){
  const parentProps = useContext(ParentProps);
  parentProps.setCount(parentProps.count() + 1);
  const useClass = props.class;
  delete props.class;

  return <>
  <CardProps.Provider value={{
    toggleType: parentProps.toggleType,
    id: props.id ?? parentProps.ID + '-' + parentProps.count(),
    data: props
  }}>
    <div class={`card ${useClass ?? ''}`} {...props}>
      {props.children}
    </div>
  </CardProps.Provider>
  </>;
}

export function Header(props){
  const cardProps = useContext(CardProps);

  return <>
    <div class="card-header">
        <div 
          class={`card-link ${cardProps.data.selected ? '' : 'collapsed'}`} 
          data-bs-toggle="collapse" 
          data-bs-target={`#${cardProps.id}`}
        >
            {props.children}
        </div>
    </div>
  </>;
}

export function Body(props){
  const cardProps = useContext(CardProps);

  return <>
    <div 
      id={cardProps.id} 
      class={`collapse ${cardProps.data.selected ? 'show' : ''}`} 
      data-bs-parent={cardProps.toggleType}
    >
        <div class="card-body">
          {props.children}
        </div>
    </div>
  </>;
}