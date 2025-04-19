// IMPORTS: Use Card UI Team's <playing-card> for rendering each card face/back
import "./components/playing-card.js"; // provided by Card UI Team (PNG-based, Shadow DOM)

/**
 * REQUIRE: Deck Logic Team must expose card-deck.js with:
 *   - deck.reset(), deck.shuffle(), deck.drawCard(faceUp), deck.drawCards(count, faceUp),
 *     deck.discardCard(card), deck.returnToBottom(card), deck.cards (Array),
 *     deck.discardPile (Array), deck.getState(), deck.setState(state)
 *
 * REQUIRE: Card UI Team must define <playing-card> custom element in playing-card.js
 *
 * REQUIRE: Dealer Logic Team should provide or extend getDealerAction()
 *   - implement advanced strategy
 *   - current modes: brain-dead, random, correct (hit on 17)
 */

class BlackjackGame {
  constructor() {
    // --- UI ELEMENTS (index.html) ---
    this.deck         = document.getElementById("main-deck");      // <card-deck> element
    this.playerHand   = document.getElementById("player-hand");    // container for <playing-card>
    this.dealerHand   = document.getElementById("dealer-hand");
    this.playerScore  = document.getElementById("player-score");   // score display
    this.dealerScore  = document.getElementById("dealer-score");
    this.gameMessage  = document.getElementById("game-message");   // status/tie/bust
    this.playerMoney  = document.getElementById("player-money");   // bankroll display
    this.currentBet   = document.getElementById("current-bet");    // current wager
    this.cardsRemaining = document.getElementById("cards-remaining"); // deck count

    // --- CONTROLS ---
    this.newGameBtn = document.getElementById("new-game-btn");  // UX Team: style via CSS
    this.hitBtn     = document.getElementById("hit-btn");       // disabled until bet placed
    this.standBtn   = document.getElementById("stand-btn");
    this.placeBetBtn= document.getElementById("place-bet-btn");
    this.betAmount  = document.getElementById("bet-amount");    // numeric input
    this.dealerMode = document.getElementById("dealer-mode");  // select options provided by UX/UI Team

    // --- GAME STATE ---
    this.playerCards    = [];
    this.dealerCards    = [];
    this.money          = 1000;  // starting bankroll
    this.bet            = 0;
    this.gameInProgress = false; // UX Team to handle confirm dialogs, animations

    this.initEventListeners();
  }

  /**
   * Attach UI events: New Game, Hit, Stand, Place Bet
   * UX Team can add feedback modals/animations here
   */
  initEventListeners() {
    this.newGameBtn.addEventListener("click", () => this.startNewGame());
    this.hitBtn.addEventListener("click", () => this.playerHit());
    this.standBtn.addEventListener("click", () => this.playerStand());
    this.placeBetBtn.addEventListener("click", () => this.placeBet());
  }

  /**
   * Reset board, shuffle deck, clear hands and messages
   * Deck Logic Team: deck.reset() & deck.shuffle() handle state and animation
   */
  startNewGame() {
    if (this.gameInProgress) {
      // UX Team: modal/confirm styling override possible
      if (!confirm("Start new game? You will lose current progress.")) return;
    }

    this.deck.reset();
    this.deck.shuffle();
    this.playerCards = [];
    this.dealerCards = [];
    this.clearHands();
    this.gameMessage.textContent = "";
    this.updateScores();

    this.hitBtn.disabled = true;
    this.standBtn.disabled = true;
    this.placeBetBtn.disabled = false;
    this.betAmount.disabled = false;
    this.gameInProgress = false;

    this.updateUI();
  }

  /**
   * Player places a bet: validate input, deduct from bankroll, update UI
   * UX Team: invalid input styling or error toast
   */
  placeBet() {
    const betValue = parseInt(this.betAmount.value, 10);
    if (isNaN(betValue) || betValue <= 0 || betValue > this.money) {
      alert("Invalid bet"); // replace with styled error
      return;
    }
    this.bet = betValue;
    this.money -= betValue;
    this.updateUI();

    this.dealInitialCards();
    this.gameInProgress = true;
    this.hitBtn.disabled = false;
    this.standBtn.disabled = false;
    this.placeBetBtn.disabled = true;
    this.betAmount.disabled = true;
  }

  /** Deal two cards each (dealer second card face-down) **/
  dealInitialCards() {
    this.addCardToHand(this.playerCards, this.playerHand, true);
    this.addCardToHand(this.dealerCards, this.dealerHand, false);
    this.addCardToHand(this.playerCards, this.playerHand, true);
    this.addCardToHand(this.dealerCards, this.dealerHand, true);

    this.updateScores();
    this.checkForBlackjack();
  }

  /**
   * Insert card into hand UI & state
   * uses Deck Logic Team’s deck.drawCard(faceUp)
   * uses Card UI Team’s <playing-card>
   */
  addCardToHand(hand, container, faceUp) {
    const card = this.deck.drawCard(faceUp);
    hand.push(card);

    const el = document.createElement("playing-card");
    el.setAttribute("suit", card.suit);
    el.setAttribute("rank", card.rank);
    el.setAttribute("face-up", faceUp);
    container.appendChild(el);
  }

