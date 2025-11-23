# Ambient Sound Marketplace

A full-stack microservices-based ambient sound marketplace where users can upload, preview, purchase, and download high-quality soundscapes. Each authenticated user can act as both creator and customer, contributing their own audio while buying sounds from others.

Every sound includes a 25-second free preview, detailed description, category tags, and automatic download tracking. After completing a purchase, users gain immediate access to the full audio file.

## Features

### User Accounts

- Secure registration and login
- Users can upload their own sounds
- Users can buy sounds from other creators
- Profile includes uploaded sounds and the ability to delete them

### Sound Marketplace

Each sound includes:

- Full description with duration, size, and format received from audio
- 25-second preview, download counter

Main shop page includes:

- Category filtering
- Purchased items filter
- Search bar

### Orders & Payments

- Order service manages purchases
- Payment service confirms transactions
- Successful payment grants access to download

## Microservices Architecture

This project consists of 4 backend services + client:

1. Auth Service – Handles user registration, login, JWT
2. Product Service – Manages sounds, previews, categories, download counts
3. Order Service – Manages orders and purchase flow
4. Payment Service – Handles payment confirmation
5. Client (Next.js) – Frontend UI for browsing, filtering, purchasing
6. RabbitMQ is used for communication between services.

## Tech Stack

### Backend

- NestJS (microservices)
- RabbitMQ (message broker)
- MongoDB (database for all services)
- Stripe (payment processing)

### Frontend

- Next.js (React-based frontend)

### Infrastructure

Initially developed using Kubernetes. Later migrated to Docker Compose for easier deployment and development.

All services fully containerized.

### Live preview here under the link
https://soundio-1.onrender.com/

## How to run locally

1. Clone the repository
git clone https://github.com/your-repo/soundio.git

2. Create .env files for each service (Auth, Product, Order, Payment) with required environment variables (specified at .env.example).

3. Start all services with Docker Compose
docker compose up --build
