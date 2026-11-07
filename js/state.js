let isLoaded = false;
const DATASTORE_KEY = "datastore";

let datastore = [];

/*
========================================
-- DATASTORE STRUCTURE
========================================
[
  {
    id: "smthsmth",
    name: "namestring",
    bestScore: null,
    cards: [
      {
        id: 1,
        front: "smthsmth",
        back: "smthsmth",
        createdAt: 123,
      },
      {
        id: 2,
        front: "smthsmth",
        back: "smthsmth",
        createdAt: 123,
      },
      {
        id: 3,
        front: "smthsmth",
        back: "smthsmth",
        createdAt: 123,
      },
    ],
  },
];
*/

/*========================================
-- PRIVATE FUNCTIONS
=========================================*/
function saveData() {
  // Called at every data-modification related functions ending, to save data to localstorage
  const dataToSave = JSON.stringify(datastore);
  localStorage.setItem(DATASTORE_KEY, dataToSave);
}

/* ========================================
-- PUBLIC FUNCTIONS
======================================== */
export function loadData() {
  // Called once when app loads, loading the datastore from localstorage
  if (isLoaded || datastore.length > 0) {
    return;
  }
  isLoaded = true;

  try {
    const parsed = JSON.parse(localStorage.getItem(DATASTORE_KEY));
    if (parsed && Array.isArray(parsed)) {
      datastore = parsed;
    }
  } catch (err) {
    console.log(err);
  }
}

export function getData() {
  // Getter function for datastore. No external script touches datastore directly.
  return datastore;
}

export function createDeck(name) {
  const trimmedName = name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 40) return null;

  const nameDuplicateCheck = datastore.find(
    (elem) => elem.name === trimmedName,
  );
  if (nameDuplicateCheck) return null;

  let newDeck = {
    id: crypto.randomUUID(),
    name: trimmedName,
    bestScore: null,
    cards: [],
  };

  datastore.push(newDeck);
  saveData();
}

export function createCard(id, question, answer) {
  const deck = datastore.find((elem) => elem.id === id);
  if (!deck) return null;
  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  if (trimmedAnswer.length < 1 || trimmedAnswer.length > 150) return null;
  if (trimmedQuestion.length < 1 || trimmedQuestion.length > 150) return null;

  let newCard = {
    id: crypto.randomUUID(),
    front: trimmedQuestion,
    back: trimmedAnswer,
    createdAt: Date.now(),
  };

  deck.cards.push(newCard);
  saveData();
  return newCard;
}

export function deleteCardWithId(deckId, cardId) {
  const deck = getDeckWithId(deckId);
  if (!deck) return null;

  const index = deck.cards.findIndex((card) => card.id === cardId);
  if (index === -1) return null;

  deck.cards.splice(index, 1);
  saveData();
  return 200;
}

export function getCardWithId(deckId, cardId) {
  const deck = getDeckWithId(deckId);
  if (!deck) return null;

  const card = deck.cards.find((elem) => elem.id === cardId);
  if (!card) return null;

  return card;
}

export function updateCardWithId(deckId, cardId, newQsn, newAns) {
  const deck = getDeckWithId(deckId);
  if (!deck) return null;

  const card = deck.cards.find((elem) => elem.id === cardId);
  const cardIndex = deck.cards.findIndex((elem) => elem.id === cardId);
  if (!card || cardIndex === -1) return null;

  let newCard = { ...card };
  newCard.front = newQsn;
  newCard.back = newAns;

  deck.cards[cardIndex] = newCard;
  saveData();
  return 200;
}

export function updateDeckBestScore(id, bestScore) {
  if (Number(bestScore) < 0 || Number(bestScore) > 100) return;
  const deck = getDeckWithId(id);
  if (!deck) return;

  if (deck.bestScore >= bestScore) return;

  deck.bestScore = bestScore;
  saveData();
}

export function importCardsToDeck(id, content) {
  if (!Array.isArray(content) || content.length === 0) return null;

  const deck = getDeckWithId(id);
  if (!deck) return null;

  const normalizedResults = content
    .map((elem) => {
      return {
        id: crypto.randomUUID(),
        front: decodeURIComponent(elem.question).trim(),
        back: decodeURIComponent(elem.correct_answer).trim(),
        createdAt: Date.now(),
      };
    })
    .filter((card) => {
      return (
        card.front.length >= 1 &&
        card.front.length <= 150 &&
        card.back.length >= 1 &&
        card.back.length <= 150
      );
    });
  deck.cards.push(...normalizedResults);
  saveData();
  return normalizedResults.length;
}

export function deleteDeckWithId(id) {
  const index = datastore.findIndex((deck) => deck.id === id);
  if (index === -1) {
    return;
  }

  datastore.splice(index, 1);
  saveData();
}

export function getDeckWithId(id) {
  const deckFound = datastore.find((deck) => {
    return deck.id === id;
  });
  return deckFound || null;
}

export function getTotalDecks() {
  return datastore.length;
}

export function getTotalCards() {
  let total = 0;
  datastore.forEach((elem) => {
    total += elem.cards.length;
  });
  return total;
}
