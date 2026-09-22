# Business Requirements Document (BRD)

## School Management System

**Document Version:** 1.0  
**Document Type:** Business Requirements + Functional Specification + UI/UX Specification  
**Reference Product:** eSkooly-style School Management Platform  
**Target Platform:** Web Application + Mobile Application  
**Primary Users:** Super Admin, School Admin, Principal, Teacher, Accountant, HR, Student, Parent, Librarian, Transport Manager

---

# 1. Executive Summary

The proposed system is a complete School Management System designed to digitize academic, administrative, financial, communication, HR, examination and reporting activities.

The system will provide a centralized platform through which school administrators can manage:

- Students
- Parents/guardians
- Teachers
- Employees
- Classes
- Sections
- Subjects
- Attendance
- Timetables
- Fees
- Expenses
- Payroll
- Examinations
- Results
- Homework
- Assignments
- Communication
- Library
- Inventory
- Transport
- Certificates
- ID cards
- Reports
- Online examinations
- School events
- Notifications
- System configuration

---

# 2. Business Objectives

## 2.1 Primary Objectives

1. Digitize school administration.
2. Reduce manual paperwork.
3. Centralize student information.
4. Automate attendance.
5. Automate fee collection and tracking.
6. Simplify examination management.
7. Provide parents with real-time academic information.
8. Improve teacher communication.
9. Automate reports.
10. Provide management with dashboards and analytics.

## 2.2 Expected Benefits

| Area | Current Problem | Proposed Solution |
|---|---|---|
| Student Records | Paper/manual records | Central digital student database |
| Attendance | Manual registers | Digital attendance |
| Fees | Manual calculations | Automated fee management |
| Exams | Spreadsheet/manual marks | Examination module |
| Communication | Phone/WhatsApp/manual notices | Central notifications |
| Reports | Manually prepared | Automated reports |
| Payroll | Manual calculation | Payroll automation |
| Homework | Physical notebooks | Digital homework |
| Parent Updates | Delayed | Real-time portal/app |
| Administration | Multiple systems | One integrated platform |

---

# 3. User Roles

## 3.1 Super Administrator

Can manage:

- Multiple schools/institutions
- Subscription
- Global settings
- Users
- Roles
- Permissions
- Modules
- System configuration
- Backup
- Audit logs

## 3.2 School Administrator

Can manage:

- Students
- Teachers
- Parents
- Classes
- Subjects
- Fees
- Exams
- Attendance
- Staff
- Reports
- Communication
- School settings

## 3.3 Principal

Can view:

- Dashboard
- Attendance
- Academic performance
- Fees
- Teacher performance
- Student performance
- Reports
- Notifications

## 3.4 Teacher

Can manage:

- Assigned classes
- Attendance
- Homework
- Assignments
- Marks
- Exams
- Study material
- Communication

## 3.5 Accountant

Can manage:

- Fees
- Receipts
- Expenses
- Income
- Transactions
- Financial reports

## 3.6 HR Manager

Can manage:

- Employees
- Attendance
- Leave
- Payroll
- Salary
- Employee documents

## 3.7 Student

Can access:

- Profile
- Timetable
- Attendance
- Homework
- Assignments
- Exams
- Results
- Study material
- Notifications

## 3.8 Parent

Can access:

- Child profile
- Attendance
- Fees
- Homework
- Results
- Timetable
- Notifications
- Teacher communication

---

# 4. Application Navigation

The main web application should use a left sidebar.

## Sidebar

```text
┌──────────────────────────────┐
│ SCHOOL LOGO                  │
│ School Name                  │
├──────────────────────────────┤
│ Dashboard                    │
│ Students                     │
│ Parents                      │
│ Teachers                     │
│ Classes & Subjects           │
│ Attendance                   │
│ Timetable                    │
│ Fees                         │
│ Examinations                 │
│ Homework                     │
│ Communication                │
│ HR / Employees               │
│ Payroll                      │
│ Library                      │
│ Inventory                    │
│ Transport                    │
│ Certificates                │
│ ID Cards                     │
│ Reports                      │
│ Online Exam                  │
│ Events                       │
│ Settings                     │
└──────────────────────────────┘
```

