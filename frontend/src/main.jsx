import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const courses = [
  { code: "CSE 310", title: "Artificial Intelligence", teacher: "Dr. Rahman", credits: 3, progress: 72 },
  { code: "CSE 320", title: "Database Management", teacher: "Prof. Karim", credits: 3, progress: 84 },
  { code: "CSE 330", title: "Data Visualization", teacher: "Dr. Ahmed", credits: 3, progress: 65 },
  { code: "CSE 340", title: "Software Engineering", teacher: "Prof. Hasan", credits: 3, progress: 91 },
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
        <header className={active === "Bus Tracking" ? "topbar bus-topbar" : "topbar"}>
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
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Assignments</h3>
          <span>Track your coursework</span>
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
            <span className={a.status === "Submitted" ? "badge success" : "badge warning"}>
              {a.status}
            </span>
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
  const [updatedAt, setUpdatedAt] = useState(null);
  const stops = [
    { name: "Main Gate", x: 82, y: 274 },
    { name: "Faculty Building", x: 300, y: 174 },
    { name: "Library", x: 510, y: 98 },
  ];

  return (
    <div className="bus-page">
      <div className="bus-page-heading">
        <div>
          <span className="bus-kicker">CAMPUS TRANSPORT</span>
          <h1>Bus Tracker</h1>
          <p>See your route, stops, and the demo vehicle location.</p>
        </div>
        <button
          className="bus-refresh"
          onClick={() => setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}
        >
          <span aria-hidden="true">↻</span>
          Refresh
        </button>
      </div>

      <section className="bus-summary" aria-label="Vehicle and route summary">
        <div className="bus-summary-card">
          <span className="bus-summary-icon">▣</span>
          <div><small>VEHICLE</small><strong>Bus A1</strong></div>
        </div>
        <div className="bus-summary-card">
          <span className="bus-summary-icon">⌘</span>
          <div><small>ROUTE</small><strong>Academic Loop</strong></div>
        </div>
        <div className="bus-summary-card">
          <span className="bus-summary-icon">⌖</span>
          <div><small>STOPS</small><strong>3 stops</strong></div>
        </div>
        <div className="bus-summary-card">
          <span className="feed-dot" />
          <div><small>LOCATION FEED</small><strong>Demo preview</strong></div>
        </div>
      </section>

      <div className="bus-content-grid">
        <section className="bus-map-card">
          <div className="bus-map-heading">
            <div>
              <span className="map-status"><span /> CAMPUS ROUTE</span>
              <h2>Academic Loop</h2>
            </div>
            <span className="demo-gps">▥ &nbsp;DEMO GPS</span>
          </div>
          <div className="campus-map" role="img" aria-label="Illustrated Academic Loop map from Main Gate to Faculty Building to Library">
            <svg viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true">
              <rect width="600" height="320" fill="#edf7f4" />
              <path d="M0 46 C82 79 118 42 196 62 S333 103 421 53 S537 34 600 52 L600 0 0 0Z" fill="#dff2ef" />
              <path d="M0 292 C99 252 143 304 246 276 S410 242 600 293 L600 320 0 320Z" fill="#e2f2ee" />
              <g fill="#d9eae3" stroke="#d1e4dc">
                <rect x="78" y="66" width="52" height="29" rx="8" />
                <rect x="344" y="63" width="60" height="30" rx="8" />
                <rect x="226" y="172" width="52" height="30" rx="8" />
                <rect x="474" y="198" width="57" height="34" rx="9" />
                <rect x="218" y="260" width="48" height="26" rx="8" />
                <rect x="320" y="247" width="64" height="34" rx="9" />
              </g>
              <g fill="none" stroke="#fff" strokeWidth="17" strokeLinecap="round">
                <path d="M38 -12 C92 72 52 132 110 202 S146 282 111 337" />
                <path d="M434 -20 C393 58 458 108 425 185 S433 269 499 337" />
                <path d="M-12 148 C91 127 156 157 238 135 S397 153 612 100" />
                <path d="M-10 306 C105 272 166 310 257 285 S421 268 612 314" />
              </g>
              <g fill="none" stroke="#d9e7e4" strokeWidth="2" strokeDasharray="7 8">
                <path d="M-12 148 C91 127 156 157 238 135 S397 153 612 100" />
                <path d="M-10 306 C105 272 166 310 257 285 S421 268 612 314" />
              </g>
              <path d="M82 274 C150 243 220 211 300 174 S430 127 510 98" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
              <path d="M82 274 C150 243 220 211 300 174 S430 127 510 98" fill="none" stroke="#159c91" strokeWidth="6" strokeLinecap="round" />
              <path d="M300 174 C370 147 436 119 510 98" fill="none" stroke="#2387e8" strokeWidth="6" strokeLinecap="round" />
              {stops.map((stop, index) => (
                <g key={stop.name}>
                  <circle cx={stop.x} cy={stop.y} r="8" fill="white" stroke="#1ba47f" strokeWidth="4" />
                  <circle cx={stop.x} cy={stop.y} r="2.5" fill="#1ba47f" />
                  {index < 2 && <text x={stop.x} y={stop.y + 25} textAnchor="middle" className="map-stop-label">{stop.name}</text>}
                  {index === 2 && <text x={stop.x - 2} y={stop.y - 18} textAnchor="end" className="map-building-label">Library</text>}
                </g>
              ))}
              <g transform="translate(340 158)">
                <circle r="15" fill="#2387e8" opacity=".16" />
                <circle r="11" fill="#fff" />
                <circle r="9" fill="#2387e8" />
                <text y="4" textAnchor="middle" className="map-bus-icon">▰</text>
              </g>
              <g transform="translate(555 45)">
                <circle r="16" fill="#fff" />
                <path d="M0 -10 4 2 0 0 -4 2Z" fill="#24516a" />
                <text y="27" textAnchor="middle" className="map-north">N</text>
              </g>
            </svg>
          </div>
          <div className="map-caption">
            <span><i className="legend-route" /> Academic Loop</span>
            <span><i className="legend-bus" /> Demo vehicle position</span>
            <span>Updated {updatedAt || "just now"}</span>
          </div>
        </section>

        <aside className="bus-sidebar">
          <section className="next-stop-card">
            <span className="next-stop-icon">➤</span>
            <small>NEXT STOP</small>
            <h2>Library</h2>
            <p>Bus A1 · Academic Loop</p>
            <span className="demo-location-pill">Demo location only</span>
          </section>

          <section className="route-stops-card">
            <div className="route-stops-heading">
              <h3>Route stops</h3><span>3</span>
            </div>
            <ol className="route-stop-list">
              {stops.map((stop, index) => (
                <li className={index < 2 ? "stop-complete" : "stop-next"} key={stop.name}>
                  <span className="stop-marker">{index < 2 ? "✓" : "3"}</span>
                  <span>{stop.name}</span>
                  {index === 2 && <small>Next</small>}
                </li>
              ))}
            </ol>
          </section>
          <p className="bus-demo-note">This is a sample route preview, not live GPS tracking.</p>
        </aside>
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