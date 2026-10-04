import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const courses = [
  { code: "CSE 310", title: "Artificial Intelligence", teacher: "Dr. Rahman", department: "Department of Computer Science & Engineering", credits: 3, progress: 72 },
  { code: "CSE 320", title: "Database Management", teacher: "Prof. Karim", department: "Department of Computer Science & Engineering", credits: 3, progress: 84 },
  { code: "CSE 330", title: "Data Visualization", teacher: "Dr. Ahmed", department: "Department of Computer Science & Engineering", credits: 3, progress: 65 },
  { code: "CSE 340", title: "Software Engineering", teacher: "Prof. Hasan", department: "Department of Computer Science & Engineering", credits: 3, progress: 91 },
];

const teachers = [
  ...courses.map(({ teacher, department }) => ({ name: teacher, department })),
  { name: "Tawsifur Rahman", department: "Department of Electrical & Electronics Engineering" },
  { name: "Zerin Tasnim Ahmed Mahi", department: "Department of Business Administration" },
];

const assignments = [
  {
    title: "AI Search Algorithm",
    course: "Artificial Intelligence",
    due: "Oct 8, 2026",
    status: "Pending",
  },
  {
    title: "Database Design",
    course: "Database Management",
    due: "Oct 11, 2026",
    status: "Submitted",
  },
  {
    title: "Visualization Project",
    course: "Data Visualization",
    due: "Oct 15, 2026",
    status: "Pending",
  },
];

