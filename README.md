
# wit-ai-test

This is a simple Wit bot test. It can only give you the weather forecast. I know it's not as smart as you would like, but hey, it's a beginning ;)

[![Dependency Status](https://david-dm.org/vermicida/wit-bot-test.svg)](https://david-dm.org/vermicida/wit-bot-test)

## Getting started

This application consumes a Wit app based on the [5 Minute Quickstart](https://wit.ai/docs/quickstart) recipe, so the first step you have to take is to follow up this guide and create your own app. Once the app is ready, go to the Settings / API Details menu in your Wit console and keep safe the Client Access Token; you will need it later.

To fetch the weather forecast, this application uses [OpenWeatherMap API](http://openweathermap.org/). You must get an [API key](http://openweathermap.org/appid) to allow your code to go there for data. Remember to have this API key on hand.

Clone this repo using the command below:
```bash
$ git clone https://github.com/vermicida/wit-bot-test.git
```

Then, install de app dependencies using NPM:
```bash
$ npm install
```

Now we're ready to configure the app. 

## Configuration

Open the `config.json` file, located in the app root, and fill in the tokens that you got before: 
```json
{
  "witai": {
    "accessToken": "Use the token from the Wit app right here."
  },
  "openWeather": {
    "key": "And put the OpenWeatherMap's here."
  }
}
```

Also, you can set the server's host and port:
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 9000
  }
}
```

## Running

You're only one step to chat with your bot. Just run the NPM `start` script:
```bash
$ npm start
```

Navigate the server in a browser _et voilà_!

The conversation must flow this way:

- Bot: Connected
- You: What's the weather?
- Bot: Where exactly?
- You: In Malaga, Spain (you can ask the bot for any town)
- Bot: The weather in Malaga is 12ºC and clear sky.

## License

Code released under the [MIT license](./LICENSE).
