# PSG CAS Alumni Portal - Frontend

A modern, responsive web application frontend for the PSG CAS Alumni Portal built with React, Vite, and Tailwind CSS.

## 🎯 Features

## 🛠️ Tech Stack

- **Frontend:** React 19.2.0, Vite 7.2.2, Tailwind CSS 4.1.17
- **Animations:** Framer Motion 12.23.24
- **Icons:** Lucide React 0.554.0
- **Routing:** React Router DOM 7.9.6
- **Payment:** Razorpay Checkout
- **Deployment:** Docker + Nginx (SPA routing)

The admin dashboard includes paid-alumni approval and editing, duplicate review,
CSV import/export, receipt resend, homepage and leadership content management, and
password change. Membership registration redirects to the server-created payment
session and confirms the profile only after the backend verifies the payment result.

## Validation

Run `npm test` to lint the frontend and verify that it produces a production build.
