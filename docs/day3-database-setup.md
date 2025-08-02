# Day 3 – Database Setup (PostgreSQL)

Today we set up a **PostgreSQL database** using Docker Compose and created our initial schema for the Ride Booking Platform.

---

## Why PostgreSQL First (not MongoDB)?

- **Relational nature** of users, drivers, and trips makes SQL a natural fit.
- **Transactional consistency** is critical for booking systems.
- We will still use MongoDB later for analytics/log storage.

---

## Steps

### 1. Docker Compose for PostgreSQL

We added `docker-compose.yml` at the root:

### 2. Run PostgreSQL using below command

`docker-compose up -d`
