export default decideAction;

/**
Usage:

// Player example: defined based on input from UI
decideAction(player.handValue, {
  decideFn: () => [some UI component returning what the user clicked (returns bool)] ? "hit" : "stand"
});

// Dealer example: fixed (>= 17 stand, < 17 hit)
decideAction(dealer.handValue, {
  minStand: 17
});
 */

/**
* @param {number} handValue     // value of the player's hand (computed independently)
* @param {{
*  minStand?: number,           // dealer threshold (blank for player)
*  decideFn?: ()=>"hit"|"stand" // player callback (blank for dealer)
* }} options
* @returns {"hit"|"stand"}      // action to take
*/
function decideAction(handValue, options = {}) {
    if (options.decideFn) {
        return options.decideFn();
    }
    const threshold = options.minStand ?? 17; // sets default to 17 (dealer threshold)
    return handValue < threshold ? 'hit' : 'stand';
}

/* Test */
function main() {
    const player = {
        handValue: 15,
        hand: [],
    };

    const dealer = {
        handValue: 18,
        hand: [],
    };

    function promptPlayer() {
        const decision = Math.random() > 0.5 ? "hit" : "stand";
        console.log(`Player decided to: ${decision}`);
        return decision;
    }

    console.log(`Player action: ${decideAction(player.handValue, { decideFn: promptPlayer })}`);
    console.log(`Dealer action: ${decideAction(dealer.handValue, { minStand: 17 })}`);
}

main();