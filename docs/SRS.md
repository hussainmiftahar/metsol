# Software Requirements Specification (SRS)
## METSOL — Smart University Student Portal

**Repository:** https://github.com/mashrafianam99/metsol  
**Version:** 1.0  
**Date:** 30 October 2026  
**Standard guidance:** Structured using common IEEE-style SRS sections. This is a project-specific working specification, not a claim of formal standards certification.

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for METSOL, a web-based university portal. It provides a shared reference for developers, testers, reviewers, and stakeholders.

### 1.2 Scope
METSOL centralizes selected academic and student-service workflows for Student, Teacher, and Admin roles. It includes a React web frontend, an Express API, PostgreSQL persistence through Prisma, Supabase authentication, and optional external service integrations.

The specification describes current repository capabilities and intended behavior needed for a complete, secure deployment. Requirements dependent on third-party credentials or providers are explicitly conditional.

### 1.3 Intended audience
- Project supervisor and academic evaluators.
- University representatives and administrators.
- Frontend and backend developers.
- Database designers.
- QA and security testers.
- Future maintenance teams.

### 1.4 Definitions

| Term | Meaning |
|---|---|
| Admin | Authorized user who manages institutional portal data |
| Teacher | User with teaching-related permissions |
| Student | User who accesses personal academic services |
| API | Application Programming Interface |
| CGPA | Cumulative Grade Point Average |
| GPA | Grade Point Average |
| OAuth | Delegated authorization protocol used for external integrations |
| ORM | Object-Relational Mapping |
| SRS | Software Requirements Specification |
| UI | User Interface |
| UAT | User Acceptance Testing |
| Demo mode | Clearly labelled behavior that does not represent a live external service |

### 1.5 References
- METSOL source repository: https://github.com/mashrafianam99/metsol
- Repository README.md
- backend/prisma/schema.prisma
- backend/src/server.js
- backend/src/ai.js and backend/src/aiDocuments.js
- backend/src/googleClassroom.js
- SUPABASE_VERCEL_SETUP.md

## 2. Overall Description

### 2.1 Product perspective
METSOL is a browser-based client/server application. The frontend communicates with the backend over HTTP APIs. The backend authenticates requests, enforces authorization, applies business logic, and reads or writes records in PostgreSQL through Prisma. External services are accessed through dedicated integration code when configured.

### 2.2 Product functions
The product provides or is designed to provide authentication, role-specific workspaces, profile and academic data management, course enrollment, assignments and submissions, attendance, notices, calendar, learning resources, result viewing and administrator PDF import, AI learning assistance, fee invoices and payment records, Google Classroom connectivity, and transport/helpdesk/hostel/library/notification screens.

### 2.3 User classes

**Student:** Uses the portal to access personal academic records and learning tools. May access only their own protected student records and information made available to their role.

**Teacher:** Uses the portal for teaching and course-related workflows. May access only information permitted by assigned teaching and administrative permissions.

**Administrator:** Manages selected user, academic, result, notice, and fee-related information. Has elevated permissions and must use protected administrative operations.

### 2.4 Operating environment
- Modern web browsers with JavaScript enabled.
- Desktop, tablet, and mobile devices.
- Node.js runtime for the backend.
- PostgreSQL database.
- Configured Supabase Auth project.
- Internet connectivity for hosted deployment and external integrations.

### 2.5 Constraints
- Node.js 20+ is specified in the repository README.
- Frontend uses React and Vite.
- Backend uses Node.js and Express.
- PostgreSQL persistence is managed using Prisma.
- Supabase Auth credentials and database connection settings are required.
- External integrations require valid provider credentials, redirect URIs, and provider-side configuration.
- Current result PDF import supports recognized text-based layouts; scanned/image-only PDFs are not supported without OCR.
- AI document uploads are limited by configured backend file and extracted-text limits.
- Production security and institutional data handling require additional review.

### 2.6 Assumptions and dependencies
- The university supplies accurate course, student, semester, grading, and role information.
- Administrators assign elevated roles through an authorized process.
- Supabase Auth and PostgreSQL are available.
- AI, Google Classroom, payment, GPS, and messaging services may be unavailable until configured.
- Representative official result PDFs and grading policies will be supplied for validation.
- The deployment environment supports the configured backend and frontend architecture.

