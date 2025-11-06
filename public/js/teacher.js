import {
  showToast,
  apiFetch,
  formatDateTime,
  asPercentage,
  toggleLoading,
} from "./main.js";

const summarySessionsEl = document.querySelector("[data-summary-sessions]");
const summaryAverageEl = document.querySelector("[data-summary-average]");
const summaryPresentEl = document.querySelector("[data-summary-present]");
const recentBody = document.querySelector("[data-recent-body]");
const activityBody = document.querySelector("[data-activity-body]");
const refreshButton = document.querySelector("[data-refresh]");
const refreshActivityButton = document.querySelector("[data-refresh-activity]");
const signoutButton = document.querySelector("[data-signout]");
const startSessionButton = document.querySelector("[data-start-session]");
const endSessionButton = document.querySelector("[data-end-session]");
const manualButton = document.querySelector("[data-open-manual]");
const manualModal = document.querySelector("[data-manual-modal]");
const manualForm = manualModal?.querySelector("form");
const sessionModal = document.querySelector("[data-session-modal]");
const sessionForm = sessionModal?.querySelector("form");
const activeSection = document.querySelector("[data-active-session]");
const attendanceBody = document.querySelector("[data-attendance-body]");

const snapshotSubject = document.querySelector("[data-session-subject]");
const snapshotDivision = document.querySelector("[data-session-division]");
const snapshotStream = document.querySelector("[data-session-stream]");
const snapshotStart = document.querySelector("[data-session-start]");
const badgeSize = document.querySelector("[data-session-size]");
const badgePresent = document.querySelector("[data-session-present]");
const badgeAbsent = document.querySelector("[data-session-absent]");

let currentSession = null;
let lastSessionDetails = null;
let teacherData = null;
let availableStreams = [];
let availableDivisions = [];

function handleError(error, fallback = "Something went wrong") {
  console.error(error);
  showToast({
    title: "Heads up",
    message: error.message || fallback,
    type: "danger",
  });
}

async function loadDashboard() {
  try {
    const data = await apiFetch("/api/teacher/dashboard");
    teacherData = data.teacherInfo || {};
    availableStreams = data.streams || [];
    availableDivisions = data.divisions || [];

    const summary = data?.summary || {};
    summarySessionsEl.textContent = summary.sessions ?? 0;
    summaryAverageEl.textContent = `${summary.averagePercentage ?? 0}%`;
    summaryPresentEl.textContent = summary.totalPresent ?? 0;
    renderRecentSessions(data?.recentSessions || []);

    // Populate dropdowns
    populateSubjectDropdown();
    populateStreamDropdown();
    populateDivisionDropdown();
  } catch (error) {
    handleError(error, "Unable to load dashboard");
  }
}

function populateSubjectDropdown() {
  const subjectDropdown = document.querySelector("#sessionSubject");
  if (!subjectDropdown || !teacherData?.subject) return;

  // Clear existing options except the first one
  while (subjectDropdown.options.length > 1) {
    subjectDropdown.remove(1);
  }

  // Add teacher's subject(s) - split by comma if multiple subjects
  const subjects = teacherData.subject.split(",").map((s) => s.trim());
  subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectDropdown.appendChild(option);
  });

  // Pre-select first subject if available
  if (subjects.length > 0) {
    subjectDropdown.value = subjects[0];
  }
}

function populateStreamDropdown() {
  const streamDropdown = document.querySelector("#sessionStream");
  if (!streamDropdown) return;

  // Clear existing options except the first one
  while (streamDropdown.options.length > 1) {
    streamDropdown.remove(1);
  }

  // Add all available streams
  availableStreams.forEach((stream) => {
    const option = document.createElement("option");
    option.value = stream;
    option.textContent = stream;
    streamDropdown.appendChild(option);
  });

  // Pre-select teacher's stream if available
  if (teacherData?.stream && availableStreams.includes(teacherData.stream)) {
    streamDropdown.value = teacherData.stream;
  }
}

function populateDivisionDropdown() {
  const divisionDropdown = document.querySelector("#sessionDivision");
  if (!divisionDropdown) return;

  // Clear existing options except the first one
  while (divisionDropdown.options.length > 1) {
    divisionDropdown.remove(1);
  }

  // Add all available divisions
  availableDivisions.forEach((division) => {
    const option = document.createElement("option");
    option.value = division;
    option.textContent = division;
    divisionDropdown.appendChild(option);
  });
}

