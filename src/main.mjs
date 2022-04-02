import { fetchLangDatas } from './languages.mjs';
import { loadContent } from './load.mjs';
import html from './html.mjs';

// main element
const mainElement = document.querySelector('main');

// determine current language, default is english.
const defaultLanguage = 'en';
let activeLanguage = new URLSearchParams(window.location.search).get('lang') ?? defaultLanguage;

// fetch language content, and load it into main
try {
    const content = await fetchLangDatas(activeLanguage);
    loadContent(content, mainElement);
} catch(e) {
    const { message } = e;
    
    mainElement.append(html`<samp>Error : ${message}</samp>`);
}