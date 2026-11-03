/*========================================
-- IMPORTS
=========================================*/
import * as datastore from "./state.js";

/*========================================
-- DECLARING VARIABLES
=========================================*/
const mainScreen = document.querySelector(".main-screen");

/*========================================
-- PAGES
=========================================*/
export function homePage() {
  const totalCards = datastore.getTotalCards();
  const totalDecks = datastore.getTotalDecks();
  const decks = datastore.getData();

  let decksHTML = ``;
  decks.forEach((elem) => {
    decksHTML += `
      <div class="homepage-decks-deckitems">
        <div class="homepage-decks-deckitems-icons">
          <img
            src="assets/decks.svg"
            class="icons-decks js-deck-icons-decks"
          />
          <img src="assets/edit.svg" class="icons-edit js-deck-edit-delete" />
          <img
            src="assets/delete.svg"
            class="icons-delete js-deck-icons-delete"
          />
        </div>
        <h1>${elem.name}</h1>
        <p>${elem.cards.length} Cards</p>

        <div class="homepage-decks-deckitems-progress">
          <div class="homepage-decks-deckitems-progress-texts">
            <p>Best Score</p>
            <p class="homepage-decks-deckitems-progress-texts-progress">
              ${elem.bestScore || 0}%
            </p>
          </div>
          <div class="homepage-decks-deckitems-progress-graybar">
            <div class="homepage-decks-deckitems-progress-bar"></div>
          </div>
        </div>
      </div>
    `;
  });
  mainScreen.innerHTML = `
    <div class="homepage-topbar">
      <div>
        <h1>My Decks</h1>
        <p>Open one to add cards or study it</p>
      </div>
      <div class="homepage-topbar-stats">
        <p>Your Stats:</p>
        <li>${totalDecks} Decks</li>
        <li>${totalCards} Cards</li>
      </div>
    </div>
    <div class="homepage-newdeck-panel">
      <div class="homepage-newdeck-panel-main">
        <p class="homepage-newdeck-panel-main-name">New Deck Name</p>
        <input type="text" placeholder="e.g. Mathematics" />
        <p class="homepage-newdeck-panel-main-description">
          1-40 characters. must be unique name
        </p>
      </div>
      <button class="homepage-newdeck-panel-cancelbtn">Cancel</button>
      <button class="homepage-newdeck-panel-createbtn">Create Deck</button>
    </div>
    <!--Decks starts here-->
    <div class="homepage-decks">
      ${decksHTML}
    </div>
  `;
}

export function blankPage() {
  mainScreen.innerHTML = "";
}
