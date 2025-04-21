// Expose your logic deck globally
window.deck = deck;

/**
 * Convert shorthand ranks to the full names your <playing-card> expects.
 */
function convertRank(r) {
  const map = { A: "ace", J: "jack", Q: "queen", K: "king" };
  return map[r] || r; // leave '2'–'10' as-is
}

/**
 * Create and return a <playing-card> element.
 */
function createCardEl(card) {
  const el = document.createElement("playing-card");
  el.setAttribute("rank", convertRank(card.rank));
  el.setAttribute("suit", card.suit);
  el.setAttribute("face-up", "true");
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  const shuffleBtn = document.getElementById("shuffle-btn");
  const drawBtn    = document.getElementById("draw-btn");
  const countInput = document.getElementById("draw-count");
  const output     = document.getElementById("card-output");

  // initial shuffle
  deck.reset();
  

  shuffleBtn.addEventListener("click", () => {
    deck.reset();
    output.innerHTML = "";
    output.style.display = "none";
  });
  // Draw: pull x amount of cards, create the component, append it
  drawBtn.addEventListener("click", () => {
    const count = parseInt(countInput.value, 10) || 1;
    let drewAny = false;
    for (let i = 0; i < count; i++) {
      const card = deck.drawCard(true);
      if (!card) {
        alert("🛑 Deck is empty!");
        break;
      }
      const cardEl = createCardEl(card);
      output.appendChild(cardEl);
      drewAny = true;
    }

    if (drewAny) {
        output.style.display = "flex";
    }
  });
});
