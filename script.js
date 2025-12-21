// ================== CONSTANTS ==================
const body = document.body;
const themeBtn = document.querySelector("#btn-theme");
const hamburgerBtn = document.querySelector(".nav__hamburger i");
const navList = document.querySelector(".nav__list");
const scrollTopBtn = document.querySelector(".scroll-top");

const THEME_KEY = "portfolio-theme";
const ICON_KEY = "portfolio-btn-theme";

// ================== THEME ==================
const applyTheme = (theme, icon) => {
  body.className = theme;
  themeBtn.className = `fas ${icon}`;

  localStorage.setItem(THEME_KEY, theme);
  localStorage.setItem(ICON_KEY, icon);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  const savedIcon = localStorage.getItem(ICON_KEY) || "fa-moon";
  applyTheme(savedTheme, savedIcon);
};

const toggleTheme = () => {
  const isDark = body.classList.contains("dark");

  applyTheme(isDark ? "light" : "dark", isDark ? "fa-moon" : "fa-sun");
};

// ================== NAVIGATION ==================
const toggleNav = () => {
  const isOpen = navList.classList.toggle("display-nav-list");

  hamburgerBtn.classList.toggle("fa-bars", !isOpen);
  hamburgerBtn.classList.toggle("fa-times", isOpen);
};

// ================== SCROLL TO TOP ==================
const handleScroll = () => {
  const show = window.scrollY > 500;
  scrollTopBtn.style.display = show ? "block" : "none";
};

// ================== EVENTS ==================
themeBtn.addEventListener("click", toggleTheme);
hamburgerBtn.addEventListener("click", toggleNav);
window.addEventListener("scroll", handleScroll);

// ================== INIT ==================
loadTheme();
