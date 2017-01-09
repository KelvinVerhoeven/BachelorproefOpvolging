
var config = {};

config.db = {};
config.BAP = {};

config.debug = true;
config.repoDebug = true; //when true it scans a diffrent profile then AP when false it scans the set organisatie. 

config.db.link = "mongodb://localhost/BAPSync";


config.BAP.filter = "bachelorproef"; //moet normaal iets in de zin zijn van bachelorproefopvolging2016-...
config.BAP.organisatie = "AP-Elektronica-ICT";
config.BAP.logFolder = "/Log";
config.BAP.logFile = "LOG.md";
config.BAP.sciptieFolder = "/Scriptie" //has to be the folder
config.BAP.sciptieFile = "book.pdf";
config.BAP.infoFile = "info.json";

module.exports = config;

// database reset option