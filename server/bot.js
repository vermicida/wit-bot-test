
// Requires.
const config = require("./utils").config();
const print = require("./utils").print;
const randomstring = require("randomstring");
const weather = require("./weather");
const wit = require("node-wit");

// A class to wrap the communication with the Wit.ai bot.
function Bot(token, sessionId) {

    var self = this;

    // The callback function for the 'sendMessage' action.
    var onBotSaid;

    // Generate a random session identitifer if the given one is undefined.
    self.sessionId = sessionId || randomstring.generate({ length: 16, capitalization: "lowercase" });

    // Create a new Wit client.
    var client = new wit.Wit(token, {

        // Bot say action.
        // Execute the callback for the previous 'sendMessage' action.
        "say": (sessionId, context, message, cb) => {

            // If a callback is set for this action, it is executed.
            if (onBotSaid) { onBotSaid(sessionId, context, message); }

            // Follow up with the next step.
            cb();
        },

        // Bot merge action.
        // Merge the new entities into the context.
        "merge": (sessionId, context, entities, message, cb) => {

            // Try to get the 'location' entity and merge it to the context.
            var location = firstEntityValue(entities, "location");

            if (location) { context.loc = location; }

            // Pass the context to the next step.
            cb(context);
        },

        // Bot merge action.
        // Log the errors comming from the bot side.
        "error": (sessionId, context, error) => {
            print(error.message);
        },

        // Bot fetch-weather action.
        // Fetch the current weather for the given location.
        "fetch-weather": (sessionId, context, cb) => {

            // Fetch the forecast.
            weather(config.openWeather.key).getForecast(context.loc, (forecast) => {

                // Set the forecast in the context.
                context.forecast = forecast;

                // Pass the context to the next step.
                cb(context);
            });
        }
    });

    // Extract an entity value from the given entity collection.
    const firstEntityValue = (entities, entity) => {

        const val = entities &&
            entities[entity] &&
            Array.isArray(entities[entity]) &&
            entities[entity].length > 0 &&
            entities[entity][0].value;

        return val ? typeof val === "object" ? val.value : val : null;
    };

    // Send the given message to the bot.
    self.sendMessage = (msg, context, cb) => {

        // Store the callback function reference. It will
        // be executed within the 'say' action.
        onBotSaid = cb;

        // Initialize the context.
        context = context || {};

        // Run the action in the bot.
        client.runActions(self.sessionId, msg, context);
    };
}

// Export the Bot module.
module.exports = function(token, sessionId) { return new Bot(token, sessionId); };
