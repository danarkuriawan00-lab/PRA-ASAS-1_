(function () {
  const gate = document.getElementById("gate");
  const interrupt = document.getElementById("interrupt");
  const app = document.getElementById("app");
  const flash = document.getElementById("flash");
  const btnMulai = document.getElementById("btn-mulai");

  let aktif = false;
  let terkunci = false;

  function isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
  }

  function mintaFullscreen() {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    if (!req) return Promise.resolve();
    return Promise.resolve(req.call(el)).catch(function () {});
  }

  function bukaSoal() {
    if (terkunci) return;
    aktif = true;
    gate.classList.add("hidden");
    interrupt.classList.add("hidden");
    app.classList.remove("hidden");
  }

  function tutupSoal() {
    if (!aktif) return;
    aktif = false;
    terkunci = true;
    app.classList.add("hidden");
    gate.classList.add("hidden");
    interrupt.classList.remove("hidden");
  }

  function mulai() {
    if (terkunci) return;
    mintaFullscreen().finally(bukaSoal);
  }

  btnMulai.addEventListener("click", mulai);

  document.addEventListener("fullscreenchange", function () {
    if (aktif && !isFullscreen()) tutupSoal();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    if (aktif && !isFullscreen()) tutupSoal();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) tutupSoal();
  });

  window.addEventListener("pagehide", tutupSoal);

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  ["copy", "cut", "paste", "dragstart", "selectstart"].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      e.preventDefault();
    });
  });

  function blokirPintasan(e) {
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    const dilarang =
      k === "PrintScreen" ||
      k === "F12" ||
      k === "F11" ||
      (ctrl && (k === "p" || k === "P")) ||
      (ctrl && (k === "s" || k === "S")) ||
      (ctrl && (k === "u" || k === "U")) ||
      (ctrl && (k === "c" || k === "C")) ||
      (ctrl && (k === "x" || k === "X")) ||
      (ctrl && (k === "a" || k === "A")) ||
      (ctrl && (k === "o" || k === "O")) ||
      (ctrl && (k === "n" || k === "N")) ||
      (ctrl && (k === "t" || k === "T")) ||
      (ctrl && (k === "w" || k === "W")) ||
      (ctrl && (k === "Tab" || k === "tab")) ||
      (ctrl && shift && (k === "i" || k === "I")) ||
      (ctrl && shift && (k === "j" || k === "J")) ||
      (ctrl && shift && (k === "c" || k === "C")) ||
      (ctrl && shift && (k === "n" || k === "N")) ||
      (alt && k === "Tab") ||
      (e.keyCode === 44);

    if (!dilarang) return;

    e.preventDefault();
    e.stopPropagation();

    if (k === "PrintScreen" || e.keyCode === 44) {
      flash.classList.remove("hidden");
      setTimeout(function () {
        flash.classList.add("hidden");
      }, 1500);
      tutupSoal();
    }
  }

  document.addEventListener("keydown", blokirPintasan, true);
  document.addEventListener("keyup", blokirPintasan, true);

  window.addEventListener("beforeprint", function (e) {
    e.preventDefault();
    tutupSoal();
  });
})();
