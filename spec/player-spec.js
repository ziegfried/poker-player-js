var player = require('../player.js');


describe('player', function() {

   var game_state_mock = {
    "small_blind": 10,                              // The small blind in the current round. The big blind is twice the
                                                    //     small blind

    "current_buy_in": 320,                          // The amount of the largest current bet from any one player

    "pot": 400,                                     // The size of the pot (sum of the player bets)

    "minimum_raise": 240,                           // Minimum raise amount. To raise you have to return at least:
                                                    //     current_buy_in - players[in_action][bet] + minimum_raise

    "dealer": 1,                                    // The index of the player on the dealer button in this round
                                                    //     The first player is (dealer+1)%(players.length)

    "orbits": 7,                                    // Number of orbits completed. (The number of times the dealer
                                                    //     button returned to the same player.)

    "in_action": 1,                                 // The index of your player, in the players array

    "players": [                                    // An array of the players. The order stays the same during the
        {                                           //     entire tournament

            "id": 0,                                // Id of the player (same as the index)

            "name": "Albert",                       // Name specified in the tournament config

            "status": "active",                     // Status of the player:
                                                    //   - active: the player can make bets, and win the current pot
                                                    //   - folded: the player folded, and gave up interest in
                                                    //       the current pot. They can return in the next round.
                                                    //   - out: the player lost all chips, and is out of this sit'n'go

            "version": "Default random player",     // Version identifier returned by the player

            "stack": 1010,                          // Amount of chips still available for the player. (Not including
                                                    //     the chips the player bet in this round.)

            "bet": 320                              // The amount of chips the player put into the pot
        },
        {
            "id": 1,                                // Your own player looks similar, with one extension.
            "name": "Bob",
            "status": "active",
            "version": "Default random player",
            "stack": 1590,
            "bet": 80,
            "hole_cards": [                         // The cards of the player. This is only visible for your own player
                                                    //     except after showdown, when cards revealed are also included.
                {
                    "rank": "6",                    // Rank of the card. Possible values are numbers 2-10 and J,Q,K,A
                    "suit": "hearts"                // Suit of the card. Possible values are: clubs,spades,hearts,diamonds
                },
                {
                    "rank": "K",
                    "suit": "spades"
                }
            ]
        },
        {
            "id": 2,
            "name": "Chuck",
            "status": "out",
            "version": "Default random player",
            "stack": 0,
            "bet": 0
        }
    ],
    "community_cards": [                            // Finally the array of community cards.
        {
            "rank": "4",
            "suit": "spades"
        },
        {
            "rank": "A",
            "suit": "hearts"
        },
        {
            "rank": "6",
            "suit": "clubs"
        }
    ]
};

   function buildMockWithCards(cards) {
      var obj = JSON.parse(JSON.stringify(game_state_mock));
      obj.players[obj.in_action]["hole_cards"] = cards;
      return obj;
   };


   describe('bet_request', function() {
      it('should return 0 by default', function() {
         expect(player.bet_request()).toBe(0);
      });


   });

   describe('raise', function() {

      it('should return min-raise multiplied by multiplier', function() {
         var min_raise = game_state_mock.minimum_raise;
         var multiplier = 3;
         var bet = game_state_mock.players[game_state_mock.in_action].bet;
         var buyin = game_state_mock.current_buy_in;

         expect(player.raise(game_state_mock, 3)).toBe(buyin - bet + min_raise * multiplier);
      });


   });

   describe('ratePreFlop', function() {

      it('should return a rating of 3 for a high card pair', function() {
         var mock = buildMockWithCards([
            { "rank": "D", "suit": "hearts" },
            { "rank": "D", "suit": "spades" }
         ]);
         expect(player.ratePreFlop(mock)).toBe(3);
      });

      it('should return a rating of 2 for suited high cards', function() {
         var obj = buildMockWithCards([
            { "rank": "D", "suit": "hearts" },
            { "rank": "J", "suit": "hearts" }
         ]);
         expect(player.ratePreFlop(obj)).toBe(2);
      });

      it('should return a rating of 1 for suited low cards', function() {
         var obj = buildMockWithCards([
            { "rank": "2", "suit": "hearts" },
            { "rank": "3", "suit": "hearts" }
         ]);
         expect(player.ratePreFlop(obj)).toBe(1);
      });

      it('should return a rating of 1 for two high cards', function() {
         var obj = buildMockWithCards([
            { "rank": "J", "suit": "hearts" },
            { "rank": "D", "suit": "spades" }
         ]);
         expect(player.ratePreFlop(obj)).toBe(1);
      });

   });

});