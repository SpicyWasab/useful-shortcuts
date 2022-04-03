// imports
import { fetchLangDatas, setDocumentLang, setLangMetadatas } from './languages.mjs';
import { loadContent } from './load.mjs';
import { startEditors } from './editors.mjs';
import html from './html.mjs';

// main element
const mainElement = document.querySelector('main');

// determine current language, default is english.
const defaultLanguage = 'en';
let activeLanguage = new URLSearchParams(window.location.search).get('lang') ?? defaultLanguage;

// fetch language content, and load it on the page
try {
    const content = await fetchLangDatas(activeLanguage);

    // load content into page
    loadContent(content, mainElement);
    // set document lang (html lang attribute)
    setDocumentLang(activeLanguage);
    // set lang metadatas
    setLangMetadatas(content);
    // update document title
    document.title = content.title;
} catch(e) { // in case of error (when fetching language content, for example with an unknown language)
    const { message } = e;
    
    // display error's message on the page
    mainElement.append(html`<samp>Error : ${message}</samp>`);
}

// handle language change
const languageButtons = document.querySelectorAll('nav button');

for(const button of languageButtons) {
    const languageId = button.textContent;

    button.addEventListener('click', () => {
        window.location.search = `lang=${languageId}`;
    });
}

// handle text formatting
startEditors();