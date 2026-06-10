(function () {
  "use strict";

  const deck = document.querySelector(".reveal");
  if (!deck || typeof Reveal === "undefined") return;

  const config = window.MATH130_DECK || {};
  const sections = Array.from(document.querySelectorAll(".reveal .slides > section"));

  function titleFor(section, index) {
    return section.dataset.title ||
      section.querySelector("h1,h2,h3")?.textContent.trim() ||
      `Slide ${index + 1}`;
  }

  function buildNavigation() {
    const nav = document.createElement("nav");
    nav.className = "slide-nav";
    nav.setAttribute("aria-label", "Lecture slide navigation");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Jump to slide";
    const list = document.createElement("ol");
    sections.forEach((section, index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#/${index}`;
      link.textContent = titleFor(section, index);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        Reveal.slide(index);
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      });
      item.appendChild(link);
      list.appendChild(item);
    });
    button.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
    nav.append(button, list);
    document.body.appendChild(nav);
  }

  function bindAnswers() {
    document.querySelectorAll("[data-answer-toggle]").forEach((button) => {
      const target = document.getElementById(button.dataset.answerToggle);
      if (!target) return;
      button.setAttribute("aria-controls", target.id);
      button.setAttribute("aria-expanded", String(!target.hidden));
      button.addEventListener("click", () => {
        target.hidden = !target.hidden;
        button.setAttribute("aria-expanded", String(!target.hidden));
        button.textContent = target.hidden ? (button.dataset.showLabel || "Reveal solution") : "Hide solution";
        if (!target.hidden && window.MathJax?.typesetPromise) {
          window.MathJax.typesetPromise([target]).catch(() => {});
        }
      });
    });
  }

  function resetSlide() {
    const current = Reveal.getCurrentSlide();
    current?.querySelectorAll("[data-answer]").forEach((answer) => { answer.hidden = true; });
    current?.querySelectorAll("[data-answer-toggle]").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.textContent = button.dataset.showLabel || "Reveal solution";
    });
    current?.dispatchEvent(new CustomEvent("math130:reset", { bubbles: true }));
    Reveal.sync();
  }

  function buildToolbar() {
    const bar = document.createElement("div");
    bar.className = "classroom-toolbar";
    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Reset slide";
    reset.addEventListener("click", resetSlide);
    const overview = document.createElement("button");
    overview.type = "button";
    overview.textContent = "Overview";
    overview.addEventListener("click", () => Reveal.toggleOverview());
    bar.append(reset, overview);
    document.body.appendChild(bar);
  }

  function bindExponentialGraphs() {
    document.querySelectorAll("[data-exp-graph]").forEach((panel) => {
      const canvas = panel.querySelector("canvas");
      const slider = panel.querySelector('input[type="range"]');
      const output = panel.querySelector("output");
      if (!canvas || !slider) return;
      const context = canvas.getContext("2d");
      const draw = () => {
        const base = Number(slider.value);
        if (output) output.textContent = base.toFixed(1);
        const width = canvas.width;
        const height = canvas.height;
        const originX = width * 0.45;
        const originY = height * 0.82;
        const scaleX = width / 11;
        const scaleY = height / 8;
        context.clearRect(0, 0, width, height);
        context.strokeStyle = "#dbe4ec";
        context.lineWidth = 1;
        for (let x = 0; x <= width; x += scaleX) {
          context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
        }
        for (let y = 0; y <= height; y += scaleY) {
          context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
        }
        context.strokeStyle = "#183b5b";
        context.lineWidth = 2;
        context.beginPath(); context.moveTo(0, originY); context.lineTo(width, originY); context.stroke();
        context.beginPath(); context.moveTo(originX, 0); context.lineTo(originX, height); context.stroke();
        context.strokeStyle = "#075ea8";
        context.lineWidth = 4;
        context.beginPath();
        let started = false;
        for (let px = 0; px <= width; px += 1) {
          const x = (px - originX) / scaleX;
          const py = originY - Math.pow(base, x) * scaleY;
          if (py < -50 || py > height + 50) continue;
          if (!started) { context.moveTo(px, py); started = true; } else context.lineTo(px, py);
        }
        context.stroke();
        context.fillStyle = "#b42318";
        context.beginPath();
        context.arc(originX, originY - scaleY, 7, 0, Math.PI * 2);
        context.fill();
      };
      slider.addEventListener("input", draw);
      panel.addEventListener("math130:reset", () => { slider.value = "2"; draw(); });
      draw();
    });
  }

  function bindPracticeGenerators() {
    document.querySelectorAll("[data-practice-generator]").forEach((panel) => {
      const prompt = panel.querySelector("[data-generated-prompt]");
      const answer = panel.querySelector("[data-generated-answer]");
      const button = panel.querySelector("[data-generate]");
      if (!prompt || !answer || !button) return;
      const generate = () => {
        const principal = (Math.floor(Math.random() * 19) + 2) * 500;
        const rate = (Math.floor(Math.random() * 55) + 20) / 10;
        const years = Math.floor(Math.random() * 9) + 2;
        const choices = [
          { word: "annually", n: 1 },
          { word: "quarterly", n: 4 },
          { word: "monthly", n: 12 }
        ];
        const compound = choices[Math.floor(Math.random() * choices.length)];
        const amount = principal * Math.pow(1 + rate / 100 / compound.n, compound.n * years);
        prompt.textContent = `$${principal.toLocaleString()} is invested at ${rate.toFixed(1)}% compounded ${compound.word} for ${years} years. Find the balance.`;
        answer.textContent = `A = $${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        answer.closest("[data-answer]").hidden = true;
        const reveal = panel.querySelector("[data-answer-toggle]");
        if (reveal) {
          reveal.textContent = reveal.dataset.showLabel || "Reveal solution";
          reveal.setAttribute("aria-expanded", "false");
        }
      };
      button.addEventListener("click", generate);
      panel.addEventListener("math130:reset", generate);
      generate();
    });
  }

  function reportOfflineProblems() {
    const external = Array.from(document.querySelectorAll("script[src],link[href],img[src]"))
      .map((el) => el.getAttribute("src") || el.getAttribute("href"))
      .filter((value) => /^https?:\/\//i.test(value || ""));
    if (!external.length) return;
    console.warn("External resources prevent guaranteed offline use:", external);
  }

  window.MathJax = Object.assign({
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
      processEscapes: true
    },
    options: { skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"] }
  }, window.MathJax || {});

  Reveal.initialize({
    width: 1600,
    height: 900,
    margin: 0.035,
    controls: true,
    progress: true,
    hash: true,
    history: true,
    center: false,
    transition: "fade",
    navigationMode: "linear",
    touch: true,
    keyboard: true,
    pdfSeparateFragments: false
  }).then(() => {
    document.documentElement.classList.add("deck-ready");
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise().catch(() => {});
  });

  buildNavigation();
  bindAnswers();
  bindExponentialGraphs();
  bindPracticeGenerators();
  buildToolbar();
  reportOfflineProblems();

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r" && !/input|textarea/i.test(event.target.tagName)) resetSlide();
  });

  window.Math130Slides = { resetSlide, config };
})();
