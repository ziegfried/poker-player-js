var _ = require('./underscore');

module.exports = {

    VERSION: "Default JavaScript folding player",

    bet_request: function(gameState) {
        var players = gameState.players;
        var current_buy_in = gameState.current_buy_in;
        var me = players[gameState.in_action];

        if (this.isPreflop(gameState)) {
            if (this.ratePreflop(gameState) > 0) {
                return 1000;
            } else {
                return 0;
            }
        } else {
            switch (parseInt(Math.random() * 10)) {
                case 0:
                    return this.allIn(gameState);
                case 1:
                    return this.raiseMin(gameState);
                case 2:
                    return this.fold(gameState);
                default:
                    return this.check(gameState);
            }
        }
    },

    ratePreflop: function(gameState) {
        var players = gameState.players;
        var me = players[gameState.in_action];
        var goodCards = ['J', 'D', 'K', 'A'];
        
        return _(me.hole_cards).chain().pluck('rank').all(function(r){
            return _.contains(goodCards, r);
        }).value() ? 1 : 0;
    },

    isPreflop: function(gameState) {
        return !gameState.community_cards.length;
    },

    raiseMin: function(gameState) {
        var me = gameState.players[gameState.in_action];
        return gameState.current_buy_in - me.bet + gameState.minimum_raise;
    },

    allIn: function(gameState) {
        return gameState.players[gameState.in_action].stack;
    },

    check: function(gameState) {
        return 0;
    },

    fold: function(gameState) {
        return 0;
    },

    showdown: function(gameState) {

    }
};
