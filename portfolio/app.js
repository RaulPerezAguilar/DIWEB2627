const themes = [
  {
    id: "tema-01",
    number: "01",
    title: "La evolución de la web",
    description: "Historia y fundamentos de la experiencia web.",
    activities: [
      {
        id: "tema-01-ejercicio-01",
        number: "01",
        title: "Evolución de la Web",
        description: "Presentación visual sobre las etapas de la web.",
        format: "web",
        path: "../evolucion.html",
        filename: "evolucion.html"
      },
      {
        id: "tema-01-ejercicio-02",
        number: "02",
        title: "Actividad 02",
        description: "Entrega original en PDF.",
        format: "pdf",
        path: "../Tema1/Ejercicio%202/Ejercicio%202.pdf",
        filename: "Ejercicio 2.pdf"
      },
      {
        id: "tema-01-ejercicio-03",
        number: "03",
        title: "Actividad 03",
        description: "Entrega original en PDF.",
        format: "pdf",
        path: "../Tema1/Ejercicio%203/Ejercicio%203.pdf",
        filename: "Ejercicio 3.pdf"
      },
      {
        id: "tema-01-ejercicio-04",
        number: "04",
        title: "Actividad 04",
        description: "Entrega original en PDF.",
        format: "pdf",
        path: "../Tema1/Ejercicio%204/Ejercicio%204.pdf",
        filename: "Ejercicio 4.pdf"
      },
      {
        id: "tema-01-ejercicio-05",
        number: "05",
        title: "Actividad 05",
        description: "Entrega original en PDF.",
        format: "pdf",
        path: "../Tema1/Ejercicio%205/Ejercicio%205.pdf",
        filename: "Ejercicio 5.pdf"
      }
    ]
  },
  {
    id: "tema-02",
    number: "02",
    title: "Estructura de interfaces",
    description: "Composición, navegación y elementos de interfaz.",
    activities: [
      {
        id: "tema-02-ejercicio-01",
        number: "01",
        title: "Actividad 01",
        description: "Entrega original en PDF.",
        format: "pdf",
        path: "../Tema2/Ejercicio%201/Ejercicio%201.pdf",
        filename: "Ejercicio 1.pdf"
      },
      {
        id: "tema-02-ejercicio-02",
        number: "02",
        title: "Estructura de una tienda web",
        description: "Cabecera, navegación, categorías y pie de página.",
        format: "web",
        path: "../Tema2/Ejercicio%202/Ejercicio%202.html",
        filename: "Ejercicio 2.html"
      },
      {
        id: "tema-02-ejercicio-03",
        number: "03",
        title: "Análisis de elementos de interfaz",
        description: "Lectura conceptual, visual, relacional y práctica.",
        format: "web",
        path: "../Tema2/Ejercicio%203/Ejercicio%203.html",
        filename: "Ejercicio 3.html"
      }
    ]
  }
];

const themeList = document.querySelector("#theme-list");
const themeIndex = document.querySelector("#theme-index");
const searchInput = document.querySelector("#activity-search");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#activity-dialog");
const frame = document.querySelector("#activity-frame");
const codeSource = document.querySelector("#code-source");
const codeTab = document.querySelector("#code-tab");
const previewPanel = document.querySelector("#preview-panel");
const codePanel = document.querySelector("#code-panel");
const documentNotice = document.querySelector("#document-notice");
const toast = document.querySelector("#toast");
let selectedActivity = null;
let activeFilter = "all";
let toastTimer;

const allActivities = themes.flatMap(theme => theme.activities.map(activity => ({ ...activity, theme })));

