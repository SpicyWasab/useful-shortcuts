export async function loadLang(lang) {
    const jsonText = await fetchLangJSON(lang);
    const json = JSON.parse(json);

    insertHTML(json);
}

async function fetchLangJSON(lang) {
    const res = await fetch(`./contents/${lang}.json`);
    const json = await res.json();
}

function insertHTML(json) {
    const { title, description, shortcuts } = json;
    const mainElement = document.querySelector('main');
    
    const titleElement = html`<h1>${title}</h1>`;
    const descriptionElement = html`<p>${description}</p>`;

    shortcuts.map(({ keystrokes, description }) => {
        keystrokes = keystrokesToHTML(keystrokes);
    });

    mainElement.append(titleElement, descriptionElement, )
}

keystrokesToHTML(keystrokes) {
    const keystrokeElements = keystrokes.map(keystroke => {
        if(keystroke in keystrokesReplacements) keystroke = keystrokesReplacements[keystroke];

        return /*html*/`<kbd>${keystroke}</kbd>`; // this is just a string
    });

    return html`<kbd>${keystrokeElements.join(' + ')}</kbd>`; // otherwise, this is an HTMLElement
}

function html(strings, ...values) {
    // rebuilding template litteral
    const html = strings.map(s => s + (values.shift() ?? '')).join().trim();
  
    // building HTMLElement
    const template = document.createElement('template');
    template.innerHTML = html;
  
    return template.content.firstChild;
}

// I never use var, but in this case I use it for hoisting.
var keystrokesReplacements = {
    'Shift': '⇧'
}