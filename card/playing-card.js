/**
 * PlayingCard Class, custom element
 * 
 * This class defines a web component that represents a playing card with:
 * - Front and back faces
 * - Flip animation between faces
 * - Deal-in animation (from a source element to final position)
 * - Discard animation (fade out and slide away)
 * 
 * Usage:
 * <playing-card rank="ace" suit="spades" face-up="true"></playing-card>
 * 
 * Attributes:
 * - rank: The card rank (ace, 2-10, jack, queen, king)
 * - suit: The card suit (clubs, diamonds, hearts, spades)
 * - face-up: Whether the card shows its face (true) or back (false)
 * 
 * Methods:
 * - dealIn(sourceElement): Animates the card appearing from a source element
 * - discard(): Animates the card being discarded (sliding away and fading out)
 */

class PlayingCard extends HTMLElement {
  static get observedAttributes() { return ['face-up'];}

  attributeChangedCallback() {
    this.render();
  }
  // Setting up Shadow DOM and render when added to the page
  constructor() {
      super();
      // I am choosing to use Shadow DOM so that the styles and structure of this component are isolated.
      // This means our <playing-card> will look the same no matter where it's used,
      // and won't be affected by (or accidentally affect) styles from the rest of the app.  
      // This in some sense makes the playing-card.css file useless.
      this.attachShadow({ mode: 'open' });
      
      this.shadowRoot.addEventListener('click', e => {
        const inner = this.shadowRoot.querySelector('.card-inner');
        inner.classList.toggle('flip');
      });
  }

  // This function runs when the component is added to the page
  connectedCallback() {
      this.render();
  }

  /**
   * This contains all the HTML structure, CSS styling, and interactive methods
   */
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
          will-change: transform, opacity;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
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

    /**
     * Animates the card dealing from a source element to its final position
     * 
     * @param {HTMLElement} fromEl - The element to animate from (in our case, the deck)
     */
    this.dealIn = (fromEl) => {
      const card  = this.shadowRoot.querySelector('.card');
      
      // Calculating the distance between source and destination positions
      const cRect = card.getBoundingClientRect();
      const fRect = fromEl.getBoundingClientRect();
      const dx    = fRect.left - cRect.left;
      const dy    = fRect.top  - cRect.top;

      // Set the initial position (at source)
      card.style.transform = `translate(${dx}px,${dy}px) scale(.6)`;
      card.style.opacity   = 0;

      card.getBoundingClientRect();            // force reflow    

      card.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0 },
        { transform: `translate(${dx/2}px, ${dy/2}px) scale(1.1)`, opacity: 1 },
        { transform: 'translate(0,0)           scale(1)',   opacity: 1 }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        fill: 'forwards'
      }).finished.then(() => {
        card.style.transform = '';
        card.style.opacity   = '1';
      });
    };

    this.discard = () => {
      const card = this.shadowRoot.querySelector('.card');
      
      // Use the Web Animation API for the discard animation
      card.animate([
        // Starting state
        { opacity: 1, transform: 'translateY(0) scale(1) rotateZ(0)' },
        // Ending state
        { opacity: 0, transform: 'translateY(40px) scale(0.7) rotateZ(6deg)' }
      ], {
        duration: 250,
        easing: 'ease-in',
        fill: 'forwards'
      });
      
      return card;
    };
  }

  
}
customElements.define('playing-card', PlayingCard);