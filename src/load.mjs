import html from './html.mjs';
import keystrokesReplacements from '../text-formatting/keystrokes.mjs';
import keystrokeDescriptionReplacements from '../text-formatting/text-formatting.mjs';

export async function loadContent(content, element) {
    // parse content to html
    const elements = parseToHTMLElements(content);

    element.append(...elements);
}

function parseToHTMLElements(json) {
    const { title, description, shortcutsCategories, footer } = json;
    
    const titleElement = html`<h1>${title}</h1>`;
    const descriptionElement = html`<p>${description}</p>`;
    const footerElement = html`<footer>${footer} <a href="https://github.com/SpicyWasab/useful-shortcuts">see source code</a></footer>`;

    // everything below description
    const shortcutElements = [];

    // for each shortcuts category
    for(const category in shortcutsCategories) {
        // every element in this category (there are 2, the title and the table)
        const categoryElements = [];

        // create category title and push it
        const categoryTitleElement = html`<h2>${category}</h2>`;
        categoryElements.push(categoryTitleElement);

        // get description and shortcuts
        const { description, shortcuts } = shortcutsCategories[category];

        // create category descriptipn and push it
        const categoryDescriptionElement = html`<p>${description}</p>`;
        categoryElements.push(categoryDescriptionElement);

        // create row elements and push them
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

        const categorySectionElement = html`<section>${categoryElements}</section>`;

        shortcutElements.push(categorySectionElement);
    }
    
    return [titleElement, descriptionElement, ...shortcutElements, footerElement];
}

function keystrokesToHTML(keystrokes) {
    const keystrokeElements = keystrokes.map(keystroke => {
        if(keystroke in keystrokesReplacements) keystroke = keystrokesReplacements[keystroke];

        return /*html*/`<kbd class="keystroke">${keystroke}</kbd>`; // this is just a string
    });

    return html`<kbd class="shortcut">${keystrokeElements.join(' + ')}</kbd>`; // otherwise, this is an HTMLElement
}

function parseKeystrokeDescription(description) {
    for(const symbol in keystrokeDescriptionReplacements) {
        const replacement = keystrokeDescriptionReplacements[symbol];

        description = description.replaceAll(symbol, replacement);
    }

    console.log(description);

    return description;
}