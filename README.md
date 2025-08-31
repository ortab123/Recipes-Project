# Recipes API

A simple REST API for managing recipes, built with **Node.js** and **Express**.  
This is an **ongoing project** — new features and improvements are added every week.

---

## Technologies Used

- **Node.js** + **Express**
- **UUID** for unique recipe IDs
- **Morgan** for request logging
- **express-rate-limit** for request throttling
- **Custom Middlewares** for error handling and validation
- **JSON data store** (using `recipes.json` instead of a database at this stage)

---

## Project Structure

```
controllers/
└── recipesController.js # Core API logic
data/
└── recipes.json # Current data storage (JSON file)
middlewares/
├── errorHandler.js # Global error handler
├── rateLimiter.js # Request limiting per IP
└── validators.js # Input validation
routes/
└── recipes.js # API route definitions
utils/
└── dataStore.js # Read/write utilities for JSON storage
package.json
package-lock.json
server.js # Main server entry point

```

---

## Installation & Run

```bash
# Install dependencies
npm install

# Start the server
npm start

The server runs by default on:
http://localhost:3000

```

## Current Features:

CRUD for recipes: create, read, update, delete

Filtering by difficulty, max cooking time, search query, and minimum rating

Sorting by date, rating, or cooking time

Update recipe rating through a dedicated endpoint

Basic statistics endpoint (recipe count, average cooking time, most common ingredients)

Rate limiting (20 requests per minute per IP)

Logging with Morgan using the dev format

## Planned Features

More validation rules (via validators.js)

Authentication and user management

Switch from JSON file to a real database

Unit tests and integration tests

Advanced search and pagination

## API Endpoints (Overview)

GET /api/recipes — fetch all recipes (with filtering/sorting options)

GET /api/recipes/:id — fetch a single recipe by ID

POST /api/recipes — create a new recipe

PATCH /api/recipes/:id — update an existing recipe

PATCH /api/recipes/:id/rating — update recipe rating only

DELETE /api/recipes/:id — remove a recipe

GET /api/recipes/stats — fetch general recipe statistics

## Notes

This project is still under development — expect frequent updates.

For testing, Postman collections are recommended.

No database is used yet — all data is stored in recipes.json.

```

```
