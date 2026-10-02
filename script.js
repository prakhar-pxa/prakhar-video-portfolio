/* =====================================================
   1. YOUR DETAILS: edit these two lines
   ===================================================== */
const CONFIG = {
  instagram: "https://www.instagram.com/YOUR_USERNAME", // paste your Instagram link
  email: "your.email@example.com"                       // paste your email address
};

/* =====================================================
   2. YOUR VIDEOS: add, edit or delete entries here
   -----------------------------------------------------
   title:       shown under the video
   category:    reels | cinematic | product | promo | lifestyle | other
   description: one short line
   src:         path to your video, e.g. "videos/reel-edit.mp4"
                (leave "" to show a "placeholder" card instead)
   poster:      optional thumbnail image, e.g. "assets/reel-edit.jpg"
   vertical:    true for 9:16 videos (reels), otherwise leave out
   ===================================================== */
const VIDEOS = [
  { title: "Reel title goes here",      category: "reels",     description: "Short description of this edit.", src: "", poster: "", vertical: true },
  { title: "Cinematic edit title",      category: "cinematic", description: "Short description of this edit.", src: "", poster: "" },
  { title: "Product video title",       category: "product",   description: "Short description of this edit.", src: "", poster: "" },
  { title: "Promotional video title",   category: "promo",     description: "Short description of this edit.", src: "", poster: "" },
  { title: "Lifestyle video title",     category: "lifestyle", description: "Short description of this edit.", src: "", poster: "" },
  { title: "Other project title",       category: "other",     description: "Short description of this edit.", src: "", poster: "" }

  /* Example of a real entry (copy this format):
  { title: "Festival Reel", category: "reels", description: "Fast-paced edit with beat-synced cuts.",
    src: "videos/reel-edit.mp4", poster: "assets/reel-edit.jpg", vertical: true },
  */
];

const CATEGORY_NAMES = {
  reels: "Reels & Short-Form Videos",
  cinematic: "Cinematic Edits",
  product: "Product Videos",
  promo: "Promotional Videos",
  lifestyle: "Lifestyle Videos",
  other: "Other Projects"
};

/* =====================================================
   3. SITE CODE: you shouldn't need to edit below
   ===================================================== */
const grid = document.getElementById("videoGrid");
const chips = document.querySelectorAll(".chip");

/* Apply email + Instagram links everywhere */
document.querySelectorAll("[data-instagram]").forEach(a => (a.href = CONFIG.instagram));
document.querySelectorAll("[data-email]").forEach(a => {
  const subject = a.classList.contains("btn") ? "?subject=Video%20editing%20project" : "";
  a.href = "mailto:" + CONFIG.email + subject;
});
const emailText = document.querySelector("[data-email-text]");
if (emailText) emailText.textContent = CONFIG.email;
document.getElementById("year").textContent = new Date().getFullYear();

/* Build the video cards */
function mimeFor(src) {
  const ext = src.split("?")[0].split(".").pop().toLowerCase();
  return { mp4: "video/mp4", webm: "video/webm", mov: "video/mp4", ogg: "video/ogg" }[ext] || "video/mp4";
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function buildCard(v) {
  const card = document.createElement("article");
  card.className = "card" + (v.vertical ? " vertical" : "");
  card.dataset.category = v.category;

  const media = document.createElement("div");
  media.className = "media";

  if (v.src) {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";          // upgraded to "metadata" when the card nears the screen
    video.playsInline = true;
    video.setAttribute("aria-label", v.title);
    if (v.poster) video.poster = v.poster;
    video.dataset.src = v.src;
    video.dataset.type = mimeFor(v.src);
    media.appendChild(video);
  } else {
    media.innerHTML = '<div class="placeholder"><strong>Placeholder</strong><span>Add your video in script.js</span></div>';
  }

  const text = document.createElement("div");
  text.className = "card-text";
  text.innerHTML =
    "<h3>" + escapeHTML(v.title) + "</h3>" +
    '<span class="cat">' + escapeHTML(CATEGORY_NAMES[v.category] || "Other Projects") + "</span>" +
    "<p>" + escapeHTML(v.description) + "</p>";

  card.append(media, text);
  return card;
}

VIDEOS.forEach(v => grid.appendChild(buildCard(v)));

const emptyMsg = document.createElement("p");
emptyMsg.className = "empty";
emptyMsg.textContent = "No videos in this category yet.";
emptyMsg.hidden = true;
grid.appendChild(emptyMsg);

/* Only load a video's file info when its card is close to the screen */
const loader = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const video = e.target;
        if (!video.querySelector("source")) {
          const s = document.createElement("source");
          s.src = video.dataset.src;
          s.type = video.dataset.type;
          video.appendChild(s);
          video.preload = "metadata";
          video.load();
        }
        loader.unobserve(video);
      });
    }, { rootMargin: "300px" })
  : null;

grid.querySelectorAll("video").forEach(v => {
  if (loader) loader.observe(v);
  else { v.preload = "metadata"; v.src = v.dataset.src; }
});

/* Category filters */
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    chips.forEach(c => {
      const active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", active);
    });
    let shown = 0;
    grid.querySelectorAll(".card").forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.hidden = !match;
      if (match) shown++;
      else card.querySelectorAll("video").forEach(v => v.pause()); // stop hidden videos
    });
    emptyMsg.hidden = shown !== 0;
  });
});

/* Theme toggle (remembered in localStorage) */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function updateThemeLabel() {
  const dark = root.getAttribute("data-theme") === "dark";
  themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}
updateThemeLabel();

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: ignore */ }
  updateThemeLabel();
});

/* Mobile menu */
const menuBtn = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
