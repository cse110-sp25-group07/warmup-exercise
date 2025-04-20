const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

// Creates a deck in ascending order A->K, goes spades->diamonds->clubs->hearts
function createDeck() {
  const deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      // note: changed `value` → `rank`
      const card = { rank: values[x], suit: suits[i] };
      deck.push(card);
    }
  }
  return deck;
}

// deck object with all your deck‐management methods
const deck = {
  cards: [],
  discardPile: [],

  reset() {
    this.cards = createDeck();
    this.shuffle();
  },

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const location1 = i;
      const location2 = Math.floor(Math.random() * (i + 1));
      const tmp = this.cards[location1];
      this.cards[location1] = this.cards[location2];
      this.cards[location2] = tmp;
    }
  },

  drawCard(faceUp = true) {
    if (this.cards.length > 0) {
      const card = this.cards.pop();
      card.faceUp = faceUp;
      return card;    // now has .rank and .suit
    }
    return null;
  },

  dealMultipleCards(x, hand) {
    const cardsLeft = this.cards.length;
    if (x <= 0 || x > cardsLeft) return;
    for (let i = 0; i < x; i++) {
      const card = this.drawCard(true);
      if (card) hand.push(card);
    }
  },
};

window.deck = deck;
