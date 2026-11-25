# StudyNotion — Project Structure & Architecture Guide

This document outlines the directory structure and responsibilities of key components in the **StudyNotion** full-stack educational technology platform.

---

## High-Level Repository Layout

```text
StudyNotion/
├── public/                 # Static assets and HTML template for React
├── src/                    # Frontend React source code
│   ├── assets/             # Images, SVG illustrations, logos
│   ├── components/         # Reusable and page-specific UI components
│   │   ├── Common/         # Cross-app components (Navbar, Footer, Modals, Sliders)
│   │   └── core/           # Domain-specific components (Auth, Dashboard, Course, Catalog)
│   ├── data/               # Static navigation and footer data
│   ├── hooks/              # Custom React hooks (e.g. useOnClickOutside)
│   ├── pages/              # Top-level view components (Home, Catalog, CourseDetails, etc.)
│   ├── reducer/            # Redux root reducer
│   ├── services/           # Backend API connector and async operation handlers
│   ├── slices/             # Redux Toolkit state slices
│   └── utils/              # Client-side utility functions and constants
├── SERVER/                 # Backend Node.js / Express application
│   ├── config/             # Third-party configurations (Cloudinary, Database, Razorpay)
│   ├── controllers/        # Request handling and business logic
│   ├── mail/               # HTML email templates
│   ├── middleware/         # Authentication and role-authorization middleware
│   ├── models/             # Mongoose schemas and data models
│   ├── routes/             # Express API route declarations
│   └── utils/              # Server helper utilities (image uploader, mail sender)
├── docs/                   # Developer and architecture documentation
├── .env                    # Root environment configuration (Frontend + shared)
├── .gitignore              # Git ignore rules for logs, build artifacts, and env files
├── package.json            # Root npm configuration, scripts, and frontend dependencies
├── tailwind.config.js      # Tailwind CSS configuration and theme design tokens
└── README.md               # Main project documentation
```

---

## 1. Frontend (`src/`) Architecture

The frontend is a single-page application built with **React 18**, **Tailwind CSS**, and **Redux Toolkit**.

### `src/components/`
* **`Common/`**: Universal UI components shared across views:
  * `Navbar.jsx`: Global header navigation with responsive mobile menu, authentication buttons, shopping cart badge, and dynamic Catalog category dropdown.
  * `Footer.jsx`: Platform footer containing resource links, social handles, and curriculum pathways.
  * `ReviewSlider.jsx`: Swiper-based carousel displaying student ratings and testimonials on the homepage.
  * `RatingStars.jsx`: Visual star rating generator supporting fractional ratings.
  * `ConfirmationModal.jsx`: Reusable modal for logout confirmations, account deletion, and cart purchase prompts.
* **`core/Auth/`**: Authentication forms (`LoginForm.jsx`, `SignupForm.jsx`, `ProfileDropdown.jsx`) with role toggle between Student and Instructor.
* **`core/Dashboard/`**: Dashboard views and user management:
  * `Sidebar.jsx` & `SidebarLink.jsx`: Collapsible navigation for profile settings, enrolled courses, instructor dashboard, and course creation.
  * `AddCourse/`: Multi-step course creation workflow:
    * `RenderSteps.jsx`: Stepper controller (Step 1: Information, Step 2: Content Builder, Step 3: Publish).
    * `CourseInformation/`: Form containing title, description, price, category select, `ChipInput.jsx` for tags, and `RequirementsField.jsx` for prerequisites.
    * `Upload.jsx`: Drag-and-drop file upload using `react-dropzone` for thumbnails and lecture videos.
    * `CourseBuilder/`: Nested section and subsection accordion editor for uploading video lectures.
    * `PublishCourse/`: Draft vs. Public visibility toggling.
  * `Cart/`: Shopping cart list and total calculation widget.
  * `EnrolledCourses.jsx`: Student course inventory with progress bars.
  * `InstructorCourses/`: Table of instructor courses with status badges, price, and delete actions.
  * `InstructorDashboard/`: Income and enrollment visualization using Chart.js.
  * `Settings/`: Password updates, profile details, and avatar image replacement.
* **`core/Course/`**: Course detail widgets:
  * `CourseDetailsCard.jsx`: Right-hand floating card with price, thumbnail, Buy Now, and Add to Cart buttons.
  * `CourseAccordionBar.jsx`: Collapsible curriculum syllabus preview.