## 3. System Features and Functional Requirements
Priority definitions: **Must** = essential for a secure core portal; **Should** = important capability that may be phased; **Conditional** = depends on provider configuration or institutional approval.

### 3.1 Authentication and Account Management
- **FR-AUTH-01 (Must):** The system shall allow users to sign in using the configured authentication provider.
- **FR-AUTH-02 (Must):** The system shall reject unauthenticated requests to protected API routes.
- **FR-AUTH-03 (Must):** The backend shall verify the access token before identifying the user.
- **FR-AUTH-04 (Must):** The system shall associate an authenticated identity with a portal user record.
- **FR-AUTH-05 (Must):** New public registrations shall receive the Student role by default.
- **FR-AUTH-06 (Must):** Ordinary users shall not grant themselves Teacher or Admin privileges through client-side input.
- **FR-AUTH-07 (Must):** The system shall provide a way to end or invalidate the user's active session through the authentication flow.
- **FR-AUTH-08 (Should):** The system should provide secure password recovery and email verification flows according to the configured provider.

### 3.2 Role-Based Access Control
- **FR-RBAC-01 (Must):** The system shall support Student, Teacher, and Admin roles.
- **FR-RBAC-02 (Must):** The backend shall enforce role restrictions for protected operations.
- **FR-RBAC-03 (Must):** The interface shall display navigation and actions appropriate to the authenticated role.
- **FR-RBAC-04 (Must):** A user shall not obtain protected access merely by editing browser state or manually entering a URL.
- **FR-RBAC-05 (Must):** Student-specific result endpoints shall derive identity from authenticated server-side context, not a user-supplied student identifier.
- **FR-RBAC-06 (Should):** Authorization failures should return consistent 401 or 403 responses without disclosing sensitive implementation details.

### 3.3 User Profile
- **FR-PROF-01 (Must):** The system shall maintain a portal profile containing name, email, role, and applicable academic identifiers.
- **FR-PROF-02 (Should):** Users should be able to view their own permitted profile information.
- **FR-PROF-03 (Should):** Profile edits shall validate fields and prevent users from modifying protected attributes such as their own role.

### 3.4 Dashboard
- **FR-DASH-01 (Must):** The system shall provide an authenticated dashboard.
- **FR-DASH-02 (Must):** The dashboard shall show information relevant to the current user and role.
- **FR-DASH-03 (Must):** Dashboard values shall be based on available records and shall not fabricate academic metrics.
- **FR-DASH-04 (Should):** The dashboard should provide shortcuts to frequently used modules and recent notices or activities.

### 3.5 Course Management and Enrollment
- **FR-COURSE-01 (Must):** The system shall maintain course code, title, department, credit value, and applicable teacher association.
- **FR-COURSE-02 (Must):** Authorized users shall be able to view course information.
- **FR-COURSE-03 (Must):** The system shall record student course enrollment by semester.
- **FR-COURSE-04 (Must):** The system shall prevent duplicate enrollment for the same student, course, and semester.
- **FR-COURSE-05 (Should):** Authorized administrators should be able to create, update, and manage course catalogue information.

### 3.6 Assignment and Submission Management
- **FR-ASGN-01 (Must):** The system shall maintain assignment title, description, course association, teacher association, and optional due date.
- **FR-ASGN-02 (Must):** Students shall be able to view assignments available to them.
- **FR-ASGN-03 (Must):** The system shall record submissions with assignment, student, submission time, and available content or file reference.
- **FR-ASGN-04 (Must):** The system shall associate grades and feedback with the relevant submission where grading is supported.
- **FR-ASGN-05 (Should):** Teachers should be able to review submissions and enter grades or feedback according to their permissions.
- **FR-ASGN-06 (Conditional):** The system may synchronize assignments from Google Classroom when OAuth and Classroom API access are configured.

### 3.7 Attendance
- **FR-ATT-01 (Must):** The system shall store attendance records associated with a student, course, date, and status.
- **FR-ATT-02 (Must):** Students shall only view their own attendance records.
- **FR-ATT-03 (Should):** Authorized teachers or administrators should be able to view or manage attendance within their permission scope.
- **FR-ATT-04 (Should):** Attendance summaries should identify the period and data source.