---

# 5. PAGE-BY-PAGE REQUIREMENTS

# Page 01 — Login

## Purpose

Authenticate users and redirect them to the appropriate dashboard.

## UI

```text
┌───────────────────────────────────────────────┐
│                                               │
│                 SCHOOL LOGO                   │
│                                               │
│             School Management System          │
│                                               │
│  Email / Username                             │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Password                                     │
│  ┌─────────────────────────────────────────┐  │
│  │ •••••••••••                             │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  □ Remember me       Forgot Password?         │
│                                               │
│          [ LOGIN ]                            │
│                                               │
└───────────────────────────────────────────────┘
```

## Requirements

- Username/email
- Password
- Remember me
- Forgot password
- CAPTCHA where required
- Login attempt protection
- Role-based redirect
- Session timeout

---

# Page 02 — Admin Dashboard

## Purpose

Provide an overview of school operations.

## Dashboard cards

```text
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Students   │ │ Teachers   │ │ Attendance │ │ Fees       │
│ 1,250      │ │ 85         │ │ 94.2%      │ │ ₹8.5 L     │
└────────────┘ └────────────┘ └────────────┘ └────────────┘

┌───────────────────────┐ ┌───────────────────────┐
│ Attendance Chart      │ │ Fee Collection Chart  │
│                       │ │                       │
│      📊               │ │      📈               │
│                       │ │                       │
└───────────────────────┘ └───────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Recent Activities                                    │
├──────────────────────────────────────────────────────┤
│ New student admission                                │
│ Fee payment received                                 │
│ Exam result published                                │
│ Teacher added                                        │
└──────────────────────────────────────────────────────┘
```

## Widgets

- Total students
- Active students
- Teachers
- Employees
- Today's attendance
- Fee collection
- Outstanding fees
- Upcoming exams
- Homework
- Events
- Notifications
- Income
- Expenses

---

# Page 03 — Student Management

## Student List

Columns:

| Field |
|---|
| Student ID |
| Photo |
| Name |
| Gender |
| Class |
| Section |
| Roll Number |
| Parent |
| Phone |
| Attendance |
| Status |
| Actions |

Actions:

- View
- Edit
- Delete
- Promote
- Print ID
- Print profile
- View attendance
- View fees
- View results

## Add Student

Fields:

- Admission number
- Admission date
- First name
- Middle name
- Last name
- Date of birth
- Gender
- Blood group
- Religion/category where required
- Student photo
- Address
- Previous school
- Class
- Section
- Roll number
- Parent details
- Emergency contact
- Documents
- Medical information where applicable

---

# Page 04 — Student Profile

The profile should use tabs:

```text
Profile | Parents | Attendance | Fees | Exams | Homework | Documents | Communication
```

## Information

- Student photograph
- Personal information
- Academic information
- Guardian information
- Contact details
- Documents
- Attendance percentage
- Fee status
- Examination results

---

# Page 05 — Parent Management

## Features

- Add parent
- Edit parent
- Link children
- Contact information
- Parent login
- Communication history
- Fee information
- Student information

A parent can have multiple children.

---

# Page 06 — Teacher Management

## Teacher List

Fields:

- Employee ID
- Teacher name
- Photo
- Department
- Subjects
- Classes
- Phone
- Email
- Joining date
- Status

Actions:

- View
- Edit
- Attendance
- Payroll
- Documents
- Schedule

---

# Page 07 — Classes & Sections

## Functions

- Create class
- Create section
- Assign class teacher
- Assign students
- Assign subjects
- Assign teachers
- Configure capacity

Example:

```text
Class 10
 ├── Section A
 │    ├── Mathematics
 │    ├── Science
 │    └── English
 │
 └── Section B
      ├── Mathematics
      ├── Science
      └── English
```

---

# Page 08 — Subjects

Fields:

- Subject code
- Subject name
- Class
- Teacher
- Subject type
- Maximum marks
- Passing marks
- Status

---

# Page 09 — Attendance

## Daily Attendance

