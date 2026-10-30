# Approximate UI Design
## METSOL — Smart University Student Portal

**Repository:** https://github.com/mashrafianam99/metsol  
**Purpose:** Proposed interface structure and low-fidelity wireframes  
**Status:** Conceptual design aligned with the current React/Vite application; not a pixel-perfect screenshot specification.

## 1. Design Direction
The portal should feel like a modern, trustworthy university service. The existing interface uses a blue-accented visual language, cards, responsive grids, and light/dark styling. The proposed design retains that direction while standardizing navigation, spacing, typography, and role-specific content.

### Visual principles
- Clarity: prioritize information users need most often.
- Consistency: reuse navigation, card, table, form, and status patterns.
- Role awareness: show tools based on the authenticated role.
- Responsive behavior: support desktop, tablet, and mobile.
- Accessibility: readable contrast, visible focus states, semantic labels, and keyboard-accessible controls.
- Trust: distinguish official records from demo data and external integrations that are not connected.

### Suggested design tokens

| Element | Suggested treatment |
|---|---|
| Primary color | University blue, approximately #2563EB |
| Main text | Deep navy / slate |
| Page background | Pale neutral gray-blue |
| Surface | White cards with subtle borders |
| Success | Green status with text label |
| Warning | Amber status with text label |
| Error | Red status with explanatory message |
| Radius | 10–16 px for cards and controls |
| Spacing | Consistent 4/8 px spacing scale |
| Typography | Inter or system sans-serif |
| Icons | One consistent outline icon family |

Color values are suggestions, not a requirement to replace the current stylesheet.

## 2. Global Application Layout

