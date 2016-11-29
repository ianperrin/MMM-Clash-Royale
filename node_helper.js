/* global module, require */
/* jshint node: true */
/* Magic Mirror
 * Node Helper: MMM-Clash-Royale
 *
 * By Ian Perrin http://ianperrin.com
 * MIT Licensed.
 */

var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	// Subclass start method.
    start: function() {
        console.log("Starting module: " + this.name);
    },

	// Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_DATA") {
            var options = {
                url: payload.apiBase + "/api/random-deck"
            };
            this.getData(options, "RANDOM_DECK");
        }
    },

	/**
	 * getData
	 * Request data from the supplied URL and broadcast it to the MagicMirror module if it's received.
	 */
    getData: function(options, name) {
		console.log("Get " + name + " data for url " + options.url);
		var self = this;
        request(options, function(error, response, body) {
            if (response.statusCode === 200) {
                self.sendSocketNotification(name, JSON.parse(body));
            } else {
				self.sendSocketNotification(name); 
                console.log("Error getting " + name + " " + response.statusCode);
            }
        });
    }
});