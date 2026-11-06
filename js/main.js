/* ========================================
-- IMPORTS
======================================== */
import * as render from "./render.js";
import { loadData } from "./state.js";

/* ========================================
-- DEFINING CONSTANTS
======================================== */
const sidebar = {
  home: document.querySelector(".js-sidebar-home"),
  study: document.querySelector(".js-sidebar-study"),
  decksPanel: document.querySelector(".sidebar-decks-panel"),
};
const sidebarPaths = {
  home: render.homePage,
  study: render.blankPage,
};

/* ========================================
-- SIDEBAR RELATED STUFFS
======================================== */
sidebar.home.addEventListener("click", () => sidebarClicked("home"));
sidebar.study.addEventListener("click", () => sidebarClicked("study"));

sidebar.decksPanel.addEventListener("click", (e) => {
  const item = e.target.closest(".sidebar-items");
  if (!item) return;
  sidebarClearSelected();
  render.setSelectedDeck(item.dataset.deckId);
  item.classList.add("selected");
  render.deckPage(item.dataset.deckId);
});

/* ========================================
-- HELPER FUNCTIONS
======================================== */
export function sidebarClearSelected() {
  const item = document.querySelector(".sidebar .selected");
  if (!item) return;
  item.classList.remove("selected");
}

export function sidebarClicked(clicked) {
  if (!(clicked in sidebarPaths)) return;
  sidebarClearSelected();
  render.setSelectedDeck(null);
  sidebar[clicked].classList.add("selected");

  sidebarPaths[clicked]();
  console.log(clicked);
}

loadData();
render.homePage();
render.navBar();
