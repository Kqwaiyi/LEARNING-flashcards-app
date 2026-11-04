/*========================================
-- IMPORTS
=========================================*/
import * as datastore from "./state.js";

/*========================================
-- DECLARING VARIABLES
=========================================*/
const mainScreen = document.querySelector(".main-screen");
const DIV_navBarDecks = document.querySelector(".sidebar-decks-panel");

let selectedSidebarDeck = null;

/*========================================
-- PAGES
=========================================*/
export function homePage() {
  const totalCards = datastore.getTotalCards();
  const totalDecks = datastore.getTotalDecks();
  const decks = datastore.getData();
  let decksHTML = ``;

  function reRender() {
    homePage();
    navBar();
  }

  function onDelete(id) {
    datastore.deleteDeckWithId(id);
    reRender();
  }

  // Building the decks
  decks.forEach((elem) => {
    const score = Math.min(100, Math.max(0, Number(elem.bestScore) || 0));
    decksHTML += `
      <div class="homepage-decks-deckitems">
        <div class="homepage-decks-deckitems-icons">
          <img
            src="assets/decks.svg"
            class="icons-decks js-deck-icons-decks"
          />
          <img src="assets/edit.svg" class="icons-edit js-deck-icons-edit" />
          <img
            src="assets/delete.svg"
            class="icons-delete js-deck-icons-delete"
            data-deck-id="${elem.id}"
          />
        </div>
        <h1>${elem.name}</h1>
        <p>${elem.cards.length} Cards</p>

        <div class="homepage-decks-deckitems-progress">
          <div class="homepage-decks-deckitems-progress-texts">
            <p>Best Score</p>
            <p class="homepage-decks-deckitems-progress-texts-progress">
              ${score}%
            </p>
          </div>
          <div class="homepage-decks-deckitems-progress-graybar">
            <div class="homepage-decks-deckitems-progress-bar" style="width: ${score}%"></div>
          </div>
        </div>
      </div>
    `;
  });
  // Inserting it to the page
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
        <input type="text" placeholder="e.g. Mathematics" id="homepage-newdeck-input" maxlength="40" minlength="1"/>
        <p class="homepage-newdeck-panel-main-description">
          1-40 characters. must be unique name
        </p>
      </div>
      <button class="homepage-newdeck-panel-cancelbtn js-homepage-cancel-button">Cancel</button>
      <button class="homepage-newdeck-panel-createbtn js-homepage-create-button">Create Deck</button>
    </div>
    <!--Decks starts here-->
    <div class="homepage-decks">
      ${decksHTML}
    </div>
  `;

  // Event listeners
  const deleteButtons = document.querySelectorAll(".js-deck-icons-delete");
  const newdeckInput = document.getElementById("homepage-newdeck-input");
  const createButton = document.querySelector(".js-homepage-create-button");
  const cancelButton = document.querySelector(".js-homepage-cancel-button");

  deleteButtons.forEach((delbtn) => {
    delbtn.addEventListener("click", () => {
      const deckId = delbtn.dataset.deckId;
      console.log(deckId);
      onDelete(deckId);
    });
  });

  cancelButton.addEventListener("click", () => {
    newdeckInput.value = "";
  });

  createButton.addEventListener("click", () => {
    datastore.createDeck(newdeckInput.value);
    reRender();
  });
}

export function blankPage() {
  mainScreen.innerHTML = "";
}

export function navBar() {
  const decks = datastore.getData();
  let navBarHTML = ``;

  decks.forEach((elem) => {
    const selectedClass = elem.id === selectedSidebarDeck ? "selected" : "";
    navBarHTML += `
      <div class="sidebar-items ${selectedClass}" data-deck-id="${elem.id}" >
        <img src="assets/decks.svg" alt="decks icon" />
        <p>${elem.name}</p>
      </div>
    `;
  });

  DIV_navBarDecks.innerHTML = navBarHTML;
}

export function setSelectedDeck(id) {
  selectedSidebarDeck = id;
}
