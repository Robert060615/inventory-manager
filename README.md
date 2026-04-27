# SPIIK Inventory Manager

A web application for managing SPIIK student association's physical inventory — overalls, badges, shirts, and other merchandise. Built for the association's board members to track stock levels, log every change, and undo mistakes.

## Features

- **Product management** – Add, edit, and delete products with attributes like name, category, size, and quantity
- **Change history** – Every update is logged with who changed what, when, and the old vs new value
- **Undo changes** – Revert any logged change to restore the previous value
- **Access control** – No public registration; new users are invited by existing board members
- **Dashboard** – Overview of current inventory with warnings for low or zero stock

## Tech stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS (server-rendered templates)
- **Auth:** JWT (httpOnly cookies), bcrypt
- **Deployment:** Ubuntu/Cumulus, Nginx, Let's Encrypt

## Getting started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a connection string)