```text
Date: 22-09-2026
Class: 10
Section: A

Student        Present   Absent   Late
----------------------------------------
Rahul           ✓
Amit                      ✓
Priya           ✓
Neha                              ✓
```

## Features

- Present
- Absent
- Late
- Half-day
- Leave
- Bulk attendance
- QR attendance
- Attendance correction
- Attendance reports
- Parent notification

---

# Page 10 — Attendance Reports

Filters:

- Date
- Class
- Section
- Student
- Teacher

Reports:

- Daily attendance
- Monthly attendance
- Student attendance
- Class attendance
- Defaulter attendance
- Teacher attendance

Export:

- PDF
- Excel
- CSV
- Print

---

# Page 11 — Timetable

## Timetable Builder

```text
          MON      TUE      WED      THU      FRI
09:00     Math     English  Science  Math     Hindi
10:00     Science  Math     English  Hindi    Math
11:00     Break    Break    Break    Break    Break
11:30     Hindi    Science  Math     English  Science
```

Features:

- Drag/drop timetable
- Teacher timetable
- Class timetable
- Room assignment
- Period configuration
- Conflict detection

---

# Page 12 — Fee Management

## Fee Dashboard

Cards:

- Total fees
- Collected
- Pending
- Overdue
- Discounts
- Today's collection

## Fee Structure

Fields:

- Class
- Fee type
- Amount
- Frequency
- Due date
- Late fee
- Discount
- Applicable students

---

# Page 13 — Fee Collection

```text
Student: Rahul Kumar
Class: 10-A

Tuition Fee       ₹5,000
Transport Fee     ₹1,500
Exam Fee            ₹500
--------------------------------
Total             ₹7,000

Payment Method:
○ Cash
○ Bank
○ Card
○ Online

[ RECEIVE PAYMENT ]
```

System generates:

- Receipt number
- Receipt
- Payment record
- Parent notification

---

# Page 14 — Expense Management

Expense fields:

- Expense category
- Date
- Amount
- Vendor
- Payment method
- Description
- Attachment
- Approved by

Reports:

- Daily expenses
- Monthly expenses
- Category-wise expenses
- Vendor expenses

---

# Page 15 — Examination Management

## Create Examination

Fields:

- Exam name
- Academic year
- Class
- Subjects
- Date
- Start time
- End time
- Maximum marks
- Passing marks

Example:

```text
Annual Examination 2026

Mathematics    10 Oct
Science        12 Oct
English        14 Oct
Hindi          16 Oct
```

---

# Page 16 — Marks Entry

```text
Student        Math    Science    English
------------------------------------------
Rahul           85       78         90
Amit            72       80         75
Priya           95       92         94
```

System calculates:

- Total
- Percentage
- Grade
- Rank where enabled
- Pass/fail
- Subject performance

---

# Page 17 — Result Card

Result card should contain:

- School logo
- Student photo
- Student name
- Admission number
- Class
- Examination
- Subject marks
- Total
- Percentage
- Grade
- Attendance
- Teacher remarks
- Principal remarks
- Signature areas

Actions:

- Preview
- Print
- Download PDF
- Publish
- Send to parent

---

# Page 18 — Question Bank

Functions:

- Add question
- Edit question
- Delete question
- Question category
- Subject
- Chapter
- Difficulty
- Marks
- Question type

Question types:

- MCQ
- True/False
- Fill in the blank
- Short answer
- Long answer

---

# Page 19 — Online Examination

Student interface:

```text
┌──────────────────────────────────────────────┐
│ Mathematics Examination          45:32        │
├──────────────────────────────────────────────┤
│ Q12. What is the value of X?                 │
│                                              │
│ ○ A                                          │
│ ○ B                                          │
│ ○ C                                          │
│ ○ D                                          │
│                                              │
│ [ Previous ]       [ Next ]                  │
└──────────────────────────────────────────────┘
```

Features:

- Timer
- Question navigation
- Auto-save
- Auto-submit
- Random questions
- Result calculation

---

# Page 20 — Homework

Teacher selects:

- Class
- Section
- Subject
- Title
- Description
- Due date
- Attachment

Students can:

- View homework
- Download material
- Submit assignment
- View status

Teacher can:

