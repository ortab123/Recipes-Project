# 🍳 Recipes API

A full-stack REST API for managing recipes with user authentication and file uploads, built with **Node.js**, **Express**, and **MySQL/PostgreSQL**.  
This is an **ongoing project** — new features and improvements are added every week.

**🌐 Live API:** https://recipes-api-mu1w.onrender.com

---

## 🛠 Technologies Used

- **Node.js** + **Express**
- **Sequelize ORM** with **MySQL** (development) / **PostgreSQL** (production)
- **JWT Authentication** for secure user sessions
- **Multer** for file upload handling
- **bcrypt** for password hashing
- **UUID** for unique IDs
- **Morgan** for request logging
- **express-rate-limit** for request throttling
- **Custom Middlewares** for error handling, validation, and authorization
- **Deployed on Render** with PostgreSQL database

---

## 📂 Project Structure

```
config/
└── database.js           # Database connection (MySQL/PostgreSQL)
controllers/
├── authController.js     # Authentication logic
├── favoritesController.js # User favorites management
└── recipesController.js  # Recipe CRUD operations
data/
└── recipes.json         # Legacy data (not used in Step 2)
middlewares/
├── authMiddleware.js    # JWT token verification
├── checkRecipeOwnership.js # Recipe ownership validation
├── errorHandler.js      # Global error handler
├── preprocessRecipe.js  # Recipe data preprocessing
├── rateLimiter.js      # Request limiting per IP
├── upload.js           # File upload configuration
└── validators.js       # Input validation
migrations/
└── 20250906204152-add-fields-to-recipes.js # Database migrations
models/
├── index.js            # Sequelize models index
├── recipe.js           # Recipe model definition
├── user.js             # User model definition
└── userFavorite.js     # User-Recipe favorites relationship
routes/
├── auth.js             # Authentication routes
├── favorites.js        # User favorites routes
└── recipes.js          # Recipe routes
seeders/                # Database seeders
uploads/
└── recipes/            # Uploaded recipe images storage
package.json
server.js              # Main server entry point
```

---

## 🗄️ Database Schema

### Users Table

```sql
- id: UUID (Primary Key)
- username: String (unique, 3-30 chars)
- email: String (unique, valid email)
- password: String (hashed with bcrypt)
- firstName: String
- lastName: String
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Recipes Table

```sql
- id: UUID (Primary Key)
- title: String (required)
- description: Text
- ingredients: JSON Array
- instructions: JSON Array
- cookingTime: Integer (minutes)
- servings: Integer
- difficulty: String (easy/medium/hard)
- rating: Float
- imageUrl: String (uploaded image path)
- userId: UUID (Foreign Key → Users)
- createdAt: Timestamp
- updatedAt: Timestamp
```

### UserFavorites Table

```sql
- id: Primary Key
- userId: UUID (Foreign Key → Users)
- recipeId: UUID (Foreign Key → Recipes)
- createdAt: Timestamp
```

---

## 🚀 Installation & Setup

### Development Environment

```bash
# Clone the repository
git clone https://github.com/ortab123/Recipes-Project.git
cd Recipes-Project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Start the server
npm run dev

# Server runs on: http://localhost:3000
```

### Environment Variables

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secure-secret-key
DATABASE_URL=mysql://root:password@localhost:3306/recipes_db
```

---

## 🔐 Authentication System

### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile

```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

---

## 📌 API Endpoints

### Public Recipes

- `GET /api/recipes` — Fetch all public recipes (with filtering/sorting)
- `GET /api/recipes/:id` — Fetch single recipe by ID

### Protected Recipe Operations

- `POST /api/recipes` — Create new recipe (with image upload)
- `PUT /api/recipes/:id` — Update recipe (owner only)
- `DELETE /api/recipes/:id` — Delete recipe (owner only)
- `GET /api/recipes/my-recipes` — Get current user's recipes

### User Favorites

- `POST /api/users/favorites/:recipeId` — Add recipe to favorites
- `DELETE /api/users/favorites/:recipeId` — Remove from favorites
- `GET /api/users/favorites` — Get user's favorite recipes

### File Upload

- Recipe images: `multipart/form-data` with `image` field
- Supported formats: JPG, JPEG, PNG
- Max file size: 5MB
- Storage: `/uploads/recipes/`

---

## ✨ Current Features (Step 2)

### 🔒 Authentication & Authorization

- JWT-based user authentication
- Protected routes with token verification
- Recipe ownership validation
- User registration and login

### 📁 File Upload System

- Image upload for recipes
- File type and size validation
- Secure file storage
- Image serving via static routes

### 🗃️ Database Integration

- Sequelize ORM with MySQL (dev) / PostgreSQL (prod)
- User-Recipe relationships
- Many-to-many favorites system
- Database migrations and seeders

### 🌐 Production Deployment

- Deployed on Render.com
- Environment-based configuration
- PostgreSQL production database
- Static file serving

### 🛡️ Enhanced Security

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (20 requests/minute)
- Input validation and sanitization

---

## 🧭 Advanced Filtering & Search

```http
GET /api/recipes?difficulty=easy&maxCookingTime=30&search=pasta&minRating=4&sortBy=rating&sortOrder=desc
```

**Query Parameters:**

- `difficulty` — Filter by difficulty level
- `maxCookingTime` — Maximum cooking time in minutes
- `search` — Search in title and description
- `minRating` — Minimum recipe rating
- `sortBy` — Sort by: `createdAt`, `rating`, `cookingTime`
- `sortOrder` — Order: `asc` or `desc`

---

## 🧪 Testing

### Authentication Testing

- User registration with valid/invalid data
- Login with correct/incorrect credentials
- Protected routes with/without valid tokens
- Token expiration handling

### File Upload Testing

- Image upload with valid/invalid file types
- Upload size limit testing
- Recipe creation with/without images

### Database Testing

- User-recipe relationships
- Favorites functionality
- Cascade operations

---

## 📊 Development vs Production

| Feature      | Development      | Production         |
| ------------ | ---------------- | ------------------ |
| Database     | MySQL 5.5        | PostgreSQL 15      |
| Environment  | Local            | Render.com         |
| File Storage | Local `/uploads` | Local `/uploads`\* |
| Logging      | Development mode | Production mode    |

_Note: For production file storage, consider upgrading to cloud storage (AWS S3, Cloudinary) as Render's ephemeral filesystem resets on deployment._

---

## 🚀 Next Steps (Step 3)

- **Advanced Search & Pagination**
- **Recipe Categories & Tags**
- **User Profiles & Social Features**
- **Recipe Reviews & Comments**
- **Cloud Storage Integration**
- **Unit & Integration Testing**
- **API Documentation with Swagger**
- **Frontend Integration**

---

## 🤝 Contributing

This is an educational project that evolves weekly. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📝 Notes

- **Step 1**: Basic CRUD with JSON storage ✅
- **Step 2**: Authentication, MySQL/PostgreSQL, File Uploads, Production Deployment ✅
- **Step 3**: Coming next week...

For testing, use Postman with the provided endpoint examples. The live API is available at the URL above for testing production functionality.
