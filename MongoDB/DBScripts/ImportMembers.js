/*
--------------------
INSTRUCTIONS
--------------------

To use this script, you'll need to run this specific file from node:

    node .\MongoDB\DBScripts\ImportMembers.js

The major things to be aware of are:
    - running this file will generate a json file containing all of the members currently in the database
    - the json file will save in the directory /ScriptsOutput as MemberImport.json
    - the results exclude the games array available to every member for simplicities sake
    - the generated json file is intended to be used with the UpdateMembers.js script
    - no action is required by you, simply run the script to generate the file. Each run will
      remove existing .json files at the location so be aware in case you have made changes.
*/

require('dotenv').config();
const MongoConnection = require("../MongoConnection");
const path = require('path');
const fs = require('fs');


let results = []
MongoConn = new MongoConnection()
MongoConn.GetAllMembers().then(members => {
    console.log(`Type of members ${typeof(members)}`)
    results = [...members]
    console.log(results)
    var jsonContent = JSON.stringify(results, null, 2)
    fs.writeFile(path.join(__dirname, "ScriptsOutput", "MemberImport.json"), jsonContent, 'utf8', () => {
        console.log("JSON file has been saved.");
    });
})
.catch(err => {
    console.log(`An error occured while writing JSON Object to File. ${err}`)
})
.finally(()=> {
    MongoConn.CloseConnection()
})