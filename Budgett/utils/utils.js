const fetch = require('node-fetch');
const DomParser = require('dom-parser');
const {wednesdayPath, nGagPath, defaultMeme} = require('../config.json');

async function getWednesdayMeme(){
    try{
        const response = await fetch(wednesdayPath);
        const html = await response.text();
        const doc = (new DomParser).parseFromString(html, 'text/html');
        const arrMemes = doc.getElementById("jsid-latest-entries").textContent.split(',');
        let rdmMeme = arrMemes[Math.floor(Math.random() * arrMemes.length)];
        return nGagPath + rdmMeme;
    }catch(exception){
        console.log('Could Not Fetch Wednesday')
        return defaultMeme;
    }
}

module.exports = {
    getWednesdayMeme
}

