export default function html(strings, ...values) {
    // to parse HTMLElement objects and HTMLElement arrays.
    const getString = (object) => {
        return object?.map?.(obj => obj?.outerHTML).join?.('') ?? object?.outerHTML ?? object;}

    // rebuilding template litteral
    const html = strings.map(s => s + (getString(values.shift()) ?? '')).join('').trim();
  
    // building HTMLElement
    const template = document.createElement('template');
    template.innerHTML = html;
  
    return template.content.firstChild;
}