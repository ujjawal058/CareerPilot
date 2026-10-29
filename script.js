
const form = document.getElementById("internship-form");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const internshipList = document.getElementById("internship-list");
const applicationCount = document.getElementById("application-count");

// Load saved applications from browser storage
let applications = [];

try {
  applications = JSON.parse(
    localStorage.getItem("careerPilotApplications") || "[]"
  );

  if (!Array.isArray(applications)) {
    applications = [];
  }
} catch {
  applications = [];
}

// Display applications on the page
function renderApplications() {
  internshipList.replaceChildren();

  if (applications.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent =
      "Your internship applications will appear here.";
    internshipList.appendChild(message);
  }

  applications.forEach((application) => {
    const item = document.createElement("div");
    item.className = "application-item";

    const details = document.createElement("div");

    const company = document.createElement("h3");
    company.textContent = application.company;

    const role = document.createElement("p");
    role.textContent = application.role;

    const status = document.createElement("p");
    status.textContent = "Status: " + application.status;

    details.append(company, role, status);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      applications = applications.filter(
        (entry) => entry.id !== application.id
      );

      saveApplications();
      renderApplications();
    });

    item.append(details, deleteButton);
    internshipList.appendChild(item);
  });

  applicationCount.textContent = String(applications.length).padStart(
    2,
    "0"
  );
}

// Save applications in browser storage
function saveApplications() {
  localStorage.setItem(
    "careerPilotApplications",
    JSON.stringify(applications)
  );
}

// Add a new internship application
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const company = companyInput.value.trim();
  const role = roleInput.value.trim();

  if (!company || !role) {
    return;
  }

  const newApplication = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    company,
    role,
    status: "Applied"
  };

  applications.push(newApplication);

  saveApplications();
  renderApplications();

  form.reset();
  companyInput.focus();
});

// Show saved applications when the page loads
renderApplications();

const skillSelect = document.getElementById("skill-select");
const skillLevel = document.getElementById("skill-level");
const updateSkillButton = document.getElementById("update-skill");
const skillMessage = document.getElementById("skill-message");

const skillNames = {
  html: "HTML & CSS",
  javascript: "JavaScript",
  java: "Java",
  dsa: "DSA"
};

let skillProgress = {
  html: 35,
  javascript: 20,
  java: 30,
  dsa: 10
};

try {
  const savedSkills = JSON.parse(
    localStorage.getItem("careerPilotSkills") || "null"
  );

  if (savedSkills && typeof savedSkills === "object") {
    for (const key of Object.keys(skillProgress)) {
      const value = savedSkills[key];

      if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
      ) {
        skillProgress[key] = value;
      }
    }
  }
} catch {
  // Use the default progress if saved data is unavailable.
}

function updateSkillDisplay() {
  for (const key of Object.keys(skillProgress)) {
    const progress = skillProgress[key];
    const bar = document.getElementById(key + "-bar");
    const level = document.getElementById(key + "-level");

    bar.style.width = progress + "%";

    let label = "Beginner";
    if (progress >= 100) label = "Completed";
    else if (progress >= 85) label = "Advanced";
    else if (progress >= 60) label = "Intermediate";

    level.textContent = `${label} · ${progress}%`;
  }
}

updateSkillButton.addEventListener("click", () => {
  const skill = skillSelect.value;
  const progress = Number(skillLevel.value);

  skillProgress[skill] = progress;

  localStorage.setItem(
    "careerPilotSkills",
    JSON.stringify(skillProgress)
  );

  updateSkillDisplay();

  skillMessage.textContent =
    `${skillNames[skill]} progress updated to ${progress}%.`;
});

updateSkillDisplay();