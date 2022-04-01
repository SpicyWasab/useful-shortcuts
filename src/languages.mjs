export async function loadLang(lang) {
    const langDatas = await fetchLangDatas(lang);
    insertHTML(langDatas);
}

async function fetchLangDatas(lang) {
    const res = await fetch(`./contents/${lang}.json`);
    const json = await res.json();

    return json;
}

function insertHTML(json) {
    const { title, description, shortcutsCategories } = json;
    const mainElement = document.querySelector('main');
    
    const titleElement = html`<h1>${title}</h1>`;
    const descriptionElement = html`<p>${description}</p>`;
    // everything below description
    const shortcutElements = [];

    // for each shortcuts category
    for(const category in shortcutsCategories) {
        // every element in this category (there are 2, the title and the table)
        const categoryElements = [];

        // create category title and push it
        const categoryTitleElement = html`<h2>${category}</h2>`;
        categoryElements.push(categoryTitleElement);

        // get shortcuts
        const shortcuts = shortcutsCategories[category];
        const tableRowElements = shortcuts.map(({ keystrokes, description }) => {
            keystrokes = keystrokesToHTML(keystrokes);
            description = parseKeystrokeDescription(description);
            
            return html`<tr>
                            <td>${keystrokes}</td>
                            <td>${description}</td>
                        </tr>`;
        });

        const tableElement = html`
            <table>
                <thead>
                    <tr>
                        <th>Shortcut</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowElements}
                </tbody>
            </table>`;

        categoryElements.push(tableElement);

        shortcutElements.push(...categoryElements);
    }
    
    mainElement.append(titleElement, descriptionElement, ...shortcutElements);
}

function keystrokesToHTML(keystrokes) {
    const keystrokeElements = keystrokes.map(keystroke => {
        if(keystroke in keystrokesReplacements) keystroke = keystrokesReplacements[keystroke];

        return /*html*/`<kbd>${keystroke}</kbd>`; // this is just a string
    });

    return html`<kbd>${keystrokeElements.join(' + ')}</kbd>`; // otherwise, this is an HTMLElement
}

function parseKeystrokeDescription(description) {
    for(const symbol in keystrokeDescriptionReplacements) {
        const replacement = keystrokeDescriptionReplacements[symbol];

        description = description.replaceAll(symbol, replacement);
    }

    console.log(description);

    return description;
}

function html(strings, ...values) {
    // to parse HTMLElement objects and HTMLElement arrays.
    const getString = (object) => {
        console.log(object?.map?.(obj => obj?.outerHTML).join?.('') ?? object?.outerHTML ?? object);
        return object?.map?.(obj => obj?.outerHTML).join?.('') ?? object?.outerHTML ?? object;}

    // rebuilding template litteral
    const html = strings.map(s => s + (getString(values.shift()) ?? '')).join('').trim();
  
    // building HTMLElement
    const template = document.createElement('template');
    template.innerHTML = html;
  
    return template.content.firstChild;
}

var keystrokesReplacements = {
    'Shift': '⇧'
}

var keystrokeDescriptionReplacements = {
    '{': '<b>',
    '}': '</b>'
}