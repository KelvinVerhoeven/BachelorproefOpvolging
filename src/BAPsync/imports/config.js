
var config = {};

config.db = {};
config.BAP = {};

config.debug = true;

config.db.link = "mongodb://localhost/BAPSync";


config.BAP.filter = "bachelorproef"; //moet normaal iets in de zin zijn van bachelorproefopvolging2016-...
config.BAP.organisatie = "AP-Elektronica-ICT";
config.BAP.logFolder = "/Log";
config.BAP.logFile = "LOG.md";
config.BAP.sciptieFolder = "/Scriptie" //has to be the folder
config.BAP.sciptieFile = "book.pdf";

module.exports = config;

// database reset option