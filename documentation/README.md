# Setup:

## NPM

install nodeJS https://nodejs.org/en/

install packages with npm install <package_name>:

*    "bluebird": "^3.4.6",
*    "body-parser": "~1.8.1",
*    "debug": "~2.0.0",
*    "express": "~4.9.0",
*    "github": "^5.3.3",
*    "jade": "~1.6.0",
*    "mongoose": "^4.6.5",
*    "morgan": "~1.3.0",
*    "serve-favicon": "~2.1.3",
*    "stylus": "0.42.3"
 
 If the package.json is in that directory that version will be installed. We are developing the application using visual studio.
 With the **nodeJS** extension provided by microsoft, **web essential 2015.3** and a **markdown** extension.

 ## openSSL

 This application also uses https for safer communication between client and server. This requires that you make a key and a certification file.
 Using linux or any other means.

 openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

 combining this with:

 openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem

 This gives you a passwordless key file. The resulting files should be put in the [openSSL](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/tree/master/src/BAPsync/openSSL) folder.

 [source](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/) used

 ## mongoDB

 Install and use mongoDB [here](https://docs.mongodb.com/manual/installation/)

 If you have the server running on a different computer you can change the config.db.link value [here](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/blob/master/src/BAPsync/imports/config.js)

# config

Config.js can be found [here](https://github.com/KelvinVerhoeven/BachelorproefOpvolging/blob/master/src/BAPsync/imports/config.js)

- config.debug enables extra debugging messages on the console and writes down dumps in the debug map.
- config.db.link let you set the address of the database.
- config.BAP.filter filters out the repositories we need. 
- config.BAP.organisatie: Sets the organisation where too look for repositories.

# key.js

Exports the github token.