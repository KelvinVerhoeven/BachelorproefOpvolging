var config = {};

config.db = {};
config.bot = {};
config.BAP = {};

config.debug = true;

config.db.link = "mongodb://localhost/BAPSync";

config.bot.gitToken = ""; 

config.BAP.filter = "bachelorproef"; //moet normaal iets in de zin zijn van bachelorproefopvolging2016-...
config.BAP.organisatie = "AP-Elektronica-ICT";

module.exports = config;
