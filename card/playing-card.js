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
    const faceUp = this.getAttribute('face-up') === 'true';

    const frontImgPath = `PNGCards/${rank}_of_${suit}.png`;
    const backImgPath = `PNGCards/back_card.png`;

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          width: 150px;
          height: 218px;
          perspective: 1000px;
          cursor: pointer;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }

        .card-inner.flip {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background-size: cover;
          background-position: center;
          border-radius: 8px;
        }

        .front {
          background-image: url('${frontImgPath}');
        }

        .back {
          background-image: url('${backImgPath}');
          transform: rotateY(180deg);
        }
      </style>

      <div class="card">
        <div class="card-inner ${faceUp ? '' : 'flip'}">
          <div class="card-face front"></div>
          <div class="card-face back"></div>
        </div>
      </div>
    `;

    // Add click to flip
    const inner = this.shadowRoot.querySelector('.card-inner');
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      inner.classList.toggle('flip');
    });
  }

  
}
customElements.define('playing-card', PlayingCard);