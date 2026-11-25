# StudyNotion — Development & Troubleshooting Guide

This guide covers setup instructions, environment variable configuration, local execution workflows, and step-by-step troubleshooting procedures for developers running **StudyNotion**.

---

## 1. Prerequisites

Before running the application locally, ensure your machine has the following tools installed:

* **Node.js**: `v18.x` or higher (tested with Node 18, 20, and 24).
* **npm**: `v9.x` or higher.
* **MongoDB Atlas Account**: Or a locally running MongoDB instance (`mongodb://127.0.0.1:27017/studynotion`).
* **Cloudinary Account**: For course thumbnail and video uploads.
* **Razorpay Account (Test Mode)**: For simulated checkout and order creation.
* **SMTP Email Credentials**: (Gmail App Password or SendGrid/Mailgun) for OTP verification and enrollment receipts.

---

## 2. Dependency Installation

The repository contains two `package.json` files: one in the project root for the React client and root tooling, and another inside `SERVER/` for the Express backend.

### Step 1: Install Root & Client Dependencies
From the repository root:
```bash
npm install
```

### Step 2: Install Backend Dependencies
Navigate to the `SERVER/` directory and install the server packages:
```bash
cd SERVER
npm install
cd ..
```

---

## 3. Environment Variables Configuration

Both the frontend and backend require environment variables to communicate and authenticate with third-party services.

### Root `.env` (Frontend & Shared Configuration)
Create a `.env` file in the project root:

```env
# Client API Gateway
REACT_APP_BASE_URL=http://localhost:4000/api/v1

# Razorpay Client Public Key (Must start with REACT_APP_ to be accessible in browser)
REACT_APP_RAZORPAY_KEY=rzp_test_YOUR_RAZORPAY_KEY_ID

# Shared Server Variables (Loaded by SERVER/index.js fallback)
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/StudyNotion?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_passphrase
FOLDER_NAME=StudyNotion

# Cloudinary Storage
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay Backend Credentials
RAZORPAY_KEY=rzp_test_YOUR_RAZORPAY_KEY_ID
RAZORPAY_SECRET=your_razorpay_key_secret

# Nodemailer SMTP Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

### `SERVER/.env` (Dedicated Backend Configuration)
For modularity, place an equivalent `.env` inside the `SERVER/` directory:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/StudyNotion?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_passphrase
FOLDER_NAME=StudyNotion

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY=rzp_test_YOUR_RAZORPAY_KEY_ID
RAZORPAY_SECRET=your_razorpay_key_secret

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

> [!IMPORTANT]
> Never commit `.env` files to Git. Both `.env` and `SERVER/.env` are ignored by `.gitignore`.

---

## 4. Starting the Application

You can launch both the frontend and backend servers simultaneously using the root development script:

```bash
npm run dev
```

This uses `concurrently` to run:
* **Frontend**: `npm start` (Runs on `http://localhost:3000`)
* **Backend**: `npm run server` (Runs on `http://localhost:4000` via `nodemon`)

### Running in Separate Terminals (Recommended for Debugging)

* **Terminal 1 — Backend:**
  ```bash
  cd SERVER
  npm run dev
  ```
  Expected output:
  ```text
  App is listening at 4000
  DB Connection Success
  ```

* **Terminal 2 — Frontend:**
  ```bash
  npm start
  ```
  Expected output:
  ```text
  Compiled successfully!
  You can now view react-tailwind-css-starter-pack in the browser.
    Local: http://localhost:3000
  ```

---

## 5. Troubleshooting & Diagnostics

### 1. MongoDB Connection Issues
* **Symptom:** `DB Connection Failed` followed by `MongooseServerSelectionError` or process exit.
* **Causes & Solutions:**
  * **IP Whitelist:** MongoDB Atlas blocks unlisted IP addresses. In MongoDB Atlas, go to **Network Access** > **IP Access List** and ensure your current IP or `0.0.0.0/0` (allow access from anywhere) is whitelisted.
  * **Variable Name Mismatch:** The connection string in `SERVER/config/database.js` checks `process.env.MONGODB_URL || process.env.MONGO_URI`. Ensure your `.env` contains either `MONGO_URI` or `MONGODB_URL`.
  * **Special Characters in Password:** If your Atlas database user password contains characters like `@`, `#`, or `/`, encode them using percent-encoding (e.g. `@` becomes `%40`) or reset the database user password to an alphanumeric string.

### 2. Port Conflicts
* **Symptom:** `Error: listen EADDRINUSE: address already in use :::4000` or `Port 3000 is already in use`.
* **Resolution (Windows PowerShell):**
  Find the PID occupying the port and terminate it:
  ```powershell
  # Check port 4000
  netstat -ano | findstr :4000
  # Stop the process by PID
  taskkill /PID <PID_NUMBER> /F

  # Check port 3000
  netstat -ano | findstr :3000
  taskkill /PID <PID_NUMBER> /F
  ```

### 3. Razorpay Test Mode Setup
* **Symptom:** `Payment Failed because of a configuration error. Authentication key was missing during initialization.`
* **Solution:**
  1. Confirm your Razorpay Key ID begins with `rzp_test_`.
  2. Verify that `REACT_APP_RAZORPAY_KEY` exists in root `.env`.
  3. Ensure the backend returns `keyId: process.env.RAZORPAY_KEY` in response to `/api/v1/payment/capturePayment`.
  4. Ensure you test course purchases using an account with `accountType: "Student"`. Instructors are restricted from purchasing courses to maintain platform integrity.
* **Simulating Successful Payments:**
  * Select **Netbanking** > Choose any bank (e.g., SBI, HDFC) > Click **Pay**.
  * A test modal will appear with **Success** and **Failure** buttons. Click **Success** to verify HMAC signature generation and immediate course enrollment.

### 4. Course Thumbnail Upload & Image Errors
* **Symptom:** `"Course Thumbnail is required"` validation error persists even after selecting an image.
* **Solution:**
  * Ensure the input inside `Upload.jsx` does not override `react-dropzone`'s ref (`<input {...getInputProps()} />`).
  * Verify that Cloudinary credentials (`CLOUD_NAME`, `API_KEY`, `API_SECRET`, and `FOLDER_NAME`) are non-empty in `SERVER/.env`.

### 5. Swiper & Build Incompatibilities
* **Symptom:** `export 'FreeMode' was not found in 'swiper'`.
* **Solution:** Swiper v8+ modularizes exports. In `Course_Slider.jsx` and `ReviewSlider.jsx`, import modules directly from `"swiper"`:
  ```javascript
  import { FreeMode, Pagination, Autoplay } from "swiper"
  ```
  Ensure Swiper CSS imports (`swiper/css`, `swiper/css/free-mode`, `swiper/css/pagination`) are present.
