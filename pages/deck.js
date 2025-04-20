/*TODO think to manage the players we just have 2 arrays: one for the player and one for the dealer
    Trying to have deck use the assets createad in playing-card.js but its not working
    Gonna create a start of game that temp works but will need to be changed
*/
//import the card class from playing-cards.js
import {Card} from "./card/playing-card.js"

export class Deck{
    constructor(){
        this.cards = new Array();
        this.createDeck();
    }

    get deckSize(){
        return this.cards.length;
    }
    //Creates a deck in ascending order A->K, goes spades->diamonds->clubs->hearts
    createDeck(){
        const suits = ["spades", "diamonds", "clubs", "hearts"];
        const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
        for(let i = 0; i < suits.length; i++)
        {
            for(let x = 0; x < values.length; x++)
            {
                deck.push(new Card(rank, suit));
            }
        }
        return deck;
    }
    //Fisher-Yates Shuffle Technique
    shuffle(){
        for (let i = (this.deckSize - 1); i > 0; i--)
        {
            let location1 = i;
            //Generate a random number between 0 and deckLength
            let location2 = Math.floor((Math.random() * (i + 1)));
            let tmp = this.cards[location1];
            this.cards[location1] = this.cards[location2];
            this.cards[location2] = tmp;
        }
    }
    // returns a card if the deck is not empty otherwise just return
    dealCard(){
        if(this.deckSize > 0)
            return this.cards.pop();
        return;
    }

    //draws x amount of cards and adds it to the hand passed in
    //returns nothing if x is negative, zero, or more than the deckSize
    //assumes x is a int and hand is an array
    dealMultipleCards(x, hand){
        if(x <= 0 || this.deckSize < x)
            return;
        else{
            for(let i = 0; i < x; i++){
                hand.push(dealCard());
            }
        }
    }
}

let player = new Array();
let dealer = new Array();
//Deals 2 cards to the dealer and 2 cards to the player
//Both of the dealers cards should be visible
//One of the players cards should be visibile and the other is turned over
//TODO add so one of these cards is turned over
function startOfGame(){
    dealer.dealCard();
    player.dealCard();
    dealer.dealCard();
    player.dealCard();
}