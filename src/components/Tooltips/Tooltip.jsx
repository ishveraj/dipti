import './Tooltip.style.scss';

export const initializeTooltips = () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    if (!bootstrap.Tooltip.getInstance(tooltipTriggerEl)) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    }
  });
}

export function Tooltip(props){
  const toolContent = props.content;
  const toolClass = props.class ?? '';
  delete props.content;
  delete props.class;

  return <span class={`tooltip-container ${toolClass} `} data-bs-html="true" data-bs-toggle="tooltip" title={toolContent} {...props}>
    {props.children}
  </span>;
};