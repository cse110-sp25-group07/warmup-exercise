var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
//Creates a deck in ascending order A->K, goes spades->diamonds->clubs->hearts
function createDeck()
{
	let deck = new Array();
	for(let i = 0; i < suits.length; i++)
	{
		for(let x = 0; x < values.length; x++)
		{
			let card = {Value: values[x], Suit: suits[i]};
			deck.push(card);
		}
	}
	return deck;
}
//Fisher-Yates Shuffle Technique
function shuffle(deck)
{
	for (let i = (deck.length - 1); i > 0; i--)
	{
		let location1 = i;
		//Generate a random number between 0 and i
		let location2 = Math.floor((Math.random() * (i + 1)));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}
// returns a card if the deck is not empty otherwise just return
function dealCard(deck){
    if(deck.length > 0)
        return deck.pop();
    return;
}

//draws x amount of cards and adds it to the hand passed in
//returns nothing if x is negative, zero, or more than the deckSize
function dealMultipleCards(deck, x, hand){
    var cardsLeftInDeck = deck.length;
    if(x <= 0 || cardsLeftInDeck < x)
        return
    else{
        for(let i = 0; i < x; i++){
            hand.push(dealCard(deck));
        }
    }
}
/*
let tempDeck = createDeck();
shuffle(tempDeck);

for(let i = 0; i < 10; i++){
    //console.log(tempDeck[i].Value + " of " + tempDeck[i].Suit);
    let card = dealCard(tempDeck);
    console.log(card.Value + " of " + card.Suit);
}
*/