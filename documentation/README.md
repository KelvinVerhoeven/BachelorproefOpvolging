# Setup:

## NPM

install nodeJS https://nodejs.org/en/

We used versions 6.9.4, 7.2.1 and 7.4.0.

install packages with npm install <package_name>:

*    "angular-chart.js": "^1.1.1",
*    "bluebird": "^3.4.7",
*    "body-parser": "^1.15.2",
*    "compression": "^1.6.2",
*    "debug": "^2.6.0",
*    "express": "^4.14.0",
*    "express-session": "^1.14.2",
*    "github": "^5.3.3",
*    "mongoose": "^4.7.6",
*    "showdown": "^1.6.0"
 
 If the package.json is in that directory that version will be installed. We are developing the application using Microsoft Visual Studio Enterprise 2015.
 With the **Node.JS Tools 1.2** extension provided by microsoft, **web essentials 2015.3** and a **markdown** extension.

 ## openSSL

 This application also uses https for safer communication between client and server. This requires that you make a key and a certification file. Don't worry when your browser says the connection is not safe.
 Using linux or any other means.

 openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

 combining this with:

 openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem

 This gives you a passwordless key file. The resulting files should be put in the [openSSL](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/tree/master/src/BAPsync/openSSL) folder.

 [source](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/) used

 ## mongoDB

 Install and use mongoDB [here](https://docs.mongodb.com/manual/installation/)

 If you have the server running on a different computer you can change the config.db.link value [here](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/blob/master/src/BAPsync/imports/config.js).
 We were running version 3.2.10

# config

Config.js can be found [here](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/blob/master/src/BAPsync/imports/config.js)

- config.debug enables extra debugging messages on the console and writes down dumps in the debug map.
- config.db.link let you set the address of the database.
- config.BAP.filter filters out the repositories we need. 
- config.BAP.organisatie: Sets the organisation where too look for repositories.
- config.BAP.logFolder: Folderlink that contains the logFile. These needs to be separate. Github has 1MB direct download limit. So asking data directly from a file thats over 1MB would result in an error. Ex. "/map"
- config.BAP.logFile: Filename where the students pushes it logs. Ex."file.md"
- config.BAP.sciptieFolder: Folder containing the scription. Same 1MB limit applies here. Ex. "/map"
- config.BAP.sciptieFile: The book the student creates. Ex. "book.pdf"
- config.BAP.infoFile: This a json files students fill in themself on there github. Ex. "/map/file.json"  OR "/file.json"

# key.js

Exports the github token. This one needs to be filled in by the organization itself. 
Place the key.js file in /imports.

template:

var key = ""

module.exports = key;