### 3.8 Examination Results and Result Import
- **FR-RESULT-01 (Must):** The system shall store course result information including student association, course information, semester, grade, grade point, and credits.
- **FR-RESULT-02 (Must):** Students shall only retrieve results belonging to their authenticated account.
- **FR-RESULT-03 (Must):** Authorized administrators shall be able to upload a supported result PDF for validation and preview.
- **FR-RESULT-04 (Must):** The system shall validate that an uploaded file is a PDF and enforce configured upload limits.
- **FR-RESULT-05 (Must):** The system shall reject unsupported or unrecognized PDF layouts rather than silently guessing record values.
- **FR-RESULT-06 (Must):** The system shall detect repeat imports using the uploaded file's SHA-256 hash.
- **FR-RESULT-07 (Must):** The system shall retain import metadata and associate imported records with the relevant batch.
- **FR-RESULT-08 (Should):** The system should provide an import summary with record counts and validation errors.
- **FR-RESULT-09 (Conditional):** Scanned/image-only PDF support shall require a separately configured OCR capability and validation process.

### 3.9 Notices and Academic Calendar
- **FR-NOTICE-01 (Must):** The system shall store notices with title, body, audience, author where available, and creation date.
- **FR-NOTICE-02 (Must):** Users shall be able to view notices permitted for their audience.
- **FR-NOTICE-03 (Should):** Authorized users should be able to create and manage notices.
- **FR-CAL-01 (Should):** The interface should present academic events and schedules when valid event data is available.

### 3.10 Learning Resources and Question Bank
- **FR-LEARN-01 (Should):** The system should provide learning resources with title, type, subject, URL, and uploader where available.
- **FR-LEARN-02 (Should):** The system should support a question bank containing questions, optional choices, answers, and explanations.
- **FR-LEARN-03 (Should):** The system should provide study-planning and progress interfaces based on available data.

### 3.11 AI Learning Assistant and Document Processing
- **FR-AI-01 (Conditional):** When the AI provider is configured, the system shall allow users to submit educational prompts and receive assistant responses.
- **FR-AI-02 (Conditional):** The system shall support PDF, DOCX, and TXT uploads within configured size and extraction limits.
- **FR-AI-03 (Must):** The system shall reject unsupported formats and over-limit uploads with a clear error.
- **FR-AI-04 (Must):** The interface shall identify demo/fallback responses when the live AI provider is not configured.
- **FR-AI-05 (Must):** The system shall not present AI output as an official university record or guaranteed factual answer.
- **FR-AI-06 (Must):** Document processing shall follow the configured privacy and retention behavior; the current README describes in-memory extraction and no persistent document storage.

### 3.12 Fees and Payments
- **FR-FEE-01 (Must):** The system shall maintain fee invoices with invoice number, student association, fee type, amount, currency, due date, and status.
- **FR-FEE-02 (Must):** The system shall maintain payment attempts with provider, amount, reference, and status.
- **FR-FEE-03 (Must):** Students shall only view their own invoices and payment records.
- **FR-FEE-04 (Must):** A payment shall not be marked successful solely because a browser reports success.
- **FR-FEE-05 (Conditional):** The system may initiate bKash or Nagad payments when merchant credentials and official provider integration are configured.
- **FR-FEE-06 (Conditional):** Payment success shall require server-side verification of provider transaction and callback/signature information.

### 3.13 Google Classroom Integration
- **FR-GCLASS-01 (Conditional):** The system shall provide a Google account connection flow when OAuth credentials are configured.
- **FR-GCLASS-02 (Conditional):** OAuth callback state shall be validated before accepting the authorization result.
- **FR-GCLASS-03 (Must):** Stored OAuth tokens shall be protected using the configured encryption mechanism.
- **FR-GCLASS-04 (Conditional):** Authorized users shall be able to request assignment synchronization when the Google Classroom connection is valid.
- **FR-GCLASS-05 (Must):** Users shall be able to view connection status and disconnect an account where the integration is enabled.

### 3.14 Transport and Other Student Services
- **FR-SVC-01 (Should):** The system should provide access to transport, hostel, library, digital ID, and helpdesk information where data is available.
- **FR-SVC-02 (Conditional):** Live transport location shall be displayed only when a real provider/device feed is configured.
- **FR-SVC-03 (Must):** Sample transport coordinates shall be explicitly labelled as demo data.
- **FR-SVC-04 (Conditional):** Email, SMS, or push notifications shall require a configured provider.

