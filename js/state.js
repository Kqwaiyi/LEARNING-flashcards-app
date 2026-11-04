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