- Review submission
- Add marks
- Add comments
- Mark complete

---

# Page 21 — Study Materials

Supported material:

- PDF
- DOC/DOCX
- PPT
- Images
- Videos
- Links

Organization:

```text
Class
 └── Subject
      └── Chapter
           └── Study Material
```

---

# Page 22 — Communication

Communication center:

- Announcements
- Notifications
- Internal messages
- Parent communication
- Teacher communication
- SMS
- WhatsApp integration where configured
- Email

Messages should support:

- Individual recipient
- Class
- Section
- Entire school
- Parents
- Teachers

---

# Page 23 — Notification Center

Notification types:

- Attendance
- Fee reminder
- Homework
- Examination
- Result
- Announcement
- Event
- Emergency notification

---

# Page 24 — Employee / HR

Employee profile:

- Employee ID
- Name
- Photo
- Department
- Designation
- Joining date
- Contact
- Address
- Documents
- Bank information
- Salary information

---

# Page 25 — Employee Attendance

Features:

- Daily attendance
- Check-in
- Check-out
- Late
- Leave
- Monthly report
- Attendance export

---

# Page 26 — Payroll

Payroll workflow:

```text
Employee
   ↓
Basic Salary
   ↓
Allowances
   ↓
Deductions
   ↓
Tax/Other deductions
   ↓
Net Salary
   ↓
Payslip
```

Payslip should include:

- Employee details
- Salary period
- Earnings
- Deductions
- Net salary
- Payment date

---

# Page 27 — Leave Management

Employee requests leave.

Workflow:

```text
Employee
   ↓
Leave Request
   ↓
Manager Approval
   ↓
Approved / Rejected
   ↓
Attendance Updated
```

---

# Page 28 — ID Card Generator

ID card fields:

- School logo
- Student photo
- Student name
- ID
- Class
- Section
- Roll number
- Blood group
- Contact
- QR/barcode

Functions:

- Single ID
- Bulk IDs
- Print
- PDF

---

# Page 29 — Certificate Management

Certificate types:

- Bonafide
- Character certificate
- Transfer certificate
- Leaving certificate
- Merit certificate
- Custom certificate

System should support configurable templates.

---

# Page 30 — Library

## Book Management

Fields:

- ISBN
- Book title
- Author
- Publisher
- Category
- Rack
- Quantity
- Available quantity

## Issue/Return

```text
Student
   ↓
Select Book
   ↓
Issue Date
   ↓
Due Date
   ↓
Return
   ↓
Fine if applicable
```

---

# Page 31 — Inventory

Inventory features:

- Products
- Categories
- Suppliers
- Purchases
- Stock
- Sales
- Stock adjustment
- Low-stock alerts

---

# Page 32 — School Store / POS

POS screen:

```text
┌─────────────────────────────┐
│ Search Product              │
├─────────────────────────────┤
│ Product       Qty    Price  │
│ Notebook       2     ₹100   │
│ Uniform        1     ₹800   │
├─────────────────────────────┤
│ Total               ₹900    │
│                             │
│ [ CASH ] [ CARD ] [ ONLINE ]│
└─────────────────────────────┘
```

---

# Page 33 — Transport

Features:

- Vehicles
- Drivers
- Routes
- Stops
- Students assigned
- Vehicle capacity
- Transport fees
- Driver information

---

# Page 34 — Events

Event fields:

- Event name
- Date
- Time
- Location
- Description
- Participants
- Attachments

Examples:

- Annual day
- Sports day
- Parent meeting
- Holiday
- Examination

---

# Page 35 — Reports Dashboard

Reports should be categorized.

## Student Reports

- Student list
- Admission report
- Student demographic report
- Student history

## Academic Reports

- Marks
- Results
- Grades
- Performance

## Attendance Reports

- Daily
- Monthly
- Class-wise
- Student-wise

## Financial Reports

- Fees
- Outstanding
- Income
- Expense
- Transactions

## HR Reports

- Employee
- Attendance
- Payroll
- Leave

Every report should support:

- Filter
- Search
- Sort
- Print
- PDF
- Excel
- CSV

---

# Page 36 — Settings

