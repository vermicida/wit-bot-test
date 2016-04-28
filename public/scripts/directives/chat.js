
"use strict";

(function() {

    function chat($window) {

        return {
            restrict: "E",
            templateUrl: "views/chat.html",
            link: function(scope) {

                // The socket.
                var socket;

                // The Wit.ai conversation session and context.
                var storySessionId;
                var storyContext;

                // A reference to the 'a' element that scrolls the conversation down.
                var scroller = $window.document.getElementById("tzsklxyjeurwykbf");

                // A reference user input box.
                var input = $window.document.getElementById("xuafdwulathjbujs");
                input.focus();

                // The conversation lines.
                scope.conversation = [];

                // Execute the given function in a safe way.
                function safeApply(fn) {
                    switch (scope.$root.$$phase) {
                        case "$apply":
                        case "$digest":
                            fn();
                            break;
                        default:
                            scope.$apply(fn);
                            break;
                    }
                }

                // Push a conversation line to the collection.
                function pushConversationLine(speaker, message) {

                    // Add the conversation line -callback, do in a safe way-.
                    safeApply(function() {
                        scope.conversation.push({
                            speaker: speaker,
                            message: message,
                            timestamp: new Date().getTime()
                        });
                    });

                    // Hack: scroll the conversation down.
                    scroller.click();
                }

                // Push a server message to the conversation.
                function serverSay(message) {
                    pushConversationLine("server", message);
                }

                // Push an user message to the conversation.
                function userSay(message) {
                    pushConversationLine("user", message);
                }

                // Create a connection with the server using Socket.IO.
                function openSocket() {

                    // Open the socket.
                    var server = "http://" + $window.location.hostname + ":" + $window.location.port;
                    socket = $window.io.connect(server, { forceNew: true });

                    // Handler for the server messages.
                    socket.on("bot-message", function(data) {

                        // If the message has data.
                        if (data) {

                            // Store the story session identifier.
                            if (data.sessionId) {
                                storySessionId = data.sessionId;
                            }

                            // Store the story context.
                            if (data.context) {
                                storyContext = data.context;
                            }

                            // Push the server message.
                            if (data.msg) {
                                serverSay(data.msg);
                            }
                        }
                    });
                }

                // Send the user message to the server.
                scope.userMessageBoxKeyUp = function(e) {

                    // In case the user pressed the 'enter' key.
                    if ((e.keyCode || e.which) === 13) {

                        // If the message is not empty.
                        if (input.value) {

                            // Push it to the conversation.
                            userSay(input.value);

                            // Send it to the server.
                            socket.emit("user-message", {
                                msg: input.value,
                                session_id: storySessionId
                            });

                            // Clean and focus the box.
                            input.value = "";
                            input.focus();
                        }
                    }
                };

                // Init the conversation.
                openSocket();
            }
        };
    }

    chat.$inject = ["$window"];

    angular.module("wit-ai-test").directive("chat", chat);

})();
