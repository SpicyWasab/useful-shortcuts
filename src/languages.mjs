// imports
import html from "./html.mjs";

export async function fetchLangDatas(lang) {
    const res = await fetch(`./contents/${lang}.json`);
    
    if(res.statusText != 'OK') throw new Error(`No content for ${lang} language yet.`);
    
    const json = await res.json();

    return json;
}

export function setDocumentLang(lang) {
    document.documentElement.setAttribute('lang', lang);
}

export function setLangMetadatas({ title, description }) {
    const createMetadataElement = (title, value) => html`<meta property="og:${title}" content="${value}">`;
    
    const metadatas = {
        title,
        description,
        type: 'website',
        image: 'https://iconorbit.com/icons/256-watermark/2004201613212919397-Keyboard%20icon.jpg',
        url: window.location
    }

    const metadataElements = [];

    for(const metadata in metadatas) {
        const value = metadatas[metadata];

        const metaElement = createMetadataElement(metadata, value);
        metadataElements.push(metaElement);
    }

    document.head.append(...metadataElements);
}