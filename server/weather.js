
// Requires.
const request = require("request");

// Class to wrap the OpenWeather calls.
function Weather(token) {

    var self = this;

    // The request defaults.
    var req = request.defaults({
        method: "GET",
        baseUrl: "http://api.openweathermap.org/data/2.5/",
        qs: {
            units: "metric",
            APPID: token
        },
        json: true
    });

    // Get the forecast for the given location.
    self.getForecast = (q, cb) => {

        // Request the OpenWeather API.
        // WARNING: we assume there is no error with the OpenWeather request. This is just an example of Wit.ai
        // bot integration, so the properly error handling in this operation is not the main focus right now.
        req({ uri: "/weather", qs: { q: q } }, (err, res, data) => {

            // Extract the current temperature and conditions.
            var temperature = Math.round(data.main.temp) + "ºC";
            var conditions = data.weather[0].description;

            // Return the forecast.
            cb("The weather in " + data.name + " is " + temperature + " and " + conditions + ".");
        });
    };
}

// Export the Weather module.
module.exports = function(token) { return new Weather(token); };
