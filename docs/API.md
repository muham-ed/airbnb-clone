# Airbnb Clone - System Architecture & API Documentation

## Overview
This document provides an overview of the RESTful API endpoints, security mechanisms, database constraints, and architecture for the **Airbnb Clone System**.

- **Backend Base URL:** `http://localhost:5000/api/v1`
- **Architecture:** Modular Monolith (Express.js, TypeScript, PostgreSQL, Prisma ORM, Redis)
- **Security Protocols:** JWT Authentication, PostgreSQL Exclusion Constraints for double-booking prevention, Helmet Security Headers, Zod Validation, Express Rate Limiting.

---

## 🔑 Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new user (`GUEST` or `HOST`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user and return JWT token |

---

## 🏠 Listing Endpoints (`/api/v1/listings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/listings` | Public | Fetch property listings (supports search & filters: `location`, `minPrice`, `maxPrice`) |
| `GET` | `/api/v1/listings/:id` | Public | Get listing details by UUID |
| `POST` | `/api/v1/listings` | `HOST` | Create a new property listing |
| `GET` | `/api/v1/listings/my-listings` | `HOST` | Fetch properties created by logged-in host |
| `PATCH` | `/api/v1/listings/:id/approve` | `ADMIN` | Approve or reject property listing |
| `DELETE` | `/api/v1/listings/:id` | `HOST` | Delete property listing |

---

## 📅 Booking Endpoints (`/api/v1/bookings`)

> 🛡️ **Overbooking Prevention:** Bookings are protected at database-level using PostgreSQL `EXCLUDE CONSTRAINT` with `tsrange` and `Serializable` isolation to ensure zero double-booking conflicts.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | `GUEST` / Authenticated | Create a new property booking reservation |
| `GET` | `/api/v1/bookings/my-bookings` | Authenticated | Fetch bookings for current logged-in user |
| `GET` | `/api/v1/bookings/:id` | Authenticated | Fetch booking receipt and details |

---

## 💳 Payment & Webhook Endpoints (`/api/v1/payments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments/checkout` | Authenticated | Create Stripe Checkout session for a booking |
| `POST` | `/api/v1/payments/webhook` | Stripe Webhook | Receive real-time payment status updates |

---

## ❤️ Wishlist Endpoints (`/api/v1/wishlists`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/wishlists` | Authenticated | Get user's saved wishlist collections |
| `POST` | `/api/v1/wishlists` | Authenticated | Add listing to user's saved wishlist |
