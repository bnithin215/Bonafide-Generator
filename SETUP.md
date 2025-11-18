# Bonafide Generator - Setup Guide

A complete authentication system with user and admin dashboards for managing bonafide certificate requests.

## Features

### User Features
- User registration and login with JWT authentication
- Submit bonafide certificate requests
- View request history and status (pending/approved/rejected)
- Download approved bonafide certificates as PDF
- Track all previous bonafide requests

### Admin Features
- Admin dashboard to view all requests
- Filter requests by status (all/pending/approved/rejected)
- Approve or reject bonafide requests
- Add admin notes to requests
- Real-time statistics (total, pending, approved, rejected)
- Auto-refresh every 30 seconds

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **jsPDF** - PDF generation
- **Modern CSS** - Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- npm (comes with Node.js)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Bonafide-Generator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB

   # On macOS
   brew services start mongodb-community

   # On Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` file

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bonafide-generator

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Default Credentials
ADMIN_EMAIL=admin@tkrcollege.edu
ADMIN_PASSWORD=admin123
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

### 5. Start the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

### 6. Access the Application

Open your browser and navigate to:
- **Home Page:** http://localhost:5000
- **Register:** http://localhost:5000/register
- **Login:** http://localhost:5000/login
- **User Dashboard:** http://localhost:5000/dashboard
- **Admin Dashboard:** http://localhost:5000/admin

## Default Admin Account

On first run, a default admin account is created:

- **Email:** admin@tkrcollege.edu
- **Password:** admin123

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## Usage Guide

### For Students

1. **Register an Account**
   - Go to `/register`
   - Fill in your details (name, email, password, roll number, etc.)
   - Click "Create Account"

2. **Login**
   - Go to `/login`
   - Enter your email and password
   - You'll be redirected to your dashboard

3. **Submit Bonafide Request**
   - In your dashboard, click "New Request" tab
   - Fill in all required fields
   - Click "Submit Request"
   - Your request will be sent to admin for approval

4. **View Request Status**
   - Click "My Requests" tab
   - See all your requests with their status
   - Download PDF when request is approved

### For Administrators

1. **Login as Admin**
   - Go to `/login`
   - Use admin credentials
   - You'll be redirected to admin dashboard

2. **View All Requests**
   - See all bonafide requests from students
   - Filter by status (All/Pending/Approved/Rejected)
   - View request details

3. **Approve/Reject Requests**
   - Click "Approve" or "Reject" button
   - Add optional admin notes
   - Confirm your action
   - Student will see updated status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Bonafide Requests
- `POST /api/bonafide/request` - Submit new request (user)
- `GET /api/bonafide/my-requests` - Get user's requests (user)
- `GET /api/bonafide/all-requests` - Get all requests (admin)
- `GET /api/bonafide/request/:id` - Get single request
- `PUT /api/bonafide/approve/:id` - Approve request (admin)
- `PUT /api/bonafide/reject/:id` - Reject request (admin)
- `DELETE /api/bonafide/request/:id` - Delete request

## Project Structure

```
Bonafide-Generator/
├── config/
│   └── createAdmin.js          # Create default admin
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── models/
│   ├── User.js                 # User schema
│   └── BonafideRequest.js      # Bonafide request schema
├── routes/
│   ├── auth.js                 # Authentication routes
│   └── bonafide.js             # Bonafide routes
├── public/
│   ├── index.html              # Home page
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── dashboard.html          # User dashboard
│   ├── admin.html              # Admin dashboard
│   ├── app.js                  # PDF generation logic
│   ├── styles.css              # Styles
│   └── images.jpeg             # Logo
├── .env                        # Environment variables (create this)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies
├── server.js                   # Express server
└── README.md                   # Documentation
```

## Security Features

- **Password Hashing:** Passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Role-Based Access:** Separate user and admin roles
- **Protected Routes:** Middleware to protect sensitive endpoints
- **Input Validation:** Express-validator for request validation

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify network connectivity for MongoDB Atlas

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### Admin Not Created
- Check MongoDB connection
- Check console logs for errors
- Manually create admin user via MongoDB

### JWT Token Errors
- Clear localStorage in browser
- Re-login to get new token
- Check `JWT_SECRET` is set in `.env`

## Development

To add new features or modify existing ones:

1. **Backend Changes**
   - Models: `models/`
   - Routes: `routes/`
   - Middleware: `middleware/`

2. **Frontend Changes**
   - HTML pages: `public/`
   - Styling: `public/styles.css`
   - JavaScript: Embedded in HTML files

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas for database
4. Enable HTTPS
5. Set up proper CORS configuration
6. Use process manager like PM2

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Check MongoDB and Node.js logs

## License

MIT License

---

**Developed for TKR College of Engineering & Technology**
