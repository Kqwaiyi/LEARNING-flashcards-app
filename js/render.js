/*========================================
-- IMPORTS
=========================================*/
import * as datastore from "./state.js";
import { sidebarClearSelected, sidebarClicked } from "./main.js";
import { getQuestions } from "./api.js";

/*========================================
-- DECLARING VARIABLES
=========================================*/
const mainScreen = document.querySelector(".main-screen");
const DIV_navBarDecks = document.querySelector(".sidebar-decks-panel");

let selectedSidebarDeck = null;

/*========================================
-- HELPER FUNCTIONS
=========================================*/
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/*========================================
-- PAGES
=========================================*/
export function homePage() {
  const totalCards = datastore.getTotalCards();
  const totalDecks = datastore.getTotalDecks();
  const decks = datastore.getData();
  let decksHTML = ``;

  // helper functions
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
    const score = Math.round(
      Math.min(100, Math.max(0, Number(elem.bestScore) || 0)),
    );
    decksHTML += `
      <div class="homepage-decks-deckitems">
        <div class="homepage-decks-deckitems-icons">
          <img
            src="assets/decks.svg"
            class="icons-decks js-deck-icons-decks"
          />
          <img src="assets/edit.svg" class="icons-edit js-deck-icons-edit" data-deck-id="${elem.id}"/>
          <img
            src="assets/delete.svg"
            class="icons-delete js-deck-icons-delete"
            data-deck-id="${elem.id}"
          />
        </div>
        <h1>${escapeHtml(elem.name)}</h1>
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
  const editButtons = document.querySelectorAll(".js-deck-icons-edit");
  const newdeckInput = document.getElementById("homepage-newdeck-input");
  const createButton = document.querySelector(".js-homepage-create-button");
  const cancelButton = document.querySelector(".js-homepage-cancel-button");

  deleteButtons.forEach((delbtn) => {
    delbtn.addEventListener("click", () => {
      const deckId = delbtn.dataset.deckId;
      onDelete(deckId);
    });
  });

  editButtons.forEach((editbtn) => {
    editbtn.addEventListener("click", () => {
      const deckId = editbtn.dataset.deckId;
      const sidebarItem = document.querySelector(
        `.sidebar-items[data-deck-id="${deckId}"]`,
      );
      sidebarClearSelected();
      setSelectedDeck(deckId);
      sidebarItem.classList.add("selected");
      deckPage(deckId);
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

////////////////////////////////////////////////////////////////////////////////
export function navBar() {
  const decks = datastore.getData();
  let navBarHTML = ``;

  decks.forEach((elem) => {
    const selectedClass = elem.id === selectedSidebarDeck ? "selected" : "";
    navBarHTML += `
      <div class="sidebar-items ${selectedClass}" data-deck-id="${elem.id}" >
        <img src="assets/decks.svg" alt="decks icon" />
        <p>${escapeHtml(elem.name)}</p>
      </div>
    `;
  });

  DIV_navBarDecks.innerHTML = navBarHTML;
}

export function setSelectedDeck(id) {
  selectedSidebarDeck = id;
}

////////////////////////////////////////////////////////////////////////////////
export function deckPage(id) {
  const deck = datastore.getDeckWithId(id);
  if (!deck) return;

  let currentlyEditing = null;
  let deckItemsHTML = ``;

  // changes the card panel to an edit display
  function editCard(cardId) {
    if (currentlyEditing === cardId) return;
    if (currentlyEditing) {
      _cancelEdit(currentlyEditing);
    }

    currentlyEditing = cardId;
    const selectedNow = document.querySelector(
      `.deckpage-main-cardpanel-items[data-card-id="${currentlyEditing}"]`,
    );
    selectedNow.innerHTML = `
      <form id="edit-card-form">
        <label>Editing</label>
        <textarea required minlength="1" maxlength="150" class="edit-card-question"></textarea>
        <textarea required minlength="1" maxlength="150" class="edit-card-answer"></textarea>
      </form>
      <div class="edit-card-form-buttons">
        <button class="edit-card-form-cancel" data-card-id="${currentlyEditing}">Cancel</button>
        <button
          type="submit"
          form="edit-card-form"
          class="edit-card-form-submit"
        >
          Submit
        </button>
      </div>
    `;
    const currentCardData = datastore.getCardWithId(id, cardId);
    const form = document.getElementById("edit-card-form");
    const questionArea = form.querySelector(".edit-card-question");
    const answerArea = form.querySelector(".edit-card-answer");
    const cancelBtn = document.querySelector(".edit-card-form-cancel");

    questionArea.value = currentCardData.front;
    answerArea.value = currentCardData.back;

    cancelBtn.addEventListener("click", () => {
      _cancelEdit(cancelBtn.dataset.cardId);
      currentlyEditing = null;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      const editedQuestion = form
        .querySelector(".edit-card-question")
        .value.trim();
      const editedAnswer = form.querySelector(".edit-card-answer").value.trim();

      if (editedQuestion === "" || editedAnswer == "") {
        isValid = false;
      }

      if (editedQuestion.length < 1 || editedQuestion.length > 150) {
        isValid = false;
      }
      if (editedAnswer.length < 1 || editedAnswer.length > 150) {
        isValid = false;
      }

      if (!isValid) return;

      const resp = datastore.updateCardWithId(
        id,
        cardId,
        editedQuestion,
        editedAnswer,
      );
      if (resp === 200) {
        _cancelEdit(cardId);
        currentlyEditing = null;
      }
    });
  }

  function _cancelEdit(idToCancel) {
    const selected = document.querySelector(
      `.deckpage-main-cardpanel-items[data-card-id="${idToCancel}"]`,
    );
    if (!selected) return;

    const data = datastore.getCardWithId(id, idToCancel);
    if (!data) {
      console.error("ouu shi");
      return;
    }

    console.log(data);
    selected.innerHTML = `
      <div>
        <p class="question-title">${escapeHtml(data.front)}</p>
        <p>${escapeHtml(data.back)}</p>
      </div>
      <div class="card-controls">
        <img src="assets/edit.svg" data-card-id="${idToCancel}" class="js-edit-card"/>
        <img src="assets/delete.svg" data-card-id="${idToCancel}" class="js-delete-card"/>
      </div>
    `;
  }

  deck.cards.forEach((elem) => {
    deckItemsHTML += `
      <div class="deckpage-main-cardpanel-items" data-card-id="${elem.id}">
        <div>
          <p class="question-title">${escapeHtml(elem.front)}</p>
          <p>${escapeHtml(elem.back)}</p>
        </div>
        <div class="card-controls">
          <img src="assets/edit.svg" data-card-id="${elem.id}" class="js-edit-card"/>
          <img src="assets/delete.svg" data-card-id="${elem.id}" class="js-delete-card"/>
        </div>
      </div>
    `;
  });

  let deckPageHTML = `
    <div class="deckpage-topbar">
      <div>
        <p class="deckpage-topbar-textback">Back to all cards</p>
        <h1>${escapeHtml(deck.name)}</h1>
        <p>${deck.cards.length} Cards. Best Score: ${Math.round(deck.bestScore || 0)}%</p>      </div>
      <div class="deckpage-topbar-button-div">
        <button class="deckpage-topbar-button" id="import-button">Import</button>
        <button
          class="deckpage-topbar-button js-deckpage-study-button"
          ${deck.cards.length === 0 ? "disabled" : ""}
        >Study ${deck.cards.length === 0 ? "(disabled)" : ""}</button>
      </div>
    </div>
    <div class="deckpage-main">
      <form class="deckpage-main-addpanel" novalidate>
        <h1>Add a Card</h1>
        <div class="deckpage-input-group">
          <label for="question-input" class="deckpage-input-label"
            >Front (Question)</label
          >
          <textarea required maxlength="150" id="question-input"></textarea>
          <div class="deckpage-bottom-label">
            <div class="error-message" id="question-error"></div>
            <div class="char-count" id="question-count">0/150</div>
          </div>
        </div>

        <div class="deckpage-input-group">
          <label for="answer-input" class="deckpage-input-label"
            >Back (Answer)</label
          >
          <textarea required maxlength="150" id="answer-input"></textarea>
          <div class="deckpage-bottom-label">
            <div class="error-message" id="answer-error"></div>
            <div class="char-count" id="answer-count">0/150</div>
          </div>
        </div>
        <button type="submit" class="submit-button">Submit</button>
      </form>
      <div class="deckpage-main-cardpanel">${deckItemsHTML}</div>
    </div>
  `;
  mainScreen.innerHTML = deckPageHTML;

  // Event listeners
  const form = document.querySelector(".deckpage-main-addpanel");
  const questionInput = document.getElementById("question-input");
  const answerInput = document.getElementById("answer-input");
  const questionError = document.getElementById("question-error");
  const answerError = document.getElementById("answer-error");
  const questionCount = document.getElementById("question-count");
  const answerCount = document.getElementById("answer-count");
  const cardPanel = document.querySelector(".deckpage-main-cardpanel");
  const importButton = document.getElementById("import-button");
  const studyButton = document.querySelector(".js-deckpage-study-button");
  const backButton = document.querySelector(".deckpage-topbar-textback");

  studyButton.addEventListener("click", () => {
    studyPage(id);
  });

  backButton.addEventListener("click", () => {
    sidebarClicked("home");
  });

  importButton.addEventListener("click", async () => {
    importButton.disabled = true;
    importButton.innerHTML = "Loading...";

    const resp = await getQuestions(5);

    if (resp.error) {
      console.error(resp.error);
      importButton.disabled = false;
      importButton.innerHTML = "Import";
      return;
    }

    const count = datastore.importCardsToDeck(id, resp.questions);

    if (importButton.isConnected) {
      deckPage(id);
    }
  });

  cardPanel.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".js-edit-card");
    const deleteBtn = e.target.closest(".js-delete-card");

    if (editBtn) editCard(editBtn.dataset.cardId);

    if (deleteBtn) {
      const resp = datastore.deleteCardWithId(id, deleteBtn.dataset.cardId);
      if (resp === 200) deckPage(id);
    }
  });

  questionInput.addEventListener("input", () => {
    questionError.innerHTML = "";
    questionCount.innerHTML = `${questionInput.value.length}/150`;
  });

  answerInput.addEventListener("input", () => {
    answerError.innerHTML = "";
    answerCount.innerHTML = `${answerInput.value.length}/150`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (questionInput.value.trim() === "") {
      isValid = false;
      questionError.innerHTML = "Can't be empty!";
    }

    if (answerInput.value.trim() === "") {
      isValid = false;
      answerError.innerHTML = "Can't be empty!";
    }
    if (!isValid) return;
    const resp = datastore.createCard(
      id,
      questionInput.value,
      answerInput.value,
    );

    if (resp) {
      deckPage(id);
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
export function blankPage() {
  mainScreen.innerHTML = "";
}

////////////////////////////////////////////////////////////////////////////////
export function studyPage(id) {
  const deck = datastore.getDeckWithId(id);
  if (!deck) return;
  const cards = deck.cards;
  if (cards.length === 0) {
    return;
  }

  mainScreen.innerHTML = `<div class="studypage-main"></div>`;
  const studyMain = mainScreen.querySelector(".studypage-main");

  let cardOrder = shuffle([...Array(cards.length).keys()]);
  let countGotIt = 0;
  let countMissed = 0;
  let currentCard = null;
  let flipped = false;

  // Helper functions
  function endCard() {
    currentCard = null;
    const newScore = Math.round((countGotIt / cards.length) * 100);
    datastore.updateDeckBestScore(id, newScore);

    const mainHTML = `
      <div class="studypage-topbar">
        <div class="back-text js-studypage-back-text">Back to ${escapeHtml(deck.name)}</div>
        <div class="stats">
          <p class="gotit-text">Got It: ${countGotIt}</p>
          <p class="missed-text">Missed: ${countMissed}</p>
        </div>
      </div>
      <div class="studypage-maincard">
        <p class="studypage-type-text">FINISHED</p>
        <h1 class="studypage-main-text">Score: ${countGotIt}/${cards.length} Correct</h1>
        <p class="studypage-hint-text">finished!</p>
      </div>
    `;
    studyMain.innerHTML = mainHTML;
  }

  function nextCard() {
    if (cardOrder.length === 0) {
      endCard();
      return;
    }
    const curIndexSelected = cardOrder.pop();
    const curSelected = cards[curIndexSelected];
    currentCard = curSelected;
    flipped = false;
    const percentageDone =
      ((cards.length - cardOrder.length) / cards.length) * 100;

    const mainHTML = `
      <div class="studypage-topbar">
        <div class="back-text js-studypage-back-text">Back to ${escapeHtml(deck.name)}</div>
        <div class="stats">
          <p class="gotit-text">Got It: ${countGotIt}</p>
          <p class="missed-text">Missed: ${countMissed}</p>
        </div>
      </div>
      <div class="studypage-progressbar">
        <div class="progressbar-texts">
          <p class="progressbar-title">${escapeHtml(deck.name)}</p>
          <p class="progressbar-cardcount">Card ${cards.length - cardOrder.length} out of ${cards.length}</p>
        </div>
        <div class="progressbar-bar">
          <div class="progressbar-fill" style="width: ${percentageDone}%"></div>
        </div>
      </div>
      <div class="studypage-maincard">
        <p class="studypage-type-text">QUESTION</p>
        <h1 class="studypage-main-text">${escapeHtml(curSelected.front)}</h1>
        <p class="studypage-hint-text">click the card to flip</p>
      </div>
      <div class="studypage-controls">
        <button id="studypage-missed">Missed</button>
        <button id="studypage-shuffle">Shuffle</button>
        <button id="studypage-gotit">Got It</button>
      </div>
    `;
    studyMain.innerHTML = mainHTML;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Event Listeners
  studyMain.addEventListener("click", (e) => {
    const backButton = e.target.closest(".js-studypage-back-text");
    if (backButton) {
      deckPage(id);
    }

    const shuffleButton = e.target.closest("#studypage-shuffle");
    if (shuffleButton) {
      shuffle(cardOrder);
    }

    const missedButton = e.target.closest("#studypage-missed");
    if (missedButton) {
      countMissed += 1;
      nextCard();
    }

    const gotitButton = e.target.closest("#studypage-gotit");
    if (gotitButton) {
      countGotIt += 1;
      nextCard();
    }

    const mainCard = e.target.closest(".studypage-maincard");
    if (mainCard && currentCard) {
      flipped = !flipped;
      mainCard.querySelector(".studypage-type-text").textContent = flipped
        ? "ANSWER"
        : "QUESTION";
      mainCard.querySelector(".studypage-main-text").textContent = flipped
        ? currentCard.back
        : currentCard.front;
    }
  });

  nextCard();
}
