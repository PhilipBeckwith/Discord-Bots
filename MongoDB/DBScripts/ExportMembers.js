/*
--------------------
INSTRUCTIONS
--------------------

To use this script, you'll need to run this specific file from node:

    - node .\MongoDB\DBScripts\ImportMembers.js <FILENAME>

    - <FILENAME> is an optional parameter the script will default to MemberImport if no filename is provided
        - No extension required

The major things to be aware of are:
    - running this file will generate a json file containing all of the members currently in the database
    - the json file will save in the directory /ScriptsOutput as MemberImport.json
    - the results exclude the games array available to every member for simplicities sake
    - the generated json file is intended to be used with the UpdateMembers.js script
    - no action is required by you, simply run the script to generate the file. Each run will
      remove existing .json files at the location so be aware in case you have made changes.
*/

require('dotenv').config({path: '../../.env'});
require('../DBConnection');

const path = require('path');
const fs = require('fs').promises;
const Member = require('../Models/Member'); 

async function ExportMembers(outputDestination){
    try{
        const results = await Member.find()
        var jsonContent = JSON.stringify(results, null, 2)
        await fs.writeFile(path.join(__dirname, "ScriptsOutput", `${outputFilename}.json`), jsonContent, 'utf8', () => {
            console.log("JSON file has been saved.");
        });
    }
    catch(error){
        console.log(`An error occured while writing JSON Object to File. ${error}`)
    }
    finally{
        process.exit(0)
    }
}

var outputFilename = "MemberExport"
if(process.argv[2]){
    outputFilename = process.argv[2]
}

ExportMembers(outputFilename)