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
    const createMetadataElement = (property, value) => html`<meta ${property} content="${value}">`;
    
    const metadatas = {
        'property="og:title"': title,
        'property="og:description"': description,
        'property="og:image"': 'https://iconorbit.com/icons/256-watermark/2004201613212919397-Keyboard%20icon.jpg',
        'property="og:site_name"': title,
        'name="theme-color"': '#f16b8c'
    }

    const metadataElements = [];

    for(const metadata in metadatas) {
        const value = metadatas[metadata];

        const metaElement = createMetadataElement(metadata, value);
        metadataElements.push(metaElement);
    }

    document.head.append(...metadataElements);
}