const notices = [
  {
    title: "Midterm Examination Schedule",
    date: "Oct 2, 2026",
    text: "The midterm examination schedule has been published.",
  },
  {
    title: "University Bus Schedule",
    date: "Oct 1, 2026",
    text: "Updated transportation schedules are now available.",
  },
  {
    title: "Tuition Fee Payment",
    date: "Sep 29, 2026",
    text: "Students are requested to complete their semester payments.",
  },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [dark, setDark] = useState(false);

  const menu = [
    ["Dashboard", "⌂"],
    ["Courses", "▣"],
    ["Assignments", "✓"],
    ["Payments", "৳"],
    ["Attendance", "◷"],
    ["Results", "▤"],
    ["Notices", "◉"],
    ["Resources", "▱"],
    ["Quiz", "✎"],
    ["Bus Tracking", "🚌"],
    ["AI Assistant", "✦"],
  ];

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">MU</div>
          <div>
            <h2>Smart University</h2>
            <span>Metropolitan University</span>
          </div>
        </div>

        <div className="profile-mini">
          <div className="avatar">MK</div>
          <div>
            <strong>Student</strong>
            <span>ID: 241-115-169</span>
          </div>
        </div>

        <nav>
          {menu.map(([name, icon]) => (
            <button
              key={name}
              className={active === name ? "nav-item active" : "nav-item"}
              onClick={() => setActive(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setDark(!dark)}>
            <span>{dark ? "☀" : "☾"}</span>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{active}</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>

          <div className="top-actions">
            <button className="icon-button">🔔</button>
            <div className="top-profile">
              <div className="avatar small">MK</div>
              <div>
                <strong>Student</strong>
                <span>Computer Science</span>
              </div>
            </div>
          </div>
        </header>

        {active === "Dashboard" && <Dashboard setActive={setActive} />}
        {active === "Courses" && <Courses />}
        {active === "Assignments" && <Assignments />}
        {active === "Payments" && <Payments />}
        {active === "Attendance" && <Attendance />}
        {active === "Results" && <Results />}
        {active === "Notices" && <Notices />}
        {active === "Resources" && <Resources />}
        {active === "Quiz" && <Quiz />}
        {active === "Bus Tracking" && <Bus />}
        {active === "AI Assistant" && <Assistant />}
      </main>
    </div>
  );
}

function Dashboard({ setActive }) {
  return (
    <>
      <section className="welcome-card">
        <div>
          <span className="eyebrow">THURSDAY, OCTOBER 3, 2026</span>
          <h2>Good afternoon, Student 👋</h2>
          <p>
            Keep track of your courses, assignments, attendance and university
            activities from one place.
          </p>
        </div>
        <div className="welcome-icon">🎓</div>
      </section>

      <section className="stats-grid">
        <Stat icon="📚" title="Enrolled Courses" value="6" />
        <Stat icon="📝" title="Assignments" value="8" />
        <Stat icon="◷" title="Attendance" value="87%" />
        <Stat icon="💳" title="Due Payment" value="৳12,500" />
      </section>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>My Courses</h3>
              <span>Current semester</span>
            </div>
            <button onClick={() => setActive("Courses")}>View All</button>
          </div>

          <div className="course-list">
            {courses.slice(0, 3).map((course) => (
              <div className="course-row" key={course.code}>
                <div className="course-icon">📘</div>
                <div className="course-info">
                  <strong>{course.code}</strong>
                  <span>{course.title}</span>
                </div>
                <div className="progress-box">
                  <span>{course.progress}%</span>
                  <div className="progress">
                    <div style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3>Upcoming Assignments</h3>
              <span>Don't miss your deadlines</span>
            </div>
            <button onClick={() => setActive("Assignments")}>View All</button>
          </div>

          {assignments.slice(0, 3).map((item) => (
            <div className="assignment-row" key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.course}</span>
              </div>
              <div className="assignment-date">
                <span>{item.due}</span>
                <small className={item.status === "Submitted" ? "success" : "warning"}>
                  {item.status}
                </small>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Recent Notices</h3>
              <span>University announcements</span>
            </div>
            <button onClick={() => setActive("Notices")}>View All</button>
          </div>

          {notices.map((notice) => (
            <div className="notice-row" key={notice.title}>
              <div className="notice-dot" />
              <div>
                <strong>{notice.title}</strong>
                <span>{notice.text}</span>
                <small>{notice.date}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="card quick-card">
          <h3>Quick Actions</h3>

          <div className="quick-grid">
            <button onClick={() => setActive("Payments")}>💳<span>Pay Fees</span></button>
            <button onClick={() => setActive("Assignments")}>📝<span>Assignments</span></button>
            <button onClick={() => setActive("Results")}>📊<span>View Results</span></button>
            <button onClick={() => setActive("AI Assistant")}>✦<span>Ask AI</span></button>
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Courses() {
  return (
    <div>
      <div className="page-intro">
        <h2>My Courses</h2>
        <p>Your enrolled courses for the current semester.</p>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.code}>
            <div className="course-card-top">
              <span>{course.code}</span>
              <b>{course.credits} Credits</b>
            </div>

            <h3>{course.title}</h3>
            <p>{course.teacher}</p>

            <div className="course-progress">
              <div>
                <span>Course Progress</span>
                <strong>{course.progress}%</strong>
              </div>
              <div className="progress">
                <div style={{ width: `${course.progress}%` }} />
              </div>
            </div>

            <button className="outline-button">Open Course</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Assignments() {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [coverType, setCoverType] = useState(null);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    section: "",
    department: "",
    batch: "",
    courseCode: courses[0].code,
    teacherName: "",
    teacherDepartment: "",
  });
  const [groupMembers, setGroupMembers] = useState([{ name: "", studentId: "" }]);

  const selectedCourse = courses.find((course) => course.code === form.courseCode);
  const teacherNames = [...new Set(teachers.map((teacher) => teacher.name))];
  const matchingTeachers = teachers.filter((teacher) => teacher.name === form.teacherName);
  const teacherDepartmentChoices = [...new Set(matchingTeachers.map((teacher) => teacher.department))];
  const isGroup = coverType === "group";
  const members = isGroup ? groupMembers : [form];
  const membersAreComplete =
    members.length > 0 &&
    members.every((member) => member.name.trim() && member.studentId.trim()) &&
    (!isGroup || members.length >= 2);
  const canPrint =
    membersAreComplete &&
    form.section.trim() &&
    form.department.trim() &&
    form.batch.trim() &&
    selectedCourse &&
    form.teacherName &&
    form.teacherDepartment;

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectTeacher(name) {
    const departments = [...new Set(teachers.filter((teacher) => teacher.name === name).map((teacher) => teacher.department))];
    updateForm("teacherName", name);
    updateForm("teacherDepartment", departments.length === 1 ? departments[0] : "");
  }

  function openAssignment(assignment) {
    const course = courses.find((item) => item.title === assignment.course);
    const courseTeacherDepartments = [...new Set(teachers.filter((teacher) => teacher.name === course?.teacher).map((teacher) => teacher.department))];
    setSelectedAssignment(assignment);
    setCoverType(null);
    setForm((current) => ({
      ...current,
      courseCode: course?.code || current.courseCode,
      teacherName: course?.teacher || current.teacherName,
      teacherDepartment: courseTeacherDepartments.length === 1 ? courseTeacherDepartments[0] : "",
    }));
  }

  function closeAssignment() {
    setSelectedAssignment(null);
    setCoverType(null);
  }

  if (selectedAssignment && !coverType) {
    return (
      <div className="card assignment-detail">
        <button className="back-button" onClick={closeAssignment}>← Back to assignments</button>
        <div className="page-intro">
          <span className="eyebrow assignment-eyebrow">ASSIGNMENT</span>
          <h2>{selectedAssignment.title}</h2>
          <p>{selectedAssignment.course} · Due {selectedAssignment.due}</p>
        </div>
        <h3 className="cover-choice-heading">Choose a cover page</h3>
        <p className="cover-choice-copy">Select the cover page format you want to prepare.</p>
        <div className="cover-choice-grid">
          <button className="cover-choice" onClick={() => setCoverType("individual")}>
            <span className="cover-choice-icon">👤</span>
            <strong>Individual cover page</strong>
            <span>Prepare a cover page for one student.</span>
          </button>
          <button className="cover-choice" onClick={() => setCoverType("group")}>
            <span className="cover-choice-icon">👥</span>
            <strong>Group cover page</strong>
            <span>Add the names and IDs of your group members.</span>
          </button>
        </div>
      </div>
    );
  }

  if (selectedAssignment && coverType) {
    return (
      <div className="cover-workspace">
        <section className="card cover-form-card">
          <button className="back-button" onClick={() => setCoverType(null)}>← Choose cover type</button>
          <div className="page-intro">
            <span className="eyebrow assignment-eyebrow">{isGroup ? "GROUP" : "INDIVIDUAL"} COVER PAGE</span>
            <h2>Enter submission details</h2>
            <p>Complete the details below. The submission date is added automatically.</p>
          </div>

          <div className="cover-form">
            {isGroup ? (
              <div className="cover-field full-width">
                <div className="group-member-heading">
                  <span>Group members</span>
                  <button
                    type="button"
                    className="add-member-button"
                    onClick={() => setGroupMembers((current) => [...current, { name: "", studentId: "" }])}
                  >
                    + Add member
                  </button>
                </div>
                {groupMembers.map((member, index) => (
                  <div className="group-member-fields" key={index}>
                    <label>
                      Name
                      <input
                        required
                        value={member.name}
                        onChange={(event) => setGroupMembers((current) =>
                          current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item)
                        )}
                        placeholder={`Member ${index + 1} name`}
                      />
                    </label>
                    <label>
                      Student ID
                      <input
                        required
                        value={member.studentId}
                        onChange={(event) => setGroupMembers((current) =>
                          current.map((item, itemIndex) => itemIndex === index ? { ...item, studentId: event.target.value } : item)
                        )}
                        placeholder="Enter student ID"
                      />
                    </label>
                    {groupMembers.length > 1 && (
                      <button
                        type="button"
                        className="remove-member-button"
                        aria-label={`Remove member ${index + 1}`}
                        onClick={() => setGroupMembers((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <label>
                  Name
                  <input required value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Enter your name" />
                </label>
                <label>
                  Student ID
                  <input required value={form.studentId} onChange={(event) => updateForm("studentId", event.target.value)} placeholder="Enter your student ID" />
                </label>
              </>
            )}

            <label>
              Section
              <input required value={form.section} onChange={(event) => updateForm("section", event.target.value)} placeholder="Enter your section" />
            </label>
            <label>
              Department
              <input required value={form.department} onChange={(event) => updateForm("department", event.target.value)} placeholder="Enter your department" />
            </label>
            <label>
              Batch
              <input required value={form.batch} onChange={(event) => updateForm("batch", event.target.value)} placeholder="Enter your batch" />
            </label>
            <label>
              Course
              <select
                required
                value={form.courseCode}
                onChange={(event) => {
                  const course = courses.find((item) => item.code === event.target.value);
                  const departments = [...new Set(teachers.filter((teacher) => teacher.name === course?.teacher).map((teacher) => teacher.department))];
                  setForm((current) => ({
                    ...current,
                    courseCode: event.target.value,
                    teacherName: course?.teacher || current.teacherName,
                    teacherDepartment: departments.length === 1 ? departments[0] : "",
                  }));
                }}
              >
                {courses.map((course) => (
                  <option key={course.code} value={course.code}>{course.title} ({course.code})</option>
                ))}
              </select>
            </label>
            <label>
              Teacher name
              <select required value={form.teacherName} onChange={(event) => selectTeacher(event.target.value)}>
                <option value="">Select a teacher</option>
                {teacherNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            {teacherDepartmentChoices.length > 1 ? (
              <label>
                Teacher department
                <select required value={form.teacherDepartment} onChange={(event) => updateForm("teacherDepartment", event.target.value)}>
                  <option value="">Select the teacher's department</option>
                  {teacherDepartmentChoices.map((department) => <option key={department} value={department}>{department}</option>)}
                </select>
              </label>
            ) : (
              <label>
                Teacher department
                <input readOnly value={form.teacherDepartment} placeholder="Automatically added when you select a teacher" />
              </label>
            )}
          </div>

          <div className="cover-form-actions">
            <span>Submission date: {new Date().toLocaleDateString("en-GB")}</span>
            <button className="primary-button" disabled={!canPrint} onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </div>
          {!canPrint && <p className="form-hint">Fill in all required details{isGroup ? " and add at least two group members" : ""} to print the cover page.</p>}
        </section>

        <section className="cover-preview-panel">
          <div className="cover-preview-heading">
            <div>
              <h3>Cover page preview</h3>
              <span>Print-ready US Letter layout</span>
            </div>
          </div>
          <article className="cover-page" id="assignment-cover">
            <img className="cover-logo" src="/university-logo.png" alt="Metropolitan University" />
            <div className="cover-course-block">
              <p><strong>Course Name:</strong> {selectedCourse?.title || " "}</p>
              <p><strong>Course Code:</strong> {selectedCourse?.code || " "}</p>
              <p><strong>Assignment on:</strong> {selectedAssignment.title}</p>
            </div>
            <div className="cover-submission-block">
              <strong>Submitted to</strong>
              <p>{form.teacherName || " "}</p>
              <p>{form.teacherDepartment || " "}</p>
              <p>Metropolitan University, Sylhet</p>
            </div>
            <div className="cover-submission-block submitted-by">
              <strong>Submitted by</strong>
              {members.map((member, index) => (
                <p key={index}>{member.name || " "} {isGroup && member.studentId ? `(ID: ${member.studentId})` : ""}</p>
              ))}
              {!isGroup && <p>ID: {form.studentId || " "}</p>}
              <p>Batch: {form.batch || " "}</p>
              <p>Section: {form.section || " "}</p>
              <p>{form.department || " "}</p>
              <p>Metropolitan University, Sylhet</p>
            </div>
            <div className="cover-date-block">
              <strong>Date of Submission</strong>
              <p>{new Date().toLocaleDateString("en-GB")}</p>
            </div>
          </article>
        </section>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Assignments</h3>
          <span>Open an assignment to prepare its cover page</span>
        </div>
      </div>

      <div className="table">
        <div className="table-head">
          <span>Assignment</span>
          <span>Course</span>
          <span>Due Date</span>
          <span>Status</span>
        </div>

        {assignments.map((a) => (
          <div className="table-row" key={a.title}>
            <strong>{a.title}</strong>
            <span>{a.course}</span>
            <span>{a.due}</span>
            <div className="assignment-row-actions">
              <span className={a.status === "Submitted" ? "badge success" : "badge warning"}>{a.status}</span>
              <button className="open-assignment-button" onClick={() => openAssignment(a)}>Open assignment →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Payments() {
  return (
    <>
      <div className="stats-grid">
        <Stat icon="💰" title="Semester Fee" value="৳45,000" />
        <Stat icon="✓" title="Paid" value="৳32,500" />
        <Stat icon="!" title="Remaining" value="৳12,500" />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3>Payment History</h3>
            <span>Your recent university payments</span>
          </div>
          <button className="primary-button">Make Payment</button>
        </div>

        <div className="table">
          {[
            ["Semester Fee", "৳20,000", "Sep 15, 2026", "SUCCESS"],
            ["Tuition Fee", "৳12,500", "Aug 20, 2026", "SUCCESS"],
            ["Registration", "৳5,000", "Aug 5, 2026", "SUCCESS"],
          ].map((p) => (
            <div className="table-row" key={p[0]}>
              <strong>{p[0]}</strong>
              <span>{p[1]}</span>
              <span>{p[2]}</span>
              <span className="badge success">{p[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Attendance() {
  const data = [
    ["Artificial Intelligence", "92%", "Excellent"],
    ["Database Management", "88%", "Good"],
    ["Data Visualization", "81%", "Good"],
    ["Software Engineering", "95%", "Excellent"],
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Attendance</h3>
          <span>Current semester attendance</span>
        </div>
      </div>

      {data.map((item) => (
        <div className="attendance-row" key={item[0]}>
          <div>
            <strong>{item[0]}</strong>
            <span>{item[2]}</span>
          </div>

          <div className="attendance-progress">
            <div className="progress">
              <div style={{ width: item[1] }} />
            </div>
            <strong>{item[1]}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

function Results() {
  const results = [
    ["Artificial Intelligence", "A", "4.00", "3"],
    ["Database Management", "A-", "3.70", "3"],
    ["Data Visualization", "B+", "3.30", "3"],
    ["Software Engineering", "A", "4.00", "3"],
  ];

  return (
    <>
      <div className="result-summary">
        <div>
          <span>Current CGPA</span>
          <strong>3.72</strong>
        </div>
        <div>
          <span>Completed Credits</span>
          <strong>87</strong>
        </div>
        <div>
          <span>Semester</span>
          <strong>8th</strong>
        </div>
      </div>

      <div className="card">
        <h3>Academic Results</h3>

        <div className="table">
          <div className="table-head">
            <span>Course</span>
            <span>Grade</span>
            <span>Grade Point</span>
            <span>Credits</span>
          </div>

          {results.map((r) => (
            <div className="table-row" key={r[0]}>
              <strong>{r[0]}</strong>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span>{r[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Notices() {
  return (
    <div className="notice-grid">
      {notices.map((n) => (
        <div className="card notice-card" key={n.title}>
          <span className="notice-date">{n.date}</span>
          <h3>{n.title}</h3>
          <p>{n.text}</p>
          <button className="outline-button">Read Notice</button>
        </div>
      ))}
    </div>
  );
}

function Resources() {
  const resources = [
    ["📄", "AI Lecture Notes", "Artificial Intelligence"],
    ["📊", "Database ER Diagram", "Database Management"],
    ["📚", "Software Engineering Book", "Software Engineering"],
    ["🎥", "Data Visualization Lecture", "Data Visualization"],
  ];

  return (
    <div className="resource-grid">
      {resources.map((r) => (
        <div className="card resource-card" key={r[1]}>
          <div className="resource-icon">{r[0]}</div>
          <h3>{r[1]}</h3>
          <span>{r[2]}</span>
          <button className="outline-button">Open Resource</button>
        </div>
      ))}
    </div>
  );
}

function Quiz() {
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <span className="eyebrow">PRACTICE QUIZ</span>
        <h2>Artificial Intelligence</h2>
        <p>Test your knowledge with AI-generated and instructor-created questions.</p>

        <div className="quiz-stats">
          <div>
            <strong>10</strong>
            <span>Questions</span>
          </div>
          <div>
            <strong>15</strong>
            <span>Minutes</span>
          </div>
          <div>
            <strong>100</strong>
            <span>Marks</span>
          </div>
        </div>

        <button className="primary-button">Start Quiz</button>
      </div>
    </div>
  );
}

function Bus() {
  return (
    <div className="bus-page">
      <div className="card bus-info">
        <div>
          <span className="eyebrow">LIVE TRANSPORT</span>
          <h2>University Bus Tracking</h2>
          <p>Track university transportation in real time.</p>
        </div>

        <div className="bus-status">
          <span className="live-dot" />
          LIVE
        </div>
      </div>

      <div className="fake-map">
        <div className="map-grid" />
        <div className="map-route">
          <div className="bus-marker">🚌</div>
        </div>
        <div className="map-label start">University</div>
        <div className="map-label end">Amberkhana</div>
      </div>
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hello! I'm your Smart University assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { from: "user", text: input },
      {
        from: "ai",
        text: "This is the frontend prototype. The real AI assistant will be connected to the backend later.",
      },
    ]);

    setInput("");
  }

  return (
    <div className="assistant">
      <div className="card chat-card">
        <div className="chat-header">
          <div className="assistant-avatar">✦</div>
          <div>
            <h3>Smart University AI</h3>
            <span>Online Assistant</span>
          </div>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <div className={m.from === "ai" ? "message ai" : "message user"} key={i}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about courses, payments, results..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);