function renderRecentSessions(sessions) {
  if (!recentBody) return;

  if (!sessions.length) {
    recentBody.innerHTML = `<tr><td colspan="6">No sessions recorded yet.</td></tr>`;
    return;
  }

  const rows = sessions
    .map((session) => {
      const present = session.present_count ?? 0;
      const absent = session.absent_count ?? 0;
      const total = present + absent;
      const percentage = total ? asPercentage(present, total) : "—";

      return `
        <tr>
          <td>${formatDateTime(session.started_at)}</td>
          <td>${session.subject || "—"}</td>
          <td>${session.division || "—"}</td>
          <td>${present}</td>
          <td>${absent}</td>
          <td>${percentage}</td>
        </tr>
      `;
    })
    .join("");

  recentBody.innerHTML = rows;
}

async function loadActivity() {
  try {
    const { activity } = await apiFetch("/api/teacher/activity");
    renderActivity(activity || []);
  } catch (error) {
    handleError(error, "Unable to load activity log");
  }
}

function formatActivityAction(action) {
  switch (action) {
    case "START_ATTENDANCE":
      return "Session started";
    case "END_ATTENDANCE":
      return "Session ended";
    case "MANUAL_OVERRIDE":
      return "Manual override";
    default:
      return action;
  }
}

function renderActivity(activity) {
  if (!activityBody) return;

  if (!activity.length) {
    activityBody.innerHTML = `<tr><td colspan="3">No activity yet.</td></tr>`;
    return;
  }

  const rows = activity
    .map((item) => {
      let meta = {};
      if (item.details) {
        try {
          meta = JSON.parse(item.details);
        } catch (error) {
          console.warn("Unable to parse activity details", error);
        }
      }

      const detailText = buildDetailText(item.action, meta);

      return `
        <tr>
          <td>${formatDateTime(item.created_at)}</td>
          <td>${formatActivityAction(item.action)}</td>
          <td>${detailText}</td>
        </tr>
      `;
    })
    .join("");

  activityBody.innerHTML = rows;
}

function buildDetailText(action, meta) {
  if (!meta || typeof meta !== "object") return "—";

  if (action === "START_ATTENDANCE") {
    return (
      [meta.subject, meta.stream, meta.division].filter(Boolean).join(" · ") ||
      "—"
    );
  }

  if (action === "END_ATTENDANCE") {
    const present = meta.present ?? 0;
    const absent = meta.absent ?? 0;
    const total = present + absent;
    const percentage = total ? asPercentage(present, total) : "—";
    return `${
      meta.subject || "Class"
    } • ${percentage} (${present} present/${absent} absent)`;
  }

  if (action === "MANUAL_OVERRIDE") {
    const status = meta.status === "P" ? "present" : "absent";
    const reason = meta.reason ? ` – ${meta.reason}` : "";
    return `Student ${meta.studentId || "—"} marked ${status}${reason}`;
  }

  return (
    Object.entries(meta)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ") || "—"
  );
}

function updateSnapshot(details) {
  snapshotSubject.textContent = details?.subject || "–";
  snapshotDivision.textContent = details?.division || "–";
  snapshotStream.textContent = details?.stream || "–";
  snapshotStart.textContent = details?.startedAt
    ? formatDateTime(details.startedAt)
    : "–";
}

function updateSessionBadges() {
  if (!currentSession) {
    badgeSize.textContent = "0 students";
    badgePresent.textContent = "0 present";
    badgeAbsent.textContent = "0 absent";
    return;
  }

  const total = currentSession.students.length;
  const present = currentSession.students.filter(
    (item) => item.status === "P"
  ).length;
  const absent = total - present;

  badgeSize.textContent = `${total} student${total === 1 ? "" : "s"}`;
  badgePresent.textContent = `${present} present`;
  badgeAbsent.textContent = `${absent} absent`;
}

