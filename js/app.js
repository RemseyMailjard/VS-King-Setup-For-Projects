/* Case Follow-up Tracker (training app)
   - No build step
   - Simple state stored in localStorage
*/

const STORAGE_KEY = "case-followup-tracker.tasks.v1";
const SEEDED_KEY = "case-followup-tracker.seeded.v1";

const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element: ${id}`);
  return element;
}

function safeTrim(value) {
  return String(value ?? "").trim();
}

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `task_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

async function seedSampleDataIfNeeded() {
  const storageStatus = byId("storageStatus");

  try {
    const tasks = loadTasks();
    const seeded = localStorage.getItem(SEEDED_KEY) === "true";

    if (tasks.length > 0 || seeded) {
      storageStatus.textContent = "Storage ready";
      return;
    }

    const response = await fetch("./data/sample-tasks.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Sample data not available");

    const data = await response.json();
    const seededTasks = Array.isArray(data) ? data : [];

    saveTasks(seededTasks);
    localStorage.setItem(SEEDED_KEY, "true");

    storageStatus.textContent = "Seeded sample data";
  } catch {
    // If the app is opened via file://, fetch() might fail.
    storageStatus.textContent = "Storage ready";
  }
}

function normalizeTask(task) {
  return {
    id: safeTrim(task.id) || makeId(),
    caseId: safeTrim(task.caseId),
    note: safeTrim(task.note),
    priority: PRIORITIES.includes(task.priority) ? task.priority : "Normal",
    completed: Boolean(task.completed),
    createdAt: safeTrim(task.createdAt) || nowIso(),
  };
}

function matchesFilters(task, statusFilter, priorityFilter) {
  if (statusFilter === "Open" && task.completed) return false;
  if (statusFilter === "Completed" && !task.completed) return false;

  if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;

  return true;
}

function badgeClass(priority) {
  switch (priority) {
    case "Low":
      return "badge badge-low";
    case "High":
      return "badge badge-high";
    case "Urgent":
      return "badge badge-urgent";
    case "Normal":
    default:
      return "badge badge-normal";
  }
}

function formatDateTime(isoString) {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}

function render(tasks, filters) {
  const tbody = byId("taskTableBody");
  const emptyState = byId("emptyState");
  const summary = byId("tasksSummary");

  const filtered = tasks.filter((t) =>
    matchesFilters(t, filters.statusFilter, filters.priorityFilter)
  );

  tbody.textContent = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  for (const task of filtered) {
    const tr = document.createElement("tr");
    tr.dataset.taskId = task.id;

    const statusTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark case ${task.caseId} as completed`);
    checkbox.dataset.action = "toggle";
    statusTd.appendChild(checkbox);

    const caseTd = document.createElement("td");
    caseTd.textContent = task.caseId;

    const prioTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = badgeClass(task.priority);
    badge.textContent = task.priority;
    prioTd.appendChild(badge);

    const noteTd = document.createElement("td");
    noteTd.textContent = task.note;

    const createdTd = document.createElement("td");
    createdTd.className = "muted";
    createdTd.textContent = formatDateTime(task.createdAt);

    const actionsTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "button button-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";
    deleteBtn.setAttribute("aria-label", `Delete follow-up task for case ${task.caseId}`);
    actionsTd.appendChild(deleteBtn);

    tr.append(statusTd, caseTd, prioTd, noteTd, createdTd, actionsTd);
    tbody.appendChild(tr);
  }

  summary.textContent = `Showing ${filtered.length} of ${tasks.length} tasks`;
}

function getFilters() {
  return {
    statusFilter: byId("statusFilter").value,
    priorityFilter: byId("priorityFilter").value,
  };
}

function main() {
  const form = byId("taskForm");
  const tbody = byId("taskTableBody");

  let tasks = loadTasks().map(normalizeTask);

  function refresh() {
    saveTasks(tasks);
    render(tasks, getFilters());
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const caseId = safeTrim(byId("caseId").value);
    const priority = byId("priority").value;
    const note = safeTrim(byId("note").value);

    if (!caseId || !note) return;

    const newTask = normalizeTask({
      id: makeId(),
      caseId,
      note,
      priority,
      completed: false,
      createdAt: nowIso(),
    });

    tasks = [newTask, ...tasks];

    form.reset();
    byId("priority").value = "Normal";
    byId("caseId").focus();

    refresh();
  });

  byId("statusFilter").addEventListener("change", refresh);
  byId("priorityFilter").addEventListener("change", refresh);

  tbody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    if (!action) return;

    const row = target.closest("tr");
    const taskId = row?.dataset.taskId;
    if (!taskId) return;

    if (action === "delete") {
      tasks = tasks.filter((t) => t.id !== taskId);
      refresh();
      return;
    }

    if (action === "toggle" && target instanceof HTMLInputElement) {
      const isCompleted = target.checked;
      tasks = tasks.map((t) => (t.id === taskId ? { ...t, completed: isCompleted } : t));
      refresh();
    }
  });

  // Initial render
  render(tasks, getFilters());

  seedSampleDataIfNeeded().then(() => {
    tasks = loadTasks().map(normalizeTask);
    render(tasks, getFilters());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    main();
  } catch (error) {
    const status = document.getElementById("storageStatus");
    if (status) status.textContent = "Error";
    // eslint-disable-next-line no-console
    console.error(error);
  }
});
