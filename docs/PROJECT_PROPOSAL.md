# Project Proposal
## METSOL — Smart University Student Portal

**Project category:** Web-based University Management and Student Services Platform  
**Repository:** https://github.com/mashrafianam99/metsol  
**Prepared:** 30 October 2026  
**Status:** Proposal based on the current repository implementation

## 1. Introduction
Universities manage student profiles, courses, assignments, attendance, examination results, notices, fees, and communication. When these activities are handled through disconnected systems or manual processes, students and staff can experience delays, duplicated work, inconsistent information, and limited access to timely updates.

METSOL is a Smart University Student Portal designed to bring important academic and student-service activities into a single web-based platform. It provides role-oriented workspaces for Students, Teachers, and Administrators. The current implementation uses a React frontend, Node.js and Express backend, PostgreSQL through Prisma ORM, and Supabase authentication.

The portal also contains an AI-powered learning assistant and integration points for external services such as Google Classroom and mobile financial services. Some integrations require institutional or provider credentials before production use.

## 2. Problem Statement
University information and workflows can be fragmented across paper records, spreadsheets, messaging groups, and separate digital tools. This can make it difficult to find accurate academic information, track assignments and results, coordinate teaching activities, manage student records, and provide timely learning support.

A unified portal is proposed to simplify access, improve coordination, and provide a foundation for more efficient university services.

## 3. Aim
To design and develop a secure, responsive, role-based university portal that centralizes academic information and selected student services for students, teachers, and administrators.

## 4. Objectives
1. Provide a centralized portal with distinct Student, Teacher, and Admin roles.
2. Support authenticated access and role-based authorization.
3. Present personalized dashboards with relevant academic information.
4. Organize courses, course enrollment, assignments, submissions, and academic activities.
5. Provide access to attendance and examination-result information.
6. Support result PDF preview and import for administrators, subject to supported PDF layouts.
7. Provide tools for notices, academic resources, question banks, and study activities.
8. Include an AI learning assistant for educational questions and supported document assistance.
9. Provide fee invoices and payment-record workflows, with gateway confirmation required for actual payment success.
10. Establish integration points for Google Classroom and other external services.
11. Apply security, validation, responsive design, and maintainable software architecture.

## 5. Proposed System and Main Features

### 5.1 Student workspace
The student workspace is intended to provide access to:
- Personal dashboard and profile.
- Course list and registration information.
- Assignments and submission status.
- Results, GPA/CGPA information, and transcript-related views.
- Attendance information.
- Class and examination routines.
- Notices, academic calendar, and notifications.
- Study hub, learning resources, question bank, and study planner.
- EduAI learning assistant and supported document Q&A.
- Transport, hostel, library, digital student ID, and helpdesk information.
- Fee invoices, payment history, and payment status.

### 5.2 Teacher workspace
The teacher workspace supports relevant teaching activities, including teacher dashboard and profile, course and student-related information, assignment and submission workflows, academic communication, and teaching resources. Exact capabilities depend on the permissions and workflows implemented in the application.

### 5.3 Administrator workspace
The administrator workspace is intended for user and role management, course and academic information management, notice management, result PDF preview and import, student academic record administration, fee and payment record oversight, and administrative monitoring.

### 5.4 AI learning assistance
The portal includes EduAI functionality backed by a Groq-compatible API integration. Supported document uploads include PDF, DOCX, and TXT, subject to configured limits. The current README describes document extraction in backend memory rather than persistent document storage. Without a configured AI key, the application uses a clearly labelled demo fallback.

### 5.5 External integrations
The codebase contains integration points for Supabase Auth, Google Classroom OAuth and assignment synchronization, bKash/Nagad payment workflows, external transport/GPS data, and email/SMS/push notifications. These are not all production-ready by default. Google OAuth requires valid Google Cloud credentials; payment success must be confirmed through a verified gateway callback; live transport and notifications require provider configuration.

## 6. Project Scope

### In scope
- Browser-based, responsive university portal.
- Student, Teacher, and Administrator roles.
- Authentication and role-based authorization.
- Academic dashboards and core academic workflows.
- Course, assignment, result, attendance, notice, and fee-related features.
- AI learning support and supported document processing.
- Integration-ready architecture for external providers.
- Database-backed application data and API services.