  // --- PLAYER ACTIONS ---
  playerHit() {
    this.addCardToHand(this.playerCards, this.playerHand, true);
    this.updateScores();
    if (this.getHandValue(this.playerCards) > 21) {
      this.endGame("Player busts! Dealer wins.");
    }
  }

  playerStand() {
    this.hitBtn.disabled = true;
    this.standBtn.disabled = true;
    this.dealerPlay();
  }

  /**
   * Dealer turn: reveal hole card, then HIT/STAND based on getDealerAction
   * Dealer Logic Team: customize strategy inside getDealerAction()
   */
  dealerPlay() {
    // Flip down/up card
    this.dealerHand.firstChild.setAttribute("face-up", true);
    this.updateScores();

    const action = this.getDealerAction();
    if (action === "hit") {
      // UX Team: tweak delay/animation timing
      setTimeout(() => {
        this.addCardToHand(this.dealerCards, this.dealerHand, true);
        this.updateScores();
        if (this.getHandValue(this.dealerCards) > 21) {
          this.endGame("Dealer busts! Player wins.");
        } else {
          this.dealerPlay();
        }
      }, 1500); // Default timing: 1500
    } else {
      this.determineWinner();
    }
  }

  /**
   * Dealer Logic Team: implement modes here
   * - brain-dead: always stand
   * - random: 50/50
   * - correct: hit until 17, hit soft 17
   */
  getDealerAction() {
    const mode = this.dealerMode.value;
    const dealerVal = this.getHandValue(this.dealerCards);
    switch (mode) {
      case "brain-dead": return "stand";
      case "random":    return Math.random() < 0.5 ? "hit" : "stand";
      case "correct":   
        if (dealerVal < 17) return "hit";
        // soft 17: treat A as 11 if <=21
        return "stand";
      default: return "stand";
    }
  }

  /** Compare hands and announce winner; update bankroll **/
  determineWinner() {
    const p = this.getHandValue(this.playerCards);
    const d = this.getHandValue(this.dealerCards);
    if (p > d)      this.endGame("Player wins!");
    else if (d > p) this.endGame("Dealer wins!");
    else            this.endGame("It's a tie!");
  }

  /**
   * Check if initial deal was Blackjack
   * uses Card Utils Team's calculateHandValue
   */
  checkForBlackjack() {
    const p = this.getHandValue(this.playerCards);
    const d = this.getHandValue(this.dealerCards);
    if (p === 21 && d === 21) this.endGame("Both have Blackjack! It's a tie!");
    else if (p === 21)        this.endGame("Player has Blackjack! Player wins!");
    else if (d === 21) {      
      this.dealerHand.firstChild.setAttribute("face-up", true);
      this.updateScores();
      this.endGame("Dealer has Blackjack! Dealer wins!");
    }
  }

  /**
   * End-of-game: display message, disable actions, reveal dealer hand,
   * adjust money (Card Utils Team does not handle bankroll)
   */
  endGame(msg) {
    this.gameMessage.textContent = msg;
    this.hitBtn.disabled = true;
    this.standBtn.disabled = true;
    this.gameInProgress = false;

    // Reveal all dealer cards
    Array.from(this.dealerHand.children).forEach(c => c.setAttribute("face-up", true));
    this.updateScores();

    if (msg.includes("Player wins"))      this.money += this.bet * 2;
    else if (msg.includes("tie"))         this.money += this.bet;
    // dealer wins: bet already deducted

    this.bet = 0;
    this.updateUI();
  }

  // --- UTILITIES ---
  getHandValue(hand) {
    return calculateHandValue(hand); // Card Utils Team
  }

  updateScores() {
    this.playerScore.textContent = `(${this.getHandValue(this.playerCards)})`;
    this.dealerScore.textContent = this.dealerCards.every(c => c.faceUp)
      ? `(${this.getHandValue(this.dealerCards)})`
      : "";
  }

  clearHands() {
    this.playerHand.innerHTML = "";
    this.dealerHand.innerHTML = "";
  }

  updateUI() {
    this.playerMoney.textContent    = this.money;
    this.currentBet.textContent     = this.bet;
    this.cardsRemaining.textContent = this.deck.cards.length;
  }
}

/**
 * INLINE IMPLEMENTATION: calculateHandValue
 * - Ace counts as 11 unless it causes bust, then as 1
 * - Face cards = 10
 * - Number cards = their numeric rank
 */
function calculateHandValue(cards) {
    let total = 0;
    let aces  = 0;
    for (const card of cards) {
        if (card.rank === 'A') aces++;
        else if (['K','Q','J'].includes(card.rank)) total += 10;
        else total += parseInt(card.rank, 10);
    }
    for (let i = 0; i < aces; i++) {
        total += (total + 11 <= 21) ? 11 : 1;
    }
    return total;
}

document.addEventListener("DOMContentLoaded", () => new BlackjackGame());
