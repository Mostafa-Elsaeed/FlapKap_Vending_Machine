# Vending Machine API

A NestJS-based REST API for a digital vending machine system that supports user authentication, product management, and transaction processing.

## Overview

This application provides a backend API for a vending machine platform with role-based access control. It allows for:

- User authentication (signup/login)
- Role-based operations (buyer/seller)
- Product management
- Deposit management
- Purchase transactions

## System Architecture

The application is built with NestJS and uses:

- PostgreSQL database
- JWT-based authentication
- Role-based access control

## API Endpoints

### Authentication (`/auth`)

| Endpoint              | Method | Description                              | Access      |
| --------------------- | ------ | ---------------------------------------- | ----------- |
| `/auth/login`         | POST   | Authenticate user and generate JWT token | Public      |
| `/auth/signup`        | POST   | Register a new user                      | Public      |
| `/auth/create-seller` | POST   | Create a seller account                  | SELLER role |

### Users (`/users`)

| Endpoint         | Method | Description                      | Access     |
| ---------------- | ------ | -------------------------------- | ---------- |
| `/users/deposit` | POST   | Deposit coins into buyer account | BUYER role |
| `/users/reset`   | POST   | Reset user's deposit balance     | BUYER role |

### Products (`/products`)

| Endpoint        | Method | Description          | Access      |
| --------------- | ------ | -------------------- | ----------- |
| `/products`     | GET    | Get all products     | Public      |
| `/products`     | POST   | Create a new product | SELLER role |
| `/products/:id` | PUT    | Update a product     | SELLER role |
| `/products/:id` | DELETE | Delete a product     | SELLER role |

### Transactions (`/transactions`)

| Endpoint            | Method | Description        | Access     |
| ------------------- | ------ | ------------------ | ---------- |
| `/transactions/buy` | POST   | Purchase a product | BUYER role |

## Role-Based Access

The system implements two main roles:

- **BUYER**: Can deposit coins, make purchases, and reset their deposit
- **SELLER**: Can create, update, and delete products

## Environment Configuration

The application uses environment variables for configuration:

- Database connection details
- JWT authentication settings
- Environment mode (development/production)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running with Docker

You can easily run the application using Docker and Docker Compose:

1. Make sure you have Docker and Docker Compose installed on your system
2. Build and start the containers:

```bash
docker-compose up -d
```

This will start both the application and the PostgreSQL database in containers.

### Running Locally

Alternatively, if you prefer to run the application locally:

1. Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env
```

2. Modify the `.env` file with your own database credentials and other settings
3. Run database migrations:

```bash
npm run migrations
```

4. Seed the database with initial data:

```bash
npm run seed
```

5. Start the application:

```bash
npm run start:dev
```
