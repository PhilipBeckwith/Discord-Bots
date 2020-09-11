/*
--------------------
INSTRUCTIONS
--------------------

To use this script, you'll need to run this specific file from node:

    - node .\MongoDB\DBScripts\UpdateMembers.js <FIELDNAME>
    
    - <FILENAME> is an optional parameter the script will default to MemberExport if no filename is provided
        - No extension required

The major things to be aware of are:
    - you need to provide a specific fieldName you want to update
    - the default behavior of the program is to update ALL members from the json file
      produced by the importMembers.js script. You can delete some members from that json
      file if you want to only update some, but it is not necessary. 
    - The script will not allow you to update _id or steamID fields due to potential problems
    - The script does not currently allow you to add new fields
*/
const dotenv = require('dotenv').config();
const MongoConnection = require("../MongoConnection");
const path = require('path');
const fs = require('fs');

// Set the fieldName that you want to update here
// Note that field names are case sensitive
var fieldToUpdate = "phone"

// Default 
var sourceFolder = "MemberExport"
if(process.argv[2]){
    sourceFolder = process.argv[2]
}

if(fs.existsSync(path.join(__dirname, "ScriptsOutput", `${sourceFolder}.json`))){
    const Members = require(`./ScriptsOutput/${sourceFolder}.json`)
    if(!Object.keys(Members[0]).includes(fieldToUpdate)
        || fieldToUpdate == "_id" || fieldToUpdate == "steamID"){
        console.log("Invalid fieldname") 
        return 
    }
    var MongoConn = new MongoConnection()
    Promise.all(
        Members.map(member =>{
            console.log(`Updating ${member.discordAlias}`)
            return MongoConn.UpdateMemberField(member._id, fieldToUpdate, member[fieldToUpdate])
        })
    )
    .catch(err => console.log(err))
    .finally(() => MongoConn.CloseConnection())
}
else{
    console.log("Members Template does not exist. Cannot update. Run ImportMembers script to generate missing file")
}