function renderCatalog() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const matchingThemes = themes.map(theme => ({
    ...theme,
    activities: theme.activities.filter(activity => {
      const matchesFormat = activeFilter === "all" || activity.format === activeFilter;
      const searchable = `${theme.title} ${activity.title} ${activity.description} ${activity.number}`.toLocaleLowerCase("es");
      return matchesFormat && searchable.includes(query);
    })
  })).filter(theme => theme.activities.length > 0);

  themeIndex.innerHTML = matchingThemes.map(theme =>
    `<a href="#${theme.id}">TEMA ${theme.number} <span aria-hidden="true">↘</span></a>`
  ).join("");

  themeList.innerHTML = matchingThemes.map(theme => `
    <section class="theme-section" id="${theme.id}" aria-labelledby="heading-${theme.id}">
      <div class="theme-section-heading">
        <span class="theme-number">TEMA ${theme.number}</span>
        <h3 id="heading-${theme.id}">${theme.title}</h3>
        <span class="theme-description">${theme.description}</span>
      </div>
      ${theme.activities.map(activity => `
        <article class="activity-row">
          <span class="activity-number">${theme.number}.${activity.number}</span>
          <span>
            <span class="activity-name">${activity.title}</span>
            <span class="activity-description">${activity.description}</span>
          </span>
          <span class="format-tag ${activity.format}">${activity.format.toUpperCase()}</span>
          <button class="activity-open" type="button" data-activity="${activity.id}">Ver actividad</button>
          <span class="activity-arrow" aria-hidden="true">↗</span>
        </article>
      `).join("")}
    </section>
  `).join("");

  emptyState.hidden = matchingThemes.length > 0;
  themeList.hidden = matchingThemes.length === 0;
  themeIndex.hidden = matchingThemes.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function setDialogView(view) {
  const isCode = view === "code" && selectedActivity?.format === "web";
  previewPanel.hidden = isCode;
  codePanel.hidden = !isCode;
  documentNotice.hidden = selectedActivity?.format !== "pdf";
  document.querySelectorAll(".dialog-tab").forEach(tab => {
    const active = tab.dataset.view === (isCode ? "code" : "preview");
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  if (isCode) loadCode();
}

function openActivity(activity) {
  selectedActivity = activity;
  document.querySelector("#dialog-kicker").textContent = `TEMA ${activity.theme.number} · ACTIVIDAD ${activity.number} · ${activity.format.toUpperCase()}`;
  document.querySelector("#dialog-title").textContent = activity.title;
  document.querySelector("#open-original").href = activity.path;
  document.querySelector("#download-original").href = activity.path;
  document.querySelector("#download-original").download = activity.filename;
  frame.src = activity.path;
  codeTab.hidden = activity.format !== "web";
  document.querySelector("#download-code").hidden = activity.format !== "web";
  codeSource.value = "";
  document.querySelector("#code-filename").textContent = activity.filename;
  setDialogView("preview");
  dialog.showModal();
}

async function loadCode() {
  if (!selectedActivity || selectedActivity.format !== "web") return;
  if (codeSource.value) return;
  codeSource.value = "Cargando código fuente...";
  try {
    const response = await fetch(selectedActivity.path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    codeSource.value = await response.text();
    document.querySelector("#code-help").textContent = "Código fuente de la actividad original.";
  } catch {
    codeSource.value = "";
    document.querySelector("#code-help").textContent = "Para copiar el código fuente, abre este portfolio desde un servidor local (por ejemplo, Live Server). La vista previa y la descarga del archivo original siguen disponibles.";
    showToast("El navegador no permite leer el código al abrirlo como archivo local.");
  }
}

async function copyCode() {
  await loadCode();
  if (!codeSource.value || codeSource.value === "Cargando código fuente...") return;
  try {
    await navigator.clipboard.writeText(codeSource.value);
  } catch {
    codeSource.focus();
    codeSource.select();
    const copied = document.execCommand("copy");
    if (!copied) {
      showToast("Selecciona el código y cópialo con Ctrl+C.");
      return;
    }
  }
  showToast("Código copiado al portapapeles.");
}

async function downloadCode() {
  await loadCode();
  if (!codeSource.value || codeSource.value === "Cargando código fuente...") return;
  const blob = new Blob([codeSource.value], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = selectedActivity.filename;
  link.click();
  URL.revokeObjectURL(url);
}

themeList.addEventListener("click", event => {
  const button = event.target.closest("[data-activity]");
  if (!button) return;
  const activity = allActivities.find(item => item.id === button.dataset.activity);
  if (activity) openActivity(activity);
});

searchInput.addEventListener("input", renderCatalog);
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach(filter => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    renderCatalog();
  });
});

document.querySelectorAll(".dialog-tab").forEach(tab => {
  tab.addEventListener("click", () => setDialogView(tab.dataset.view));
});
document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => { frame.src = "about:blank"; });
document.querySelector("#copy-code").addEventListener("click", copyCode);
document.querySelector("#download-code").addEventListener("click", downloadCode);

document.addEventListener("keydown", event => {
  if (event.key === "/" && !dialog.open && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

renderCatalog();
