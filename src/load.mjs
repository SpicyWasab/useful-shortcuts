// imports
import html from './html.mjs';
import keystrokesReplacements from '../text-formatting/keystrokes.mjs';
import customMarkupReplacements from '../text-formatting/text-formatting.mjs';

/**
 * Load the content on the page
 * @param {*} content the content
 * @param {*} element the element to display the content in, main in this case
 */
export async function loadContent(content, element) {
    // parse content to html
    const elements = parseToHTMLElements(content);

    // put the content on the page
    element.append(...elements);
}

/**
 * Parse JSON datas to html elements
 * @param {*} json 
 * @returns {Array<HTMLElement>}
 */
function parseToHTMLElements(json) {
    // extract title, description, shortcutsCategories and footer from json
    const { title, description, shortcutsCategories, footer } = json;
    
    // build title, description and footer
    const titleElement = html`<h1>${title}</h1>`;
    const descriptionElement = html`<p>${description}</p>`;
    const footerElement = html`<footer>${footer} <a href="https://github.com/SpicyWasab/useful-shortcuts">See source code</a></footer>`;

    // Shortcuts sections elements
    const shortcutElements = [];

    // for each shortcuts category
    for(const category in shortcutsCategories) {
        // every element in this category (there are 3, the title, the description and the shortcut table)
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
        const tableRowElements = shortcuts.map(({ keystrokes, description, testArea }) => {
            keystrokes = keystrokesToHTML(keystrokes);
            description = parseCustomMarkup(description);
            testArea = (typeof testArea === 'string') ? parseCustomMarkup(testArea) : // if it's a string, return testArea
                       (testArea.type === 'textarea') ? html`<textarea placeholder="${testArea.placeholder ?? ''}">${testArea.content ?? ''}</textarea>` : // if it's a textarea, return a textarea
                       (testArea.type === 'editor') ? html`<div class="editor" contenteditable="true">${testArea.content}</div>` :
                       undefined; // otherwise, return undefined.
                ;

            return html`<tr>
                            <td class="shortcut-cell">${keystrokes}</td>
                            <td class="description-cell">${description}</td>
                            <td class="test-cell">${testArea}</td>
                        </tr>`;
        });

        // create the shortcut table
        const tableElement = html`
            <table>
                <thead>
                    <tr>
                        <th class="shortcut-cell">Shortcut</th>
                        <th class="description-cell">Description</th>
                        <th class="test-cell">Try it !</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowElements}
                </tbody>
            </table>`;

        // push the table into categoryElements
        categoryElements.push(tableElement);

        // create the section element, and push it into shortcutsElements
        const categorySectionElement = html`<section>${categoryElements}</section>`;
        shortcutElements.push(categorySectionElement);
    }
    
    // return an Array containing the elements
    return [titleElement, descriptionElement, ...shortcutElements, footerElement];
}

/**
 * Take a keystrokes array representing a shortcut, and return the corresponding HTML
 * @param {Array} keystrokes 
 * @returns 
 */
function keystrokesToHTML(keystrokes) {
    // for each keystroke
    const keystrokeElements = keystrokes.map(keystrokeText => {
        let keystroke = keystrokeText;
        if(keystrokeText in keystrokesReplacements) keystroke = keystrokesReplacements[keystrokeText]; // replace keystroke text if possible (exemple : replace "Shift" with an UpArrow)

        return /*html*/`<kbd class="keystroke" title="${keystrokeText}">${keystroke}</kbd>`; // this is just a string, the HTML code for the keystroke
    });

    // create the shortcut html
    return html`<kbd class="shortcut">${keystrokeElements.join(' + ')}</kbd>`; // otherwise, this is an HTMLElement
}

/**
 * Replace some parts of the description with the corresponding HTML
 * @param {String} description 
 * @returns 
 */
function parseCustomMarkup(description) {
    for(const symbol in customMarkupReplacements) {
        const replacement = customMarkupReplacements[symbol];

        description = description.replaceAll(symbol, replacement);
    }

    return description;
}