function renderActiveSession() {
  if (!activeSection || !attendanceBody) return;

  if (!currentSession) {
    activeSection.style.display = "none";
    attendanceBody.innerHTML = `
      <tr>
        <td colspan="4">Tap "Start attendance" to begin.</td>
      </tr>
    `;
    updateSnapshot(null);
    updateSessionBadges();
    return;
  }

  activeSection.style.display = "block";
  updateSnapshot(currentSession);
  updateSessionBadges();

  const rows = currentSession.students
    .map(
      (student) => `
        <tr data-student="${student.id}">
          <td>${student.rollNo || "–"}</td>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>
            <button type="button" class="status-pill" data-toggle-status data-status="${
              student.status
            }" data-student="${student.id}">
              ${student.status === "P" ? "Present" : "Absent"}
            </button>
          </td>
        </tr>
      `
    )
    .join("");

  attendanceBody.innerHTML = rows;
}

function toggleStudentStatus(studentId) {
  if (!currentSession) return;

  const target = currentSession.students.find(
    (student) => student.id === studentId
  );
  if (!target) return;

  target.status = target.status === "P" ? "A" : "P";
  renderActiveSession();
}

function attachAttendanceEvents() {
  if (!attendanceBody) return;

  attendanceBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-toggle-status]");
    if (!button) return;

    const studentId = button.dataset.student;
    toggleStudentStatus(studentId);
  });
}

