let isLoaded = false;
const DATASTORE_KEY = "datastore";
export let datastore = [
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
  if (isLoaded) {
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
