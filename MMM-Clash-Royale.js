/* global Log, Module */
/* Magic Mirror
 * Module: MMM-Clash-Royale
 *
 * By Ian Perrin http://ianperrin.com
 * MIT Licensed.
 */
Module.register("MMM-Clash-Royale",{

    // Set the minimum MagicMirror module version for this module.
    requiresVersion: "2.0.0",

    // Module config defaults.
    defaults: {
        updateInterval: 5 * 60 * 1000,      // every 5 minutes
        animationSpeed: 1000,               // 1 second to fade between cards
        initialLoadDelay: 0,                // 0 seconds delay
        grayscale: true,                    // show cards in grayscale
        apiBase: "http://www.clashapi.xyz", // base URL for the api

        showName: true,                    // shows the card name
        showDescription: false,             // shows the card description

        debug: false,                       // output debugging messages to console and log
    },

    // our cards
    cards: false,
    
    // A loading boolean.
    loading: true,

    // Subclass getStyles method.
    getStyles: function () {
        return ["MMM-Clash-Royale.css"];
    },

    // Subclass start method.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.getData();
        this.scheduleUpdate(this.config.updateInterval);
    },

    getData: function(){
        this.sendSocketNotification("GET_DATA", this.config);
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        
        var self = this;
        setTimeout(function() {
            self.getData();
        }, nextLoad);
    },
          
    // Subclass socketNotificationReceived method.
    socketNotificationReceived: function(notification, payload){
        if(notification === "RANDOM_DECK"){
            console.log(payload);
            this.cards = payload;
            this.loading = (!this.cards);
            this.updateDom(this.config.animationSpeed);
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.classList.add("small");
        
        if (this.loading) {
            wrapper.innerHTML = this.translate('LOADING');
            wrapper.classList.add("dimmed","light");
            return wrapper;
        }

        var cardList = document.createElement("ul");
        cardList.classList.add("cards");

        // Loop through card array
        for (var i = this.cards.length - 1; i >= 0; i--) {

            // get current card
            var card = this.cards[i];

            // card wrapper
            var cardWrapper = document.createElement("li");
            cardWrapper.classList.add("small", "card");

            // show image for current card
            var cardImgDiv = document.createElement("div");
            cardImgDiv.classList.add("image");
            if(card.elixirCost) {
                cardImgDiv.setAttribute("data-badge",card.elixirCost);
            }

            var cardImg = document.createElement("img");
            cardImg.src = this.config.apiBase + "/images/cards/" + card.idName + ".png";
            if(this.config.grayscale){
                cardImg.classList.add("grayscale");
            }
            cardImgDiv.appendChild(cardImg);
            cardWrapper.appendChild(cardImgDiv);

            // show name for current card
            if (this.config.showName) {
                var cardName = document.createElement("div");
                cardName.innerHTML = card.name;
                cardName.classList.add("name");
                cardWrapper.appendChild(cardName);
            }

            // show description for current card
            if (this.config.showDescription) {
                var cardDescription = document.createElement("div");
                cardDescription.innerHTML = card.description;
                cardDescription.classList.add("light", "description");
                cardWrapper.appendChild(cardDescription);
            }

            cardList.appendChild(cardWrapper);
        }
        wrapper.appendChild(cardList);

        return wrapper;
    },

});
