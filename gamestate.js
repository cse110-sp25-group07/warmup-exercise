import { initBalance, processPayout } from "./balance";

// Vars (prolly contained in a class w/ constructor/initializer)
var playerHand;
var playerBalance;
var playerBet;

var dealerHand;
var deck;

// Overall game state //
// User opens the webpage for the first time and presses play from title screen
function startGame() {
	// Initialize decks and hands
	deck = new Deck();
	playerHand = new Hand();
	dealerHand = new Hand();

	// Initialize balance
	initBalance = 1000;

	placeBet();
}

//important these functions from balance.js
import { setBet, isBetValid, deductBet } from "./balance.js";

// Player's screen switches to placing a bet before round starts
function placeBet() {
	//get player's bet input from HTML text field 
	//if tag for element is 'bet-input'
	const input = document.getElementById('bet-input').value;

	//store bet amount 
	setBet(input);

	if(!isBetValid()){
		return; //exit if the bet is not allowed
	}

	deductBet(); //deduct from player's balance

	startRound(); //begin round 
}

// Player's screen switches to playing/table screen
function startRound() {
	playerHand.cards.push(deck.drawCard(2));
	dealerHand.cards.push(deck.drawCard(2));
	// UI setup & animations
	startPlayerTurn();
}

function startPlayerTurn() {
	// enable buttons and whatnot
}

function startDealerTurn() {
	// dealerlogic
}

import { processPayout, isGameOver, getBalance } from "./balance.js";

// The player has either busted (exceeded hand value 21) or stood
function endRound(outcome) {
	processPayout(outcome); //win, lose, draw
	
	playerHand = [];
	dealerHand = [];

	// Player loses if they run out of money
	if (isGameOver()) {
		losePlayer();
	}
	// Player wins if deck is exhausted?
	else if (deck.cardCount() <= 0) {
		winPlayer();
	}
	// Otherwise, place another bet to start another round
	else {
		placeBet();
	}
}

// Game Actions //
function hit(hand) {
	hand.cards.push(deck.drawCard(1));
	if (hand.value() > 21) {
		endRound();
	}
}

function stand(hand) {
	if (hand.owner == player) {
		startDealerTurn();
	}
	else {
		endRound();
	}
}

// Winning & Losing //
function losePlayer() {
	// Lose popup
	// Return to home screen button
}

function winPlayer() {
	// Win popup
	// Return to home screen button
}

function returnToTitleScreen() {
	// UI stuff
}