## General Settings

- School name
- Address
- Phone
- Email
- Logo
- Website
- Academic year
- Time zone
- Currency

## Academic Settings

- Classes
- Sections
- Subjects
- Grades
- Exam types
- Marking system

## Notification Settings

- SMS
- Email
- WhatsApp
- Push notification

## User Settings

- Roles
- Permissions
- Password policy
- Session settings

---

# Page 37 — Role & Permission Management

Permission matrix:

| Module | View | Add | Edit | Delete | Export |
|---|---:|---:|---:|---:|---:|
| Students | ✓ | ✓ | ✓ | ✓ | ✓ |
| Attendance | ✓ | ✓ | ✓ | - | ✓ |
| Fees | ✓ | ✓ | ✓ | ✓ | ✓ |
| Exams | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports | ✓ | - | - | - | ✓ |

Permissions must be configurable per role.

---

# Page 38 — Audit Logs

Record:

- User
- Action
- Module
- Record ID
- Date/time
- IP address where appropriate
- Old value
- New value

Example:

```text
Admin
Updated Student
Student ID: ST10025
Old Class: 9-A
New Class: 10-A
22 Sep 2026 14:25
```

---

# 6. COMMON UI COMPONENTS

Every page should use consistent:

- Header
- Sidebar
- Breadcrumb
- Search
- Filter
- Buttons
- Data tables
- Pagination
- Modal dialogs
- Form validation
- Toast notifications
- Confirmation dialogs
- Loading states
- Empty states
- Error states

---

# 7. DATABASE REQUIREMENTS

Core entities:

```text
School
User
Role
Permission
Student
Parent
Teacher
Employee
Class
Section
Subject
Attendance
Timetable
Fee
FeePayment
Expense
Exam
ExamSubject
Question
QuestionBank
Result
Homework
Assignment
Message
Notification
LibraryBook
BookIssue
InventoryProduct
TransportVehicle
Route
Certificate
Event
Payroll
Leave
AuditLog
```

Important relationships:

```text
School
 ├── Students
 ├── Parents
 ├── Teachers
 ├── Classes
 │    ├── Sections
 │    │    ├── Students
 │    │    └── Subjects
 │    └── Teachers
 ├── Exams
 ├── Fees
 └── Employees
```

---

# 8. KEY BUSINESS WORKFLOWS

## Admission

```text
Application
 ↓
Student Registration
 ↓
Document Verification
 ↓
Class Assignment
 ↓
Section Assignment
 ↓
Fee Configuration
 ↓
Student Account Creation
 ↓
Parent Account Creation
```

## Attendance

```text
Teacher/Admin
 ↓
Select Class
 ↓
Select Date
 ↓
Mark Attendance
 ↓
Save
 ↓
Update Student Attendance
 ↓
Notify Parent if configured
```

## Examination

```text
Create Exam
 ↓
Assign Subjects
 ↓
Create Schedule
 ↓
Conduct Exam
 ↓
Enter Marks
 ↓
Calculate Result
 ↓
Review
 ↓
Publish
 ↓
Notify Parents/Students
```

## Fee

```text
Fee Structure
 ↓
Assign to Student
 ↓
Generate Due Amount
 ↓
Payment
 ↓
Receipt
 ↓
Update Outstanding
 ↓
Notification
```

## Homework

```text
Teacher
 ↓
Create Homework
 ↓
Publish
 ↓
Student Notification
 ↓
Student Submission
 ↓
Teacher Review
 ↓
Marks/Comments
```

---

# 9. NON-FUNCTIONAL REQUIREMENTS

## Performance

- Dashboard should load quickly.
- Pagination must be used for large datasets.
- Heavy reports should run asynchronously where necessary.
- Search should support indexed fields.

## Security

- Password hashing
- Role-based access control
- HTTPS
- Secure sessions
- CSRF protection
- XSS protection
- SQL injection protection
- Rate limiting
- Audit logging
- Secure file uploads

## Backup

- Automated database backup
- Backup retention policy
- Restore mechanism
- Optional manual backup

## Scalability

System should support:

