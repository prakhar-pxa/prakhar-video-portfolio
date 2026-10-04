/* =====================================================
   1. YOUR DETAILS: edit these two lines
   ===================================================== */
const CONFIG = {
  instagram: "https://www.instagram.com/prakhar_._10/", // paste your Instagram link
  email: "prakharagrahari1014@gmail.com"                       // paste your email address
};


/* =====================================================
   2. YOUR VIDEOS
   ===================================================== */
const VIDEOS = [
  {
    title: "Temple & Travel Montage",
    category: "cinematic",
    description: "A fast-paced visual montage capturing travel, temples and cultural experiences.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983288/lv_0_20260818212155.mp4",
    poster: ""
  },
  {
    title: "Jabalpur Heritage & Culture",
    category: "cinematic",
    description: "A visual journey through local heritage, markets and cultural landmarks.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983280/lv_0_20260402010906.mp4",
    poster: ""
  },
  {
    title: "Temple & Heritage Edit",
    category: "cinematic",
    description: "A cinematic showcase of temples, architecture and cultural moments.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983268/1000072058.mp4",
    poster: ""
  },
  {
    title: "Event Highlights",
    category: "other",
    description: "Highlights from an event featuring presentations, audience moments and activities.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983299/lv_0_20260913222833.mp4",
    poster: ""
  },
  {
    title: "Mobile World Promo",
    category: "product",
    description: "A promotional edit showcasing smartphones, products and the Mobile World store.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983285/lv_0_20260719145918.mp4",
    poster: ""
  },
  {
    title: "Fashion & Ethnic Wear Edit",
    category: "promo",
    description: "A fashion-focused edit showcasing ethnic wear through cinematic visuals.",
    src: "https://res.cloudinary.com/dzs8upxc/video/upload/v1790983318/lv_0_20260507174545.mp4",
    poster: ""
  }
];

/* =====================================================
   3. SITE CODE
   ===================================================== */

const CATEGORY_NAMES = {
  reels: "Reels & Short-Form Videos",
  cinematic: "Cinematic Edits",
  product: "Product Videos",
  promo: "Promotional Videos",
  lifestyle: "Lifestyle Videos",
  other: "Other Projects"
};

const grid = document.getElementById("videoGrid");
const chips = document.querySelectorAll(".chip");


/* Apply email + Instagram links everywhere */
document.querySelectorAll("[data-instagram]").forEach(a => {
  a.href = CONFIG.instagram;
});

document.querySelectorAll("[data-email]").forEach(a => {
  const subject = a.classList.contains("btn")
    ? "?subject=Video%20editing%20project"
    : "";

  a.href = "mailto:" + CONFIG.email + subject;
});


const emailText = document.querySelector("[data-email-text]");

if (emailText) {
  emailText.textContent = CONFIG.email;
}

document.getElementById("year").textContent = new Date().getFullYear();


/* =====================================================
   VIDEO FUNCTIONS
   ===================================================== */

function mimeFor(src) {
  const ext = src.split("?")[0].split(".").pop().toLowerCase();

  return {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/mp4",
    ogg: "video/ogg"
  }[ext] || "video/mp4";
}


function escapeHTML(s) {
  return String(s).replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );
}


/* =====================================================
   BUILD VIDEO CARD
   ===================================================== */

function buildCard(v) {

  const card = document.createElement("article");

  card.className = "card" + (v.vertical ? " vertical" : "");

  card.dataset.category = v.category;


  const media = document.createElement("div");

  media.className = "media";


  if (v.src) {

    const video = document.createElement("video");

    /* Normal video controls */
    video.controls = true;

    /* Hide browser download option */
    video.controlsList = "nodownload";

    /* Prevent download by right-click */
    video.addEventListener("contextmenu", e => {
      e.preventDefault();
    });

    video.preload = "none";

    video.playsInline = true;

    video.setAttribute("aria-label", v.title);


    if (v.poster) {
      video.poster = v.poster;
    }


    video.dataset.src = v.src;

    video.dataset.type = mimeFor(v.src);


    /* =================================================
       Automatically detect vertical / horizontal video
       ================================================= */

    video.addEventListener("loadedmetadata", () => {

      if (video.videoHeight > video.videoWidth) {

        card.classList.add("vertical");

      } else {

        card.classList.remove("vertical");

      }

    });


    media.appendChild(video);

  } else {

    media.innerHTML =
      '<div class="placeholder">' +
      '<strong>Placeholder</strong>' +
      '<span>Add your video in script.js</span>' +
      '</div>';

  }


  /* =================================================
     VIDEO TEXT
     ================================================= */

  const text = document.createElement("div");

  text.className = "card-text";


  text.innerHTML =
    "<h3>" +
    escapeHTML(v.title) +
    "</h3>" +

    '<span class="cat">' +
    escapeHTML(
      CATEGORY_NAMES[v.category] || "Other Projects"
    ) +
    "</span>" +

    "<p>" +
    escapeHTML(v.description) +
    "</p>";


  card.append(media, text);

  return card;
}


