const fetch = require('node-fetch');
const DomParser = require('dom-parser');
const {wednesdayPath, nGagPath, defaultMeme} = require('../config.json');

getWednesdayMeme = () =>{
    return fetch(wednesdayPath)
        .then(res => res.text())
        .then(responseText => {
            const doc = (new DomParser).parseFromString(responseText, 'text/html');
            const arrMemes = doc.getElementById("jsid-latest-entries").textContent.split(',');
            let rdmMeme = arrMemes[Math.floor(Math.random() * arrMemes.length)];
            return nGagPath + rdmMeme;
        })
        .catch(() => {return defaultMeme})
}

module.exports = getWednesdayMeme;