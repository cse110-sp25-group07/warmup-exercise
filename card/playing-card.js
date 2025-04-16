class PlayingCard extends HTMLElement {
    // Setting up Shadow DOM and render when added to the page
    constructor() {
        super();
        // I am choosing to use Shadow DOM so that the styles and structure of this component are isolated.
        // This means our <playing-card> will look the same no matter where it's used,
        // and won't be affected by (or accidentally affect) styles from the rest of the app.  
        // This in some sense makes the playing-card.css file useless.
        this.attachShadow({ mode: 'open' });
    }

    // This function runs when the component is added to the page
    connectedCallback() {
        this.render();
    }

    // For now, we are just going to render once, not worry about updating.
    render() {
        const rank = this.getAttribute('rank');
        const suit = this.getAttribute('suit');
        const faceUp = this.getAttribute('face-up') === 'true'; // "true" string -> boolean

        // Building path to image 
        const frontImgPath = `PNGCards/${rank}_of_${suit}.png`;
        const backImgPath = `PNGCards/back_card.png`;

        const imgPath = faceUp ? frontImgPath : backImgPath;

        this.shadowRoot.innerHTML = `
        <style>
          .card {
            display: flex;
            justify-content: center;
            align-items: center;
            background: none;
            box-shadow: none;
            padding: 0;
            margin: 0;
            border-radius: 0;
            overflow: visible;
            }
  
          .card img {
            max-width: 150px;
            height: auto;
            display: block;
            }
          }
        </style>
  
        <div class="card">
                <img src="${imgPath}" alt="${faceUp ? rank + ' of ' + suit : 'card back'}">
        </div>
        `;
    }

    
}
customElements.define('playing-card', PlayingCard);