## 4. External Interface Requirements

### 4.1 User interface
- Browser-based responsive interface.
- Role-specific dashboards and navigation.
- Forms, lists, tables, status labels, dialogs, and feedback messages.
- Support for keyboard operation and accessible labels.
- Light/dark presentation where supported by the existing interface.

### 4.2 Software interfaces
- Frontend communicates with Express API endpoints.
- Backend accesses PostgreSQL using Prisma ORM.
- Supabase Auth verifies access tokens and manages authentication.
- Groq-compatible service provides AI responses when configured.
- Google OAuth and Classroom APIs provide optional classroom connectivity.
- bKash/Nagad provider APIs may be integrated through a verified payment adapter.
- External GPS and notification services may be connected through configured adapters.

### 4.3 Communication interfaces
- HTTPS for production browser/API communication.
- JSON request and response bodies for API operations.
- Bearer access token for protected API requests.
- OAuth redirect and callback flow for supported external integrations.
- Provider-specific callback verification for payment processing.

## 5. Non-Functional Requirements

### 5.1 Security
- **NFR-SEC-01:** All protected API operations shall require valid authentication.
- **NFR-SEC-02:** Authorization shall be enforced server-side for every sensitive operation.
- **NFR-SEC-03:** Secrets shall be stored in deployment environment variables or a suitable secret manager, not committed to the repository.
- **NFR-SEC-04:** Production traffic shall use HTTPS.
- **NFR-SEC-05:** Inputs shall be validated and file uploads shall enforce type, size, and content checks.
- **NFR-SEC-06:** Sensitive data and tokens shall not be written to ordinary application logs.
- **NFR-SEC-07:** The production system shall define backup, recovery, monitoring, and incident-response procedures.

### 5.2 Performance
- **NFR-PERF-01:** Common user actions should return within an agreed response-time target under expected load.
- **NFR-PERF-02:** Database queries should use appropriate indexes and pagination for large result sets.
- **NFR-PERF-03:** File processing and external API requests should provide progress or clear completion/error feedback where practical.

Performance targets must be finalized after expected concurrent users, data volume, and deployment resources are known.

### 5.3 Availability and Reliability
- **NFR-REL-01:** The application shall handle unavailable external services gracefully.
- **NFR-REL-02:** Failed operations shall not silently create misleading success states.
- **NFR-REL-03:** Database backup and restoration procedures shall be tested before production use.
- **NFR-REL-04:** Deployment should expose a health endpoint for service monitoring.

### 5.4 Usability and Accessibility
- **NFR-USE-01:** Core workflows shall use consistent labels, navigation, and feedback patterns.
- **NFR-USE-02:** The interface shall be usable at desktop, tablet, and mobile viewport sizes.
- **NFR-USE-03:** Forms shall provide clear validation and recovery guidance.
- **NFR-USE-04:** Keyboard navigation, visible focus, semantic structure, and readable contrast shall be supported.

### 5.5 Maintainability
- **NFR-MAIN-01:** Frontend, backend, database, and integration responsibilities should remain separated.
- **NFR-MAIN-02:** Shared business rules should avoid unnecessary duplication.
- **NFR-MAIN-03:** Critical business logic and security rules should have automated tests.
- **NFR-MAIN-04:** Environment configuration and deployment steps shall be documented.

### 5.6 Portability and Compatibility
- **NFR-PORT-01:** The web interface shall support current major desktop and mobile browsers.
- **NFR-PORT-02:** The application shall be deployable in environments that satisfy documented runtime and database requirements.

## 6. Data Requirements

### 6.1 Core data entities
The current Prisma schema includes or represents:

| Entity | Main purpose |
|---|---|
| User | Portal identity, profile, role, and student information |
| GoogleAccountConnection | User's protected Google connection and token metadata |
| Course | Course catalogue and teacher association |
| CourseEnrollment | Student course enrollment by semester |
| Assignment | Course assignment and source information |
| Submission | Student assignment submission and grading feedback |
| Attendance | Student attendance by course and date |
| Notice | Published university notices |
| Result | Course-level student result |
| ResultImport | Metadata for a result import batch |
| UniversityResult | Detailed records extracted from imported results |
| Resource | Learning resource metadata |
| Question | Question-bank content |
| BusLocation | Transport location records |
| FeeInvoice | Fee invoice information |
| Payment | Payment records |
| PaymentAttempt | Provider-specific payment attempt and verification status |

