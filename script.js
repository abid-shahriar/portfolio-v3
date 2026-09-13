const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  mobileNav.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) closeMenu(true);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header") && !mobileNav.hidden) closeMenu();
});

window.matchMedia("(min-width: 821px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

document.querySelector("#year").textContent = new Date().getFullYear();
const clock = document.querySelector("#local-clock");
function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 60000);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-20% 0px -60% 0px" },
);

document.querySelectorAll("#about, #experience, #skills, #contact").forEach((section) => sectionObserver.observe(section));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6%" },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

const header = document.querySelector(".site-header");
let scrollFrame = 0;
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  scrollFrame = 0;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
  },
  { passive: true },
);
updateHeader();
