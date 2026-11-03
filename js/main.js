/* ========================================
-- DEFINING CONSTANTS
======================================== */
const sidebar = {
  home: document.querySelector(".js-sidebar-home"),
  addDecks: document.querySelector(".js-sidebar-add"),
  study: document.querySelector(".js-sidebar-study"),
};
const sidebarPaths = {
  home: "",
  addDecks: "",
  study: "",
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

  console.log(clicked);
}
