var _ = require('./underscore');

var Player = function() {};
_.extend(Player.prototype, {

    VERSION: "No Idea Bot v0.1.3",

    bet_request: function(gameState) {
        if (!gameState) {
            console.log('bet_request called with empty game state!!!');
            return 0;
        }

        if (this.isPreflop(gameState)) {
            console.log('PRE FLOP');
            var preFlopRating = this.ratePreFlop(gameState);
            switch (preFlopRating) {
                case 0:
                    switch (parseInt(Math.random() * 2))
                    {
                        case 0:
                            console.log("No good cards, raising slowly... :)");
                            return this.raise(gameState, 10);
                        case default:
                            console.log("No good cards, check/fold");
                            return 0;
                    }
                    console.log('>> check/fold');
                    return 0;
                default:
                    console.log('RAISE', preFlopRating);
                    return this.raise(gameState, preFlopRating);
            }
        } else {
            console.log('POST FLOP');
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

    raise: function(gameState, factor) {
        var me = gameState.players[gameState.in_action];
        return gameState.current_buy_in - me.bet + gameState.minimum_raise * factor;
    },

    ratePreFlop: function(gameState) {
        var players = gameState.players;
        var me = players[gameState.in_action];
        var goodCards = ['J', 'D', 'K', 'A'];

        var isSuite = me.hole_cards[0].suit === me.hole_cards[1].suit;
        var isPair = me.hole_cards[0].rank === me.hole_cards[1].rank;

        var isHighCards = _(me.hole_cards).chain().pluck('rank').all(function(r) {
            return _.contains(goodCards, r);
        }).value();

        var rating = 0 + (isSuite ? 1 : 0) + (isPair ? 2 : 0) + (isHighCards ? 1 : 0);
        return rating;
    },

    ratePostFlop: function(gameState) {
        return 0;
    },

    isPreflop: function(gameState) {
        return !(gameState.community_cards && gameState.community_cards.length);
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
});

module.exports = new Player();
