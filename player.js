var _ = require('./underscore');

var Player = function() {
    this.state = { lowBall: Math.random() > .9 };
};
_.extend(Player.prototype, {

    VERSION: "No Idea Bot v0.1.3",

    bet_request: function(gameState) {
        if (!gameState) {
            console.log('bet_request called with empty game state!!!');
            return 0;
        }

        var me = gameState.players[gameState.in_action];

        if (this.isPreflop(gameState)) {
            var numberOfPlayers = _(gameState.players).filter(function(player) {
                return player.state !== 'out';
            });
            this.state.haveBigBlind = me.bet == 2 * gameState.small_blind;
            console.log('PRE FLOP');
            var preFlopRating = this.ratePreFlop(gameState);
            if (numberOfPlayers > 3) {
                preFlopRating--;
            }
            if (this.lowBall && numberOfPlayers > 3) {
                preFlopRating--;
            }
            switch (preFlopRating) {
                case 0:
                    if (this.state.haveBigBlind) {
                        console.log('big blind call');
                        if (gameState.current_buy_in - me.bet > 100) {
                            return this.fold(gameState);
                        }
                        return this.call(gameState);
                    } else {
                        console.log('>> check/fold');
                        return this.fold();
                    }
                default:
                    console.log('RAISE with rating', preFlopRating);
                    return this.raise(gameState, preFlopRating);
            }
        } else {
            console.log('POST FLOP');
            var rand = parseInt(Math.random() * 1000);
            if (rand === 0) {
                console.log('ALL IN! :D');
                return this.allIn(gameState);
            } else if (rand < 50) {
                var amount = this.raiseMin(gameState);
                console.log('raise min -> ' + amount);
                return amount;
            } else if (rand < 400) {
                return this.fold(gameState);
            } else {
                if (gameState.current_buy_in - me.bet > 100) {
                    if (this.ratePreFlop(gameState) < 4 && Math.random() * 100 > 5) {
                        return this.fold(gameState);
                    }
                }
                return this.call(gameState);
            }
        }
    },

    raise: function(gameState, factor) {
        var me = gameState.players[gameState.in_action];
        var amount = gameState.current_buy_in - me.bet + gameState.minimum_raise * factor;
        console.log('raise', amount);
        return amount;
    },

    call: function(gameState) {
        var me = gameState.players[gameState.in_action];
        var amount = gameState.current_buy_in - me.bet;
        console.log('call', amount);
        return  amount;
    },

    ratePreFlop: function(gameState) {
        var players = gameState.players;
        var me = players[gameState.in_action];
        var goodCards = ['10', 'J', 'D', 'K', 'A'];

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
        return 200;
    },

    check: function(gameState) {
        console.log('check');
        return 0;
    },

    fold: function(gameState) {
        console.log('fold');
        return 0;
    },

    showdown: function(gameState) {
        console.log('SHOWDOWN');
        this.state = {};
    }
});

module.exports = new Player();
