
var config = {};

config.db = {};
config.BAP = {};

config.debug = true;

config.db.link = "mongodb://localhost/BAPSync";


config.BAP.filter = "bachelorproef"; //moet normaal iets in de zin zijn van bachelorproefopvolging2016-...
config.BAP.organisatie = "AP-Elektronica-ICT";
config.BAP.logFile = "/Log/LOG.md";

module.exports = config;

// database reset option