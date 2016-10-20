var config = {};

config.db = {};
config.bot = {};
config.BAP = {};

config.debug = true;

config.db.link = "mongodb://localhost/BAPSync";

config.bot.gitToken = "a token :D" 

config.BAP.filter = "AP"; //moet normaal iets in de zin zijn van bachelorproefopvolging2016-...

module.exports = config;

//database reset option? To clear it for next year