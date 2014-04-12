module.exports = {

    VERSION: "Default JavaScript folding player",

    bet_request: function(game_state) {
        var players = game_state.players;
        var current_buy_in = game_state.current_buy_in;
        
        switch (parseInt(Math.random() * 10)) {
            case 0:
                return this.allIn(game_state);
            case 1:
                return this.raiseMin(game_state);
            case 2:
                return this.fold(game_state);
            default:
                return this.check(game_state);
        }
    },
    
    raiseMin: function(game_state){
        var me = game_state.players[game_state.in_action]; 
        return game_state.current_buy_in - me.bet + game_state.minimum_raise;
    },


    allIn: function(game_state){
        return game_state.players[game_state.in_action].stack;
    },

    check: function(game_state){
        return 0;
    },
    
    fold: function(game_state){
        return 0;
    },
    
    showdown: function(game_state) {

    }
};
