
// Requires.
const bot = require("./bot");
const config = require("./utils").config();
const express = require("express");
const http = require("http");
const path = require("path");
const print = require("./utils").print;
const socketio = require("socket.io");

// Create the Express application and the Socket.IO server.
const app = express();
const server = http.Server(app);
const io = socketio(server);

// Set the webapp directory as static.
app.use(express.static("public"));

// When a client connects.
io.on("connection", function(socket) {

    // Log and send a message to the client to confirm the connection.
    print("client connected");
    socket.emit("bot-message", { msg: "Connected" });

    // Handle the client incoming messages.
    socket.on("user-message", function(data) {

        // Log the message data.
        print("received: " + JSON.stringify(data));

        // Create a bot using the given session identifier.
        const witbot = bot(config.witai.accessToken, data.sessionId);

        // Ask the bot.
        witbot.sendMessage(data.msg, data.context, (sessionId, context, msg) => {

            // Emit the bot response to the client.
            socket.emit("bot-message", {
                sessionId: sessionId,
                context: context,
                msg: msg
            });
        });
    });
});

// Run the server.
server.listen(
    config.server.port,
    config.server.host,
    function() {
        print("server running at http://" + config.server.host + ":" + config.server.port);
    }
);
