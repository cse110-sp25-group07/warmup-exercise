# State Flow Diagram
```mermaid
flowchart TD
    A(startNewGame) --> B(placeBet)
    B --> C(dealInitialCards)
    C --> Z(checkForBlackjack)
    C --> D{Player's Turn}
    D -->|playerHit| E(addCardToHand)
    E --> D
    D -->|playerStand| F{Dealer's Turn}
    F --> G(dealerPlay)
    G --> H(getDealerAction)
    H -->|return decision|G
    G -->|dealer return stand| I(determineWinner)
    J --> X(updateScores</br>updateUI)
    I --> J(End Game)
```

# Requires External APIs and Components
- Deck Logic Team needs to provide API (`card-deck.js`): 
     - `deck.reset()`
     - `deck.shuffle()`
     - `deck.drawCard()`
     - `deck.drawCards()`
     - `deck.discardCard()`
     - `deck.cards`
     - `deck.discardPile`
     - `deck.getState()`
     - `deck.setState()`
- Card UI Team needs to provide `<playing-card>` component
- Dealer Logic Team needs to modify `getDealerAction()`
