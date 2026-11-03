/* ========================================
-- IMPORTS
======================================== */
import * as render from "./render.js";

/* ========================================
-- DEFINING CONSTANTS
======================================== */
const sidebar = {
  home: document.querySelector(".js-sidebar-home"),
  addDecks: document.querySelector(".js-sidebar-add"),
  study: document.querySelector(".js-sidebar-study"),
};
const sidebarPaths = {
  home: render.homePage,
  addDecks: render.blankPage,
  study: render.blankPage,
};
let sidebarSelected = "home";

/* ========================================
-- SIDEBAR RELATED STUFFS
======================================== */
sidebar.home.addEventListener("click", () => sidebarClicked("home"));
sidebar.addDecks.addEventListener("click", () => sidebarClicked("addDecks"));
sidebar.study.addEventListener("click", () => sidebarClicked("study"));

/* ========================================
-- HELPER FUNCTIONS
======================================== */
function sidebarClicked(clicked) {
  if (sidebarSelected === clicked) return;
  if (!(clicked in sidebarPaths)) return;
  sidebar[sidebarSelected].classList.remove("selected");
  sidebarSelected = clicked;
  sidebar[clicked].classList.add("selected");

  sidebarPaths[clicked]();
  console.log(clicked);
}

render.homePage();
