// ================== CONSTANTS ==================
const body = document.body;
const themeBtnIcon = document.querySelector("#btn-theme");
const themeBtn = document.querySelector('button[aria-label="toggle theme"]');
const hamburgerBtn = document.querySelector(".nav__hamburger");
const hamburgerBtnIcon = document.querySelector(".nav__hamburger i");
const navList = document.querySelector(".nav__list");
const scrollTopBtn = document.querySelector(".scroll-top");

const THEME_KEY = "portfolio-theme";
const ICON_KEY = "portfolio-btn-theme";

// ================== THEME ==================
const applyTheme = (theme, icon) => {
  // Add a class to body to enable smooth transitions
  body.classList.add('theme-transitioning');
  
  // Small delay to ensure transition starts
  requestAnimationFrame(() => {
    body.className = theme + ' theme-transitioning';
    if (themeBtnIcon) {
      themeBtnIcon.className = `fas ${icon}`;
    }

    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(ICON_KEY, icon);
    
    // Remove transition class after transition completes
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 400);
  });
};

const loadTheme = () => {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    // Use saved preference
    const savedIcon = localStorage.getItem(ICON_KEY) || (savedTheme === "dark" ? "fa-sun" : "fa-moon");
    applyTheme(savedTheme, savedIcon);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDark ? "dark" : "light";
    const icon = prefersDark ? "fa-sun" : "fa-moon";
    applyTheme(theme, icon);
  }
};

const toggleTheme = () => {
  const isDark = body.classList.contains("dark");

  applyTheme(isDark ? "light" : "dark", isDark ? "fa-moon" : "fa-sun");
};

// ================== NAVIGATION ==================
const toggleNav = () => {
  const isOpen = navList.classList.toggle("display-nav-list");

  if (hamburgerBtnIcon) {
    hamburgerBtnIcon.classList.toggle("fa-bars", !isOpen);
    hamburgerBtnIcon.classList.toggle("fa-times", isOpen);
  }
};

// Close mobile nav when clicking on a link
const navLinks = document.querySelectorAll(".link--nav");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("display-nav-list");
    if (hamburgerBtnIcon) {
      hamburgerBtnIcon.classList.add("fa-bars");
      hamburgerBtnIcon.classList.remove("fa-times");
    }
  });
});

// ================== SCROLL TO TOP ==================
const handleScroll = () => {
  const show = window.scrollY > 500;
  if (scrollTopBtn) {
    if (show) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }
};

// ================== SCROLL ANIMATIONS ==================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
const observeElements = () => {
  const animatedElements = document.querySelectorAll(
    ".project, .achievement-card, .experience__item, .education__item, .stat-card, .about__content"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });
};

// ================== NUMBER COUNTING ANIMATION ==================
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
};

const observeStats = () => {
  const statNumbers = document.querySelectorAll(".stat-card__number");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const targetValue = entry.target.dataset.target;
          
          // Check if data-target exists and is a valid number
          if (targetValue && !isNaN(parseFloat(targetValue))) {
            const target = parseFloat(targetValue);
            entry.target.dataset.animated = "true";
            
            if (target % 1 === 0) {
              // Integer
              animateCounter(entry.target, target);
            } else {
              // Decimal
              const duration = 2000;
              const start = 0;
              const increment = target / (duration / 16);
              let current = start;

              const updateCounter = () => {
                current += increment;
                if (current < target) {
                  entry.target.textContent = current.toFixed(1);
                  requestAnimationFrame(updateCounter);
                } else {
                  entry.target.textContent = target.toFixed(1);
                }
              };
              updateCounter();
            }
          } else {
            // If no valid data-target or already has text, mark as animated and skip
            entry.target.dataset.animated = "true";
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    // Only set to "0" if it has a valid data-target attribute
    if (stat.dataset.target && !isNaN(parseFloat(stat.dataset.target))) {
      stat.textContent = "0";
    }
    // Otherwise, keep the existing text (like "2 years 9 months")
    statsObserver.observe(stat);
  });
};

// ================== TYPING ANIMATION ==================
const typingAnimation = () => {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement) return;

  const texts = [
    ".NET Full Stack Developer",
    "ASP.NET Core Specialist",
    "Web API Developer",
    "Angular Developer",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  };

  type();
};

// ================== SMOOTH SCROLL FOR ANCHOR LINKS ==================
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#top") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
};

// ================== HEADER SCROLL EFFECT ==================
const headerScrollEffect = () => {
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "var(--shadow-lg)";
    } else {
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });
};

// ================== PARALLAX EFFECT FOR HERO ==================
const parallaxEffect = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    hero.style.transform = `translateY(${rate}px)`;
  });
};

// ================== INITIALIZE ON LOAD ==================
const init = () => {
  loadTheme();
  observeElements();
  observeStats();
  typingAnimation();
  smoothScroll();
  headerScrollEffect();
};

// ================== EVENTS ==================
if (themeBtn) {
  themeBtn.addEventListener("click", toggleTheme);
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", toggleNav);
}

window.addEventListener("scroll", handleScroll);

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Re-observe elements after dynamic content loads
window.addEventListener("load", () => {
  setTimeout(observeElements, 100);
});