async function handleStartSession(event) {
  event.preventDefault();
  if (!sessionForm) return;

  if (currentSession) {
    showToast({
      title: "Session active",
      message: "End the current session before starting another.",
      type: "warning",
    });
    return;
  }

  const submitButton = sessionForm.querySelector('button[value="submit"]');
  const formData = new FormData(sessionForm);
  const payload = {
    subject: formData.get("subject")?.trim(),
    stream: formData.get("stream")?.trim(),
    division: formData.get("division")?.trim(),
  };

  if (!payload.subject || !payload.stream || !payload.division) {
    showToast({
      title: "Missing info",
      message: "Please fill subject, stream, and division.",
      type: "warning",
    });
    return;
  }

  try {
    toggleLoading(submitButton, true);
    const response = await apiFetch("/api/teacher/attendance/start", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const students = Array.isArray(response.students)
      ? response.students.map((student) => ({
          id: student.student_id,
          name: student.student_name,
          rollNo: student.roll_no,
          stream: student.stream,
          division: student.division,
          status: "P",
        }))
      : [];

    currentSession = {
      id: response.sessionId,
      subject: payload.subject,
      stream: payload.stream,
      division: payload.division,
      startedAt: new Date(),
      students,
    };

    lastSessionDetails = { ...payload };

    renderActiveSession();
    sessionForm.reset();
    sessionModal.close();

    showToast({
      title: "Session ready",
      message: "Attendance session started.",
      type: "success",
    });
  } catch (error) {
    handleError(error, "Unable to start attendance session");
  } finally {
    toggleLoading(submitButton, false);
  }
}

function exportAttendanceCsv(summary) {
  if (!currentSession) return;

  const header = ["Roll No", "Student ID", "Name", "Status"];
  const rows = currentSession.students.map((student) => [
    student.rollNo ?? "",
    student.id,
    student.name,
    student.status === "P" ? "Present" : "Absent",
  ]);

  const metaRows = [
    ["Session ID", currentSession.id],
    ["Subject", currentSession.subject],
    ["Stream", currentSession.stream],
    ["Division", currentSession.division],
    ["Started", formatDateTime(currentSession.startedAt)],
    ["Present", summary.present],
    ["Absent", summary.absent],
  ];

  const escape = (value) => {
    const str = value == null ? "" : String(value);
    if (str.includes(",") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    "Session metadata",
    ...metaRows.map((row) => row.map(escape).join(",")),
    "",
    header.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];

  const blob = new Blob([csvLines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const filename = `acadmark-attendance-${
    currentSession.subject || "session"
  }-${Date.now()}.csv`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

async function handleEndSession() {
  if (!currentSession) {
    showToast({
      title: "No active session",
      message: "Start a session before ending attendance.",
      type: "warning",
    });
    return;
  }

  try {
    toggleLoading(endSessionButton, true);
    const payload = {
      sessionId: currentSession.id,
      subject: currentSession.subject,
      stream: currentSession.stream,
      division: currentSession.division,
      attendance: currentSession.students.map((student) => ({
        studentId: student.id,
        status: student.status,
      })),
    };

    const response = await apiFetch("/api/teacher/attendance/end", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    exportAttendanceCsv(response.summary || { present: 0, absent: 0 });

    showToast({
      title: "Attendance saved",
      message: "Session closed and report downloaded.",
      type: "success",
    });

    currentSession = null;
    renderActiveSession();
    loadDashboard();
    loadActivity();
  } catch (error) {
    handleError(error, "Unable to end attendance session");
  } finally {
    toggleLoading(endSessionButton, false);
  }
}

async function handleManualOverride(event) {
  event.preventDefault();
  if (!manualForm) return;

  const submitButton = manualForm.querySelector('button[value="submit"]');
  const formData = new FormData(manualForm);
  const payload = {
    studentId: formData.get("studentId")?.trim(),
    status: formData.get("status"),
    reason: formData.get("reason")?.trim(),
  };

  if (!payload.studentId || !payload.status) {
    showToast({
      title: "Missing info",
      message: "Student ID and status are required.",
      type: "warning",
    });
    return;
  }

  try {
    toggleLoading(submitButton, true);
    await apiFetch("/api/teacher/attendance/manual", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (currentSession) {
      const student = currentSession.students.find(
        (item) => item.id === payload.studentId
      );
      if (student) {
        student.status = payload.status === "P" ? "P" : "A";
        renderActiveSession();
      }
    }

    showToast({
      title: "Override saved",
      message: "Manual attendance override recorded.",
      type: "success",
    });

    manualForm.reset();
    manualModal.close();
    loadActivity();
  } catch (error) {
    handleError(error, "Unable to save manual override");
  } finally {
    toggleLoading(submitButton, false);
  }
}

function initDialogs() {
  if (startSessionButton && sessionModal && sessionForm) {
    startSessionButton.addEventListener("click", () => {
      if (currentSession) {
        showToast({
          title: "Session active",
          message: "End the current session before starting another.",
          type: "warning",
        });
        return;
      }

      sessionForm.reset();

      // Re-populate dropdowns after reset
      populateSubjectDropdown();
      populateStreamDropdown();
      populateDivisionDropdown();

      // Pre-fill with teacher's stream
      if (teacherData?.stream) {
        sessionForm.querySelector("#sessionStream").value = teacherData.stream;
      }

      // Restore last session details if available
      if (lastSessionDetails) {
        if (lastSessionDetails.subject) {
          sessionForm.querySelector("#sessionSubject").value =
            lastSessionDetails.subject;
        }
        if (lastSessionDetails.stream) {
          sessionForm.querySelector("#sessionStream").value =
            lastSessionDetails.stream;
        }
        if (lastSessionDetails.division) {
          sessionForm.querySelector("#sessionDivision").value =
            lastSessionDetails.division;
        }
      }

      sessionModal.showModal();
    });

    sessionForm.addEventListener("submit", handleStartSession);

    // Handle cancel button
    const cancelSessionButton = sessionModal.querySelector(
      "[data-cancel-session]"
    );
    if (cancelSessionButton) {
      cancelSessionButton.addEventListener("click", () => {
        sessionModal.close();
      });
    }
  }

  if (manualButton && manualModal && manualForm) {
    manualButton.addEventListener("click", () => {
      manualForm.reset();
      manualModal.showModal();
    });

    manualForm.addEventListener("submit", handleManualOverride);

    // Handle cancel button
    const cancelManualButton = manualModal.querySelector(
      "[data-cancel-manual]"
    );
    if (cancelManualButton) {
      cancelManualButton.addEventListener("click", () => {
        manualModal.close();
      });
    }
  }
}

function initControls() {
  refreshButton?.addEventListener("click", loadDashboard);
  refreshActivityButton?.addEventListener("click", loadActivity);
  endSessionButton?.addEventListener("click", handleEndSession);

  signoutButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      handleError(error, "Unable to sign out");
    }
  });
}

function bootstrap() {
  renderActiveSession();
  attachAttendanceEvents();
  initDialogs();
  initControls();
  loadDashboard();
  loadActivity();
}

bootstrap();
