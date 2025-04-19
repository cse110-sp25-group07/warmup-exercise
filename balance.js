//balance.js
//manages player balance, betting logic, and the money UI updates 

//initial amount player has
let playerBalance = 1000;

//var for curr bet placed by player
let playerBet = 0;

/**initializes player's balance at start 
*@param {int} amount = the starting balance (default is 1000)
*/
function initBalance(amount = 1000) {
    playerBalance = amount;
}

/**sets current bet amount based on the user input
 * @param {string} amount = amount entered by player
 */
function setBet(amount) {
    playerBet = parseInt(amount);
}

/**
 * checks to see if bet is > 0 && <= current balance
 * @returns - boolean if bet is valid
 */
function isBetValid(){
    if (playerBet > 0){
        if(playerBet < playerBalance){
            return true;
        }
    }
    return false;
}


/**
 * deducts bet amount from the balance at the start of a round
 */
function deductBet(){
    playerBalance -= playerBet;
    updateBalanceDisplay();
}

/**
 * updates player's balance based on outcome of the round
 * @param {'win', 'draw', 'lose'} outcome - result of round 
 * win: gets 2 times their bet 
 * draw: gets their bet back
 * lose: no money added (bet is alr deducted)
 */
function processPayout(outcome){
    if(outcome == 'win') {
        playerBalance += playerBet * 2;
    } else if (outcome == 'draw') {
        playerBalance += playerBet;
    }
    updateBalanceDisplay();
}

/**
 * updates display of player's balance 
 * if there is an element with id='money' in HTML
 */
function updateBalanceDisplay() {
    // gets element 
    // if 'money' is the ID of the HTML element 
    const moneyDisplay = document.getElementById('money');

    //if elem actually exists, update Balance text
    if(moneyDisplay) {
        moneyDisplay.textContent = 'Balance: $${playerBalance}';
    }
}

/**
 * returns curr balance
 * @returns number
 */
function getBalance(){
    return playerBalance;
}

/**
 * checks player's balance to determine if game is over or not
 * @returns boolean 
 */
function isGameOver(){
    if (playerBalance <= 0){
        return true;
    } else {
        return false;
    }
}

//export these functions for other files
export {
    initBalance,
    setBet,
    isBetValid,
    deductBet,
    processPayout,
    updateBalanceDisplay,
    getBalance,
    isGameOver
};