### 6.2 Data integrity
- User email must be unique.
- Course enrollment shall be unique for a user, course, and semester.
- Imported PDF file hashes shall be unique to prevent repeat imports.
- Related records shall use database relationships and appropriate delete behavior.
- Monetary amounts shall use fixed-precision decimal fields.
- Student access to private records shall be scoped to the authenticated user.

### 6.3 Data retention and privacy
The institution must define retention periods for student records, uploaded data, payment records, authentication data, and logs. AI document handling must match the disclosed extraction and retention policy. Access to student data must follow institutional policies and applicable law.

## 7. Use Cases

### UC-01: Student signs in
**Actor:** Student  
**Precondition:** Student has a valid account and verified email where required.  
**Main flow:**
1. Student opens the login page.
2. Student enters login credentials.
3. Authentication provider validates the credentials.
4. Frontend receives an authenticated session.
5. Student opens the portal.
6. Backend verifies the access token and resolves the portal profile.
7. Student dashboard is displayed.  
**Alternative flow:** Invalid credentials or unverified account produces a safe error message.  
**Postcondition:** Student has access to permitted student functions.

### UC-02: Student views personal results
**Actor:** Student  
**Precondition:** Student is authenticated and result records exist.  
**Main flow:**
1. Student opens Results.
2. Frontend requests results from the API.
3. Backend identifies the student from the authenticated user.
4. Backend fetches only matching records.
5. Frontend displays semester/course results.  
**Alternative flow:** No records exist; the system displays an empty state.  
**Postcondition:** No other student's result is disclosed.

### UC-03: Administrator imports a result PDF
**Actor:** Admin  
**Precondition:** Admin is authenticated and authorized; file is available.  
**Main flow:**
1. Admin opens Result Import.
2. Admin selects a PDF.
3. Backend validates access, file type, and upload size.
4. Backend extracts supported text and parses recognized result rows.
5. System checks the file hash for duplicates.
6. Admin reviews the preview and validation summary.
7. Admin confirms import.
8. System stores import metadata and result records.  
**Alternative flow:** Unsupported layout, invalid file, or duplicate upload is rejected with a clear explanation.  
**Postcondition:** Accepted records are associated with an import batch.

### UC-04: Student submits an assignment
**Actor:** Student  
**Precondition:** Student is authenticated and can access the assignment.  
**Main flow:**
1. Student opens an assignment.
2. Student reviews instructions and due date.
3. Student enters supported response content or selects a supported file.
4. Student submits.
5. Backend validates the request and stores the submission.
6. Frontend displays confirmation.  
**Alternative flow:** Validation, authorization, or network error is displayed without falsely confirming submission.  
**Postcondition:** Submission is stored with its student and assignment associations.

### UC-05: Student asks EduAI a question
**Actor:** Student  
**Precondition:** Student is authenticated; AI provider is configured for live answers.  
**Main flow:**
1. Student opens EduAI.
2. Student submits a question or supported document.
3. Backend validates input and processes the request.
4. Configured AI service returns a response.
5. Frontend displays the answer with an appropriate AI disclaimer.  
**Alternative flow:** Provider is unavailable or unconfigured; system displays a clear error or labelled demo response.  
**Postcondition:** No response is represented as an official academic record.

### UC-06: Student initiates a fee payment
**Actor:** Student  
**Precondition:** Student is authenticated, invoice is available, and a supported provider is configured.  
**Main flow:**
1. Student opens Fee/Payment details.
2. Student selects an eligible invoice and provider.
3. Backend creates a pending payment attempt.
4. Student completes the provider flow.
5. Provider returns transaction information.
6. Backend verifies the transaction through the provider's approved mechanism.
7. Backend updates payment status.
8. Frontend displays the verified result.  
**Alternative flow:** Gateway unavailable, failed, cancelled, or unverifiable; status remains non-successful and an explanatory message is shown.  
**Postcondition:** Payment success is recorded only after server-side verification.

