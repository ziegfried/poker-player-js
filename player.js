var _ = require('./underscore');

module.exports = {

    VERSION: "No Idea Bot v0.1",

    bet_request: function(gameState) {
        console.log('BET REQUEST: ' + JSON.stringify(gameState, null, '\t'));
        if (!gameState) {
            console.log('bet_request called with empty game state!!!');
            return 0;
        }
        var players = gameState.players;
        var current_buy_in = gameState.current_buy_in;

        if (this.isPreflop(gameState)) {
            switch (this.ratePreFlop(gameState)) {
                case 0:
                    console.log('>> check/fold');
                    return 0;
                case 1:
                    console.log('>> min raise');
                    return this.raiseMin(gameState);
                case 2:
                    console.log('max raise');
                    return this.raiseMin(gameState);
                case 3:
                    console.log('max raise');
                    return 1000;
            }
        } else {
            switch (parseInt(Math.random() * 20)) {
                case 0:
                    return this.allIn(gameState);
                case 1:
                case 2:
                case 3:
                case 4:
                    return this.raiseMin(gameState);
                case 5:
                case 6:
                case 7:
                    return this.fold(gameState);
                default:
                    return this.check(gameState);
            }
        }
    },

    ratePreFlop: function(gameState) {
        var players = gameState.players;
        var me = players[gameState.in_action];
        var goodCards = ['J', 'D', 'K', 'A'];

        var isSuite = me.hole_cards[0].suit === me.hole_cards[1].suit;
        var isPair = me.hole_cards[0].suit === me.hole_cards[1].suit;

        var isHighCards = _(me.hole_cards).chain().pluck('rank').all(function(r) {
            return _.contains(goodCards, r);
        }).value();

        var rating = 0 + (isSuite ? 1 : 0) + (isPair ? 2 : 0) + (isHighCards ? 1 : 0);
        console.log('Rated cards %s -> %s', JSON.stringify(me.hole_cards), rating);
        return rating;
    },

    ratePostFlop: function(gameState) {
        return 0;
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
