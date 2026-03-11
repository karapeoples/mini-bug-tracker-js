// Cache DOM elements used for counters, filters, and bug list rendering
const info = document.getElementById("info");
const all = document.getElementById("all");
const open = document.getElementById("open");
const closed = document.getElementById("closed");
const high = document.getElementById("high");
const low = document.getElementById("low");
const list = document.getElementById("list");
const important = document.getElementById("important");
const attentionHigh = document.getElementById("attentionHigh");
const attentionLow = document.getElementById("attentionLow");
const notImportant = document.getElementById("notImportant");

// Counter values for each filter group
let openNum = 0;
let closedNum = 0;
let hPriorityNum = 0;
let lPriorityNum = 0;
let importantNum = 0;
let attentionHighNum = 0;
let attentionLowNum = 0;
let notImportantNum = 0;

// Sample bug data used to render the tracker
const bugs = [
  { title: "Login button not responding", status: "open", priority: "high" },
  { title: "Profile image not loading", status: "open", priority: "low" },
  { title: "Dashboard crashes on refresh", status: "closed", priority: "high" },
  { title: "Search results not updating", status: "open", priority: "high" },
  { title: "Notification badge incorrect", status: "closed", priority: "low" },
  { title: "Settings page layout misaligned", status: "open", priority: "low" },
  { title: "Password reset email delayed", status: "closed", priority: "high" },
  { title: "Mobile menu not opening", status: "open", priority: "high" },
  { title: "Footer links not clickable", status: "closed", priority: "low" },
  {
    title: "User session expires too quickly",
    status: "open",
    priority: "high"
  }
];

// Count bugs by status, priority, and combined filter groups

const updateCounts = () => {
  for (let i = 0; i < bugs.length; i++) {
    switch (bugs[i].status) {
      case "open":
        openNum += 1;
        break;
      case "closed":
        closedNum += 1;
        break;
    }
    switch (bugs[i].priority) {
      case "high":
        hPriorityNum += 1;
        break;
      case "low":
        lPriorityNum += 1;
        break;
    }
    if (bugs[i].priority === "high" && bugs[i].status === "open") {
      importantNum += 1;
    }

    if (bugs[i].priority === "low" && bugs[i].status === "open") {
      attentionHighNum += 1;
    }

    if (bugs[i].priority === "high" && bugs[i].status === "closed") {
      attentionLowNum += 1;
    }

    if (bugs[i].priority === "low" && bugs[i].status === "closed") {
      notImportantNum += 1;
    }
  }

  // Update badge counts in the UI
  all.textContent = bugs.length;
  open.textContent = openNum;
  closed.textContent = closedNum;
  high.textContent = hPriorityNum;
  low.textContent = lPriorityNum;
  important.textContent = importantNum;
  attentionHigh.textContent = attentionHighNum;
  attentionLow.textContent = attentionLowNum;
  notImportant.textContent = notImportantNum;
};

// Render bug rows based on the currently selected filter
const renderBugs = (filter = "all") => {
  list.replaceChildren();

  for (let i = 0; i < bugs.length; i++) {
    const bug = bugs[i];

    let shouldShow = false;

    switch (filter) {
      case "all":
        shouldShow = true;
        break;
      case "open":
        shouldShow = bug.status === "open";
        break;
      case "closed":
        shouldShow = bug.status === "closed";
        break;
      case "high":
        shouldShow = bug.priority === "high";
        break;
      case "low":
        shouldShow = bug.priority === "low";
        break;
      case "important":
        shouldShow = bug.priority === "high" && bug.status === "open";
        break;
      case "attentionHigh":
        shouldShow = bug.priority === "low" && bug.status === "open";
        break;
      case "attentionLow":
        shouldShow = bug.priority === "high" && bug.status === "closed";
        break;
      case "notImportant":
        shouldShow = bug.priority === "low" && bug.status === "closed";
        break;
    }

    // Create and display a row only if it matches the current filter
    if (shouldShow) {
      const item = document.createElement("li");
      item.textContent = bug.title + " | " + bug.priority + " | " + bug.status;
      list.appendChild(item);
    }
  }
};

// Use event bubbling to handle all badge clicks from one parent listener
info.addEventListener("click", (event) => {
  const badge = event.target.closest(".badge");

  if (!badge) return;
  const badges = info.querySelectorAll(".badge");

  // Remove active state from all badges before setting the new active filter
  for (let i = 0; i < badges.length; i++) {
    badges[i].classList.remove("active");
  }

  badge.classList.add("active");

  const filter = badge.dataset.filter;
  renderBugs(filter);
});

// Set the default active filter on first load
const defaultBadge = info.querySelector('[data-filter="all"]');
defaultBadge.classList.add("active");

// Initial app setup
updateCounts();
renderBugs("all");
