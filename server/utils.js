
// Requires.
const colour = require("colour");
const dateFormat = require("dateformat");
const fs = require("fs");
const path = require("path");

// Cached configuration data.
var config;

// Export the Utils module.
module.exports = {

    // Print the given message in the console.
    "print": (msg) => {
        console.log(dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss").cyan + " > ".red + msg.green);
    },

    // Read the config file, parse it and return it.
    "config": () => {

        // If the config is not retrieved yet.
        if (!config) {

            // Read and parse the config file.
            // WARNING: we assume there is no error in the config file reading. This is just an example of Wit.ai
            // bot integration, so the properly error handling in this operation is not the main focus right now.
            config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json")));
        }

        // Return the config data.
        return config;
    }
};
