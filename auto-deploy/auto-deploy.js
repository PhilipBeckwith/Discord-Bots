require('dotenv').config();
var express = require("express");
var app = express();
var childProcess = require('child_process');
var path = require('path');

const deployScript = path.resolve(__dirname, "deploy.sh");
const port = process.env.PORT ? process.env.PORT : 3000;

app.post("/auto-deploy/webhooks/updates-to-master", function(req, res) {
  childProcess.exec(deployScript, function(err, stdout, stderr){
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    console.log(stdout);
    if(stderr){
      console.error(stderr);
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => console.log(`Auto pull listening at http://localhost:${port}`));