* **`core/ViewCourse/`**: Student course consumption interface:
  * `VideoDetails.jsx`: Video playback using `video-react` with mark-completed triggers.
  * `VideoDetailsSidebar.jsx`: Lesson playlist sidebar tracking completed lectures.
  * `CourseReviewModal.jsx`: Modal for leaving course ratings and reviews.

### `src/services/`
* **`apiConnector.js`**: Central Axios client instance with standard request interceptors.
* **`apis.js`**: Central dictionary of all backend API endpoint URLs organized by domain.
* **`operations/`**: Asynchronous thunk-like operational handlers that dispatch Redux actions, trigger toast alerts, and communicate with the backend:
  * `authAPI.js`: Login, signup, password resets, and OTP handling.
  * `profileAPI.js`: User details, enrolled courses, and instructor dashboard metrics.
  * `courseDetailsAPI.js`: Course CRUD, category fetching, sections, subsections, and ratings.
  * `studentFeaturesAPI.js`: Razorpay checkout initialization and payment signature verification.
  * `pageAndComponntDatas.js`: Category page and catalog aggregation requests.

### `src/slices/` (Redux State)
* **`authSlice.js`**: Token management and login authentication state.
* **`profileSlice.js`**: User profile details and role state.
* **`cartSlice.js`**: Client-side cart item storage persisted in `localStorage`.
* **`courseSlice.js`**: Active course being created or edited, current stepper index, and payment loading flags.
* **`viewCourseSlice.js`**: Active lecture playback, section tree, and completed lecture ID tracking.

---

## 2. Backend (`SERVER/`) Architecture

The backend is a RESTful API powered by **Node.js**, **Express**, and **Mongoose**.

### `SERVER/config/`
* **`database.js`**: MongoDB connection handler using Mongoose.
* **`cloudinary.js`**: Cloudinary SDK credentials configuration for media assets.
* **`razorpay.js`**: Razorpay SDK initialization for handling orders.

### `SERVER/models/`
* **`User.js`**: Core account schema with references to profile details, enrolled courses, course progress, and account type (`Admin`, `Student`, `Instructor`).
* **`Profile.js`**: Auxiliary profile data (gender, date of birth, bio, contact number).
* **`Course.js`**: Course entity including title, description, instructor ID, syllabus sections, category, thumbnail URL, price, enrollment list, tags, requirements, and publication status (`Draft` or `Published`).
* **`Section.js`**: Course content module holding references to subsections.
* **`Subsection.js`**: Individual lecture item storing title, duration, video URL, and description.
* **`Category.js`**: Topic categories grouping related courses.
* **`CourseProgress.js`**: Tracking student completion across specific lecture IDs.
* **`RatingAndReview.js`**: Course reviews and star ratings linked to user and course.
* **`OTP.js`**: Temporary one-time passcodes with MongoDB TTL indexes for automatic document expiration.

### `SERVER/controllers/`
* **`Auth.js`**: OTP generation, user registration, JWT generation, password changes.
* **`ResetPassword.js`**: Password reset token generation and verification via emailed recovery links.
* **`Course.js`**: Course creation, metadata updates, thumbnail uploads to Cloudinary, and full course queries.
* **`Section.js` & `Subsection.js`**: Curriculum section hierarchy CRUD operations and video uploads.
* **`Category.js`**: Category creation, listing, and catalog page data aggregation.
* **`Payments.js`**: Razorpay order capture, HMAC-SHA256 signature verification, and student course enrollment.
* **`Profile.js`**: Profile updates, avatar replacement, student enrollment queries, and instructor earnings analytics.
* **`CourseProgress.js`**: Video lecture completion tracking.

### `SERVER/middleware/`
* **`auth.js`**:
  * `auth`: Validates JWT token from cookies, headers, or body; extracts user ID and role payload.
  * `isStudent`: Restricts route access to student accounts.
  * `isInstructor`: Restricts route access to instructor accounts.
  * `isAdmin`: Restricts route access to platform administrators.

### `SERVER/routes/`
* **`user.js`**: Mounted at `/api/v1/auth` (login, signup, OTP, password reset).
* **`profile.js`**: Mounted at `/api/v1/profile` (profile, avatar, analytics).
* **`Course.js`**: Mounted at `/api/v1/course` (courses, categories, sections, lectures, ratings, progress).
* **`Payments.js`**: Mounted at `/api/v1/payment` (order capture, signature verification, payment email).
* **`Contact.js`**: Mounted at `/api/v1/reach` (contact form submission).