- Multiple schools
- Multiple academic years
- Thousands of students
- Large attendance datasets
- Large financial datasets
- Multiple concurrent users

---

# 10. API REQUIREMENTS

Suggested REST API groups:

```text
/auth
/users
/students
/parents
/teachers
/employees
/classes
/sections
/subjects
/attendance
/timetable
/fees
/payments
/exams
/results
/homework
/assignments
/messages
/notifications
/library
/inventory
/transport
/payroll
/reports
/settings
```

Authentication:

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
```

Example:

```text
GET    /students
POST   /students
GET    /students/{id}
PUT    /students/{id}
DELETE /students/{id}
```

---

# 11. MOBILE APPLICATION

## Parent App

Screens:

1. Login
2. Dashboard
3. Child selection
4. Attendance
5. Fees
6. Homework
7. Results
8. Timetable
9. Notifications
10. Messages
11. Profile

## Teacher App

Screens:

1. Login
2. Dashboard
3. My classes
4. Attendance
5. Homework
6. Assignments
7. Exams
8. Marks
9. Timetable
10. Messages
11. Profile

## Student App

Screens:

1. Dashboard
2. Attendance
3. Timetable
4. Homework
5. Exams
6. Results
7. Study material
8. Notifications
9. Profile

---

# 12. UI DESIGN SYSTEM

## Recommended Layout

Desktop:

- Left sidebar: 250–280px
- Top header
- Main content area
- Responsive tables
- Card-based dashboard

## Colors

Suggested:

- Primary: #2563EB
- Secondary: #475569
- Success: #16A34A
- Warning: #F59E0B
- Danger: #DC2626
- Background: #F8FAFC
- White: #FFFFFF

## Typography

Recommended:

- Inter
- Roboto
- Open Sans

---

# 13. PAGE IMAGE / WIREFRAME REQUIREMENT

Each page in the final UI/UX specification should have a corresponding visual design.

For each page, the design package should contain:

1. Desktop screen
2. Tablet screen where relevant
3. Mobile screen where relevant
4. Navigation state
5. Empty state
6. Loading state
7. Error state
8. Form validation state
9. Modal/dialog states

The visual design should follow the same design system throughout the application.

---

# 14. MVP RELEASE

## Phase 1 — Core

- Login
- Dashboard
- Users
- Students
- Parents
- Teachers
- Classes
- Subjects
- Attendance
- Timetable

## Phase 2 — Academic

- Homework
- Exams
- Marks
- Results
- Question bank
- Online exams

## Phase 3 — Finance

- Fees
- Payments
- Expenses
- Accounts
- Reports

## Phase 4 — HR

- Employees
- Attendance
- Leave
- Payroll

## Phase 5 — Additional Modules

- Library
- Inventory
- Transport
- Certificates
- ID cards
- Events
- POS

## Phase 6 — Mobile

- Parent app
- Teacher app
- Student app
- Push notifications

---

# 15. ACCEPTANCE CRITERIA

A module is considered complete when:

- Required functionality is implemented.
- Role permissions work correctly.
- Validation is implemented.
- Error handling works.
- Data is stored correctly.
- Search/filter works.
- Reports are generated correctly.
- Export works where specified.
- Responsive UI works.
- Security requirements are satisfied.
- Audit requirements are satisfied.
- QA test cases pass.

---

# 16. FINAL DELIVERABLES

The complete project documentation should contain:

1. Business Requirements Document
2. Functional Requirements Document
3. UI/UX specification
4. Page-by-page wireframes
5. High-fidelity screen designs
6. User-flow diagrams
7. Database ER diagram
8. API specification
9. Role-permission matrix
10. Notification matrix
11. Report specification
12. Test cases
13. UAT document
14. Deployment specification
15. Administrator manual
16. User manual
17. Mobile application specification

---

# 17. IMPORTANT SCOPE NOTE

This document describes an **eSkooly-style school-management system based on publicly documented functionality**. It is not a claim that every screen, field, workflow or internal implementation exactly matches eSkooly's private dashboard.

For an exact clone/specification, each authenticated dashboard screen would need to be inspected and documented individually, including its actual fields, buttons, menus, workflows and permissions.