### Desktop shell (conceptual wireframe)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ METSOL / University Portal        Search         Notifications   Profile │
├───────────────────┬──────────────────────────────────────────────────────┤
│ UNIVERSITY        │ Page title                         Primary action   │
│ PORTAL            │ Short contextual description                       │
│                   │                                                      │
│ Overview          │ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│ Courses           │ │ KPI / Card │ │ KPI / Card │ │ KPI / Card │       │
│ Assignments       │ └────────────┘ └────────────┘ └────────────┘       │
│ Results           │                                                      │
│ Attendance        │ ┌──────────────────────────┐ ┌───────────────────┐  │
│ Notices           │ │ Main content / table     │ │ Activity / alerts│  │
│ Resources         │ │                          │ │                   │  │
│ Help & Settings   │ └──────────────────────────┘ └───────────────────┘  │
└───────────────────┴──────────────────────────────────────────────────────┘
```

### Global components
1. Top bar: brand, search where supported, notification access, profile menu, and theme control if enabled.
2. Side navigation: role-specific links grouped by academic, learning, and account tasks.
3. Page header: title, description, breadcrumbs where useful, and contextual primary action.
4. Content area: responsive cards, tables, charts, filters, and forms.
5. Feedback: loading skeletons, empty states, errors, success confirmation, and disabled states.

On narrow screens, the sidebar should collapse into a drawer or compact navigation. Tables should scroll horizontally or transform into readable stacked records.

## 3. Authentication Screens

### Login

```text
┌─────────────────────────────────────────────────────────────┐
│                         METSOL                              │
│                 Smart University Portal                    │
│                                                             │
│                 Welcome back                                │
│       Sign in to access your university workspace           │
│                                                             │
│       Email                                                 │
│       [_______________________________________________]     │
│       Password                                              │
│       [_______________________________________________]     │
│                                                             │
│       [ ] Remember me                  Forgot password      │
│                                                             │
│       [                 Sign in                     ]       │
│                                                             │
│       New student? Create an account                        │
└─────────────────────────────────────────────────────────────┘
```

Design requirements:
- Show validation close to the relevant field.
- Provide a password visibility control.
- Explain authentication errors without exposing sensitive details.
- Show a loading state during sign-in.
- New public sign-ups must receive the permitted default role; users must not select Admin or Teacher during ordinary self-registration.

### Registration
Use a compact form for information required during account creation. Explain email verification where required. Do not request unnecessary personal data.

## 4. Student Dashboard
Purpose: give a student a quick view of current academic status and the next actions they should take.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Student Dashboard                                      Good morning      │
│ Welcome back, [Student Name]                                             │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐ │
│ │ Enrolled       │ │ Upcoming       │ │ Attendance     │ │ CGPA       │ │
│ │ courses        │ │ assignments    │ │ summary        │ │ summary    │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘ │
│                                                                          │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ Upcoming assignments                  │ │ Recent notices            │ │
│ │ Course | Assignment | Due | Status    │ │ • Academic announcement   │ │
│ │ ...                                   │ │ • Examination update      │ │
│ └───────────────────────────────────────┘ └───────────────────────────┘ │
│                                                                          │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ Recent results / academic progress    │ │ Quick access              │ │
│ │ Grade | Course | Semester             │ │ Results  Attendance       │ │
│ │                                       │ │ Study Hub EduAI           │ │
│ └───────────────────────────────────────┘ └───────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

Recommended interactions:
- Selecting an assignment opens its detail view.
- Selecting a notice opens the full announcement.
- Academic metrics link to their source pages.
- Empty states explain how records become available.
- Do not display fabricated CGPA or attendance percentages when official data is unavailable.

## 5. Teacher Dashboard

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Teacher Workspace                                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────────────────────┐ │
│ │ My courses     │ │ Pending        │ │ Recent submissions            │ │
│ │                │ │ reviews        │ │                                │ │
│ └────────────────┘ └────────────────┘ └────────────────────────────────┘ │
│                                                                          │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ Course list                           │ │ Teaching shortcuts        │ │
│ │ Code | Course | Students | Open        │ │ Create assignment         │ │
│ │                                       │ │ Review submissions        │ │
│ └───────────────────────────────────────┘ │ Post notice               │ │
│                                           └───────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

Teacher navigation may include Dashboard, My Courses, Assignments, Submissions, Notices, Resources, and Profile, depending on implemented permissions.

## 6. Administrator Dashboard

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Administration Overview                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐ │
│ │ Students       │ │ Teachers       │ │ Courses        │ │ Pending    │ │
│ │                │ │                │ │                │ │ payments   │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘ │
│                                                                          │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ Recent administrative activity        │ │ Administration shortcuts  │ │
│ │ Date | Activity | Status              │ │ Manage users               │ │
│ │                                       │ │ Manage courses             │ │
│ └───────────────────────────────────────┘ │ Import results             │ │
│                                           │ Publish notice              │ │
│                                           └───────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

Administrator tools must be protected by server-side authorization. Destructive or bulk operations should require a review step and clear confirmation.

## 7. Key Module Screens

### Courses
- Course list with code, title, department, credits, and instructor where available.
- Search and semester filters.
- Course detail view with enrollment status and related assignments.
- Clear empty state when no courses are available.

### Assignments
- List grouped by upcoming, submitted, overdue, or completed status.
- Detail view with description, due date, course, and materials.
- Submission form with supported text/file options.
- Confirmation and timestamp after successful submission.

### Results and CGPA
- Student identity summary.
- Semester selector and result table.
- Course code, title, credits, grade, and grade point.
- GPA/CGPA summary only where supported by available records.
- Print/export affordance if supported.
- Admin import interface with file validation, preview, duplicate detection, import summary, and clear error messages.

### Attendance
- Attendance summary with date/course filters.
- Status legend with text labels.
- Do not rely only on colors to communicate presence or absence.

### Notices and Calendar
- Notice feed with audience, author, and published date.
- Full notice detail.
- Calendar/list views for upcoming academic events, with time zone clarity.

### EduAI
- Conversation-oriented layout with a stable message composer.
- Document upload area showing supported formats and file-size limits.
- Clear distinction between AI-generated assistance and official university information.
- Visible demo/unavailable status if the AI provider is not configured.
- Error, loading, and retry states.

### Fees and Payments
- Invoice list with invoice number, fee type, amount, due date, and status.
- Payment initiation only where gateway configuration is available.
- Payment detail with provider reference and verified status.
- Never show a payment as successful until the backend verifies the provider result.

### Transport
- Map/location panel only when connected to a live provider.
- Mark sample/demo coordinates as DEMO.
- Show last-updated time and service connection state.

## 8. Navigation Proposal

| Student | Teacher | Administrator |
|---|---|---|
| Dashboard | Dashboard | Overview |
| Courses | My Courses | Users & Roles |
| Assignments | Assignments | Courses |
| Results / Transcript | Submissions | Results Import |
| Attendance | Notices | Notices |
| Routine / Calendar | Resources | Fees & Payments |
| Study Hub | Profile | Reports / Settings |
| EduAI |  | Integrations |
| Fees / Payments |  |  |
| Transport / Helpdesk |  |  |
| Profile / Settings |  |  |

Displayed navigation must be reconciled with actual route visibility and backend role checks before implementation.

## 9. Responsive Design
**Desktop (approximately 1024 px and above):** persistent sidebar, multi-column dashboard cards, wide tables.

**Tablet (approximately 768–1023 px):** collapsible sidebar, two-column cards, compact table spacing.

**Mobile (below approximately 768 px):** drawer or bottom navigation for frequent destinations, single-column cards, stacked forms, and mobile-friendly tables.

At all sizes, prevent horizontal page overflow, keep primary actions easy to reach, use comfortable touch targets, preserve readable text and sufficient contrast, and ensure dialogs fit the viewport and can be dismissed accessibly.

## 10. Shared UI States and Accessibility
Every data-driven screen should account for initial loading, empty result, successful action, validation error, server/network error, permission denied, session expired, and external integration disconnected or misconfigured.

Accessibility requirements:
- Semantic headings and landmarks.
- Explicit form labels.
- Keyboard navigation and visible focus.
- Descriptive button and link text.
- Accessible dialogs and status announcements.
- Text alternatives for meaningful images and icons.
- Suitable color contrast for normal text and controls.

## 11. UI Acceptance Checklist
- [ ] Student, Teacher, and Admin see appropriate navigation.
- [ ] Protected screens are not accessible by changing the URL alone.
- [ ] Dashboard figures are based on available records.
- [ ] Forms provide actionable validation.
- [ ] Loading, empty, success, and failure states exist.
- [ ] Layout works at desktop, tablet, and mobile widths.
- [ ] Keyboard focus is visible and controls are operable.
- [ ] Demo integrations are visibly labelled as demo/unconfigured.
- [ ] Payment, result, and identity information is not represented as verified unless confirmed by the backend.

---
**End of Approximate UI Design**
