export async function fetchLangDatas(lang) {
    const res = await fetch(`./contents/${lang}.json`);
    
    if(res.statusText != 'OK') throw new Error(`No content for ${lang} language yet.`);
    
    const json = await res.json();

    return json;
}