### UC-07: User connects Google Classroom
**Actor:** Authenticated user with permitted integration access  
**Precondition:** Google OAuth credentials and callback URI are configured.  
**Main flow:**
1. User selects Connect Google Classroom.
2. Backend creates a signed, time-limited OAuth state value.
3. User authorizes requested Google scopes.
4. Google redirects to the configured callback.
5. Backend validates state and exchanges the authorization code.
6. Backend stores protected token information.
7. User sees the connection status.  
**Alternative flow:** User denies permission or credentials are invalid; connection is not marked active.  
**Postcondition:** Valid connection status is associated with the portal user.

## 8. API and Integration Requirements
The Express backend exposes API routes under `/api`. The exact endpoint inventory should be maintained from the implementation and API tests. At minimum, the API supports health check, authenticated profile resolution, dashboard and academic data, courses, assignments, submissions, attendance, notices, results, administrator result import, AI prompt/document processing, fee invoices/payment attempts, and Google Classroom connection/status/synchronization/disconnection.

API requirements:
- Return consistent status codes.
- Validate request parameters and bodies.
- Protect sensitive endpoints with authentication and authorization.
- Avoid leaking stack traces or secrets.
- Apply safe upload limits and content validation.
- Use pagination or bounded responses for potentially large collections.

## 9. Error Handling
The application shall handle missing, expired, invalid, or unverified authentication; insufficient role permission; invalid input; missing records; duplicate records and imports; unsupported files or PDF layouts; upload limits; database unavailability; external API timeout or misconfiguration; payment verification failure; and unexpected server errors.

Errors should be understandable to users and sufficiently informative for authorized operators without exposing sensitive internals.

## 10. Testing Requirements

### 10.1 Unit testing
- Result parsing and grading calculations.
- Student identity matching.
- Input validation and document extraction.
- AI document limit and format validation.
- OAuth state and token helper behavior.
- Payment verification helper logic.

### 10.2 Integration testing
- Authentication and profile linking.
- Role-protected API endpoints.
- Course, assignment, and submission persistence.
- Student-specific results and attendance.
- Administrator result import and duplicate detection.
- Configured AI and Google Classroom flows.
- Payment callback verification with provider test credentials.

### 10.3 System and acceptance testing
- Student, teacher, and admin end-to-end workflows.
- Mobile, tablet, and desktop UI.
- Accessibility and keyboard navigation.
- Security tests for unauthorized role access and record isolation.
- Error handling during database and provider outages.
- Backup and recovery validation.

### 10.4 Acceptance criteria
The system may be accepted for a controlled pilot when:
1. Users can authenticate and receive only their assigned role.
2. Server-side authorization prevents unauthorized operations.
3. Core academic records can be created, retrieved, and validated.
4. Student results are scoped to the authenticated student.
5. Supported result PDFs are previewed and imported accurately on representative test files.
6. Invalid and duplicate files are rejected safely.
7. Interfaces remain usable at agreed viewport sizes.
8. External features are verified against provider test environments or clearly marked unavailable/demo.
9. No critical security or data-integrity defects remain open.

## 11. Deployment and Maintenance
- Configure production environment variables securely.
- Apply database migrations using the deployment-safe migration command.
- Use separate development, preview, and production environments.
- Configure frontend API origin and backend CORS allowlist.
- Configure OAuth callback and provider webhooks as required.
- Use HTTPS and managed database backups.
- Monitor health, errors, and external service status.
- Keep dependency versions and security patches maintained.
- Document data restoration and operational ownership.

## 12. Open Issues and Decisions Required
1. Official university name, logo usage, and institutional branding approval.
2. Exact role permissions and who may create or modify academic records.
3. Official grading scale, semester policy, and transcript format.
4. Actual result PDF layouts and representative test files.
5. Attendance entry and correction policy.
6. Whether student profile data will be migrated from an existing system.
7. Google Classroom scopes and university Google Workspace approval.
8. Payment merchant onboarding, provider callbacks, reconciliation, and refunds.
9. Transport GPS provider and accuracy expectations.
10. Student data retention, privacy notice, and consent requirements.
11. Expected concurrent users, availability target, and performance thresholds.
12. Email verification, password recovery, audit logging, and support ownership.

---
**End of Software Requirements Specification**