/* =====================================================
   CREATE ALL VIDEO CARDS
   ===================================================== */

VIDEOS.forEach(v => {

  grid.appendChild(
    buildCard(v)
  );

});


/* =====================================================
   EMPTY CATEGORY MESSAGE
   ===================================================== */

const emptyMsg = document.createElement("p");

emptyMsg.className = "empty";

emptyMsg.textContent =
  "No videos in this category yet.";

emptyMsg.hidden = true;

grid.appendChild(emptyMsg);


/* =====================================================
   LAZY LOAD VIDEOS
   ===================================================== */

const loader =
  "IntersectionObserver" in window

    ? new IntersectionObserver(
        entries => {

          entries.forEach(e => {

            if (!e.isIntersecting) return;

            const video = e.target;


            if (!video.querySelector("source")) {

              const s =
                document.createElement("source");

              s.src = video.dataset.src;

              s.type = video.dataset.type;

              video.appendChild(s);

              video.preload = "metadata";

              video.load();

            }


            loader.unobserve(video);

          });

        },
        {
          rootMargin: "300px"
        }
      )

    : null;


grid.querySelectorAll("video").forEach(v => {

  if (loader) {

    loader.observe(v);

  } else {

    v.preload = "metadata";

    v.src = v.dataset.src;

  }

});


/* =====================================================
   CATEGORY FILTERS
   ===================================================== */

chips.forEach(chip => {

  chip.addEventListener("click", () => {

    const filter = chip.dataset.filter;


    chips.forEach(c => {

      const active = c === chip;

      c.classList.toggle(
        "is-active",
        active
      );

      c.setAttribute(
        "aria-pressed",
        active
      );

    });


    let shown = 0;


    grid.querySelectorAll(".card").forEach(card => {

      const match =
        filter === "all" ||
        card.dataset.category === filter;


      card.hidden = !match;


      if (match) {

        shown++;

      } else {

        card.querySelectorAll("video").forEach(v => {

          v.pause();

        });

      }

    });


    emptyMsg.hidden = shown !== 0;

  });

});


/* =====================================================
   THEME TOGGLE
   ===================================================== */

const root = document.documentElement;

const themeBtn =
  document.getElementById("themeToggle");


function updateThemeLabel() {

  const dark =
    root.getAttribute("data-theme") === "dark";


  themeBtn.setAttribute(
    "aria-label",
    dark
      ? "Switch to light theme"
      : "Switch to dark theme"
  );

}


updateThemeLabel();


themeBtn.addEventListener("click", () => {

  const next =
    root.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";


  root.setAttribute(
    "data-theme",
    next
  );


  try {

    localStorage.setItem(
      "theme",
      next
    );

  } catch (e) {

    /* storage blocked: ignore */

  }


  updateThemeLabel();

});


/* =====================================================
   MOBILE MENU
   ===================================================== */

const menuBtn =
  document.getElementById("menuToggle");

const nav =
  document.getElementById("nav");


function setMenu(open) {

  nav.classList.toggle(
    "open",
    open
  );

  menuBtn.setAttribute(
    "aria-expanded",
    open
  );

  menuBtn.setAttribute(
    "aria-label",
    open
      ? "Close menu"
      : "Open menu"
  );

}


menuBtn.addEventListener(
  "click",
  () =>
    setMenu(
      !nav.classList.contains("open")
    )
);


nav.querySelectorAll("a").forEach(a => {

  a.addEventListener(
    "click",
    () => setMenu(false)
  );

});


document.addEventListener(
  "keydown",
  e => {

    if (e.key === "Escape") {

      setMenu(false);

    }

  }
);