### Out of scope for the current proposal
- Replacing the university's official student information system unless formally approved.
- Guaranteeing integration with every university legacy system.
- Live GPS tracking without a real device/provider feed.
- Actual bKash/Nagad settlement without merchant credentials and verified gateway integration.
- Google Classroom production use without OAuth configuration and review.
- OCR processing of scanned/image-only result PDFs unless an OCR service is added.
- Native Android/iOS applications; the current product is a web application.

## 7. Technology Stack

| Layer | Proposed/current technology |
|---|---|
| Frontend | React 19, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Supabase Auth, verified access tokens |
| AI service | Groq-compatible API |
| Document extraction | PDF.js, Mammoth and text processing |
| External classroom integration | Google OAuth and Google Classroom API |
| Security middleware | Helmet, CORS, Express Rate Limit |
| Development tools | npm, Git, GitHub, VS Code |

The architecture separates the browser interface, API/business logic, database layer, and external service adapters.

## 8. Methodology
An iterative development methodology is proposed.

**Phase 1 — Requirement analysis:** Identify student, teacher, and administrator needs; document workflows and institutional constraints.

**Phase 2 — System design:** Define role permissions, data entities, API structure, interface navigation, and security boundaries.

**Phase 3 — Implementation:** Develop frontend components, API endpoints, database models, authentication, and module workflows.

**Phase 4 — Integration:** Connect configured external services and verify authorization, callbacks, and error handling.

**Phase 5 — Testing:** Conduct unit, API, integration, usability, responsive, security, and role-permission tests.

**Phase 6 — Deployment and evaluation:** Deploy frontend and backend, configure production services, test with representative data, and collect user feedback.

## 9. Feasibility

### Technical feasibility
The repository already contains a React/Vite frontend, Express API, Prisma data models, PostgreSQL configuration, authentication integration, and multiple academic modules. The stack is suitable for iterative development. Integration work remains for services requiring external credentials.

### Operational feasibility
A common portal can reduce the need to navigate separate tools. Successful adoption will depend on staff training, accurate data migration, institutional approval, and clearly assigned administrative responsibilities.

### Economic feasibility
The platform uses open-source development technologies. Hosting, database, AI usage, email/SMS, payment-provider fees, and other external services may introduce ongoing costs. A final budget should be prepared after expected user volume and hosting requirements are known.

### Schedule feasibility
A phased implementation is practical. A reliable calendar should be established after the final scope, team size, institutional dependencies, and acceptance criteria are agreed.

## 10. Security and Privacy Considerations
- Authenticate users before exposing protected API resources.
- Enforce role authorization on the server, not only in the interface.
- Restrict student result access to the authenticated student's identity.
- Store authentication credentials through approved authentication mechanisms.
- Keep API keys, database credentials, OAuth secrets, and payment credentials out of source control.
- Encrypt stored OAuth tokens and protect sensitive records.
- Use HTTPS, appropriate CORS allowlists, rate limiting, input validation, and secure headers.
- Maintain backup, retention, access logging, and incident-response policies before production.
- Obtain institutional approval and define lawful handling of student data.
- Never treat a client-side payment response as proof of successful settlement.

## 11. Expected Outcomes
The expected deliverable is a centralized, responsive portal that gives students a unified view of academic activities, gives teachers a consistent digital workspace, gives administrators tools to manage selected academic information, makes supported academic records easier to access, provides a foundation for AI-assisted learning and external integrations, and establishes clearer access controls.

Actual benefits should be evaluated through usability testing, task completion time, error rates, user feedback, and operational reliability.

## 12. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Incorrect or incomplete student data | Validate imports and reconcile sample records before production |
| Unauthorized access to academic records | Enforce server-side role checks and student-specific record filters |
| External API or credential failure | Use clear integration status, error handling, and configuration checks |
| Unsupported result PDF layouts | Validate representative official PDFs and reject unknown formats |
| AI hallucinations or inaccurate educational output | Label AI responses, add safeguards, and encourage verification |
| Payment callback spoofing | Verify provider signatures and transaction status on the server |
| Service downtime or data loss | Configure monitoring, backups, and recovery procedures |

## 13. Conclusion
METSOL aims to provide a common digital environment for important university academic and student-service workflows. The current repository offers a substantial implementation foundation, including role-aware application features, a React interface, an Express API, and database-backed models. Further validation, institutional requirement review, security hardening, and completion of external integrations are necessary before the portal can be treated as a production university system.

---
**End of Project Proposal**
