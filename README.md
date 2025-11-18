# 📝 Bonafide Certificate Generator

A comprehensive web-based application for generating bonafide certificates for students with authentication, admin panel, and Firebase backend.

## 🌟 Features

### User Features
- **User Authentication**: Secure registration and login system
- **Student Dashboard**: View and manage bonafide certificate requests
- **Certificate Request**: Submit requests with complete student information
- **Request Status**: Track request status (Pending, Approved, Rejected)
- **PDF Generation**: Download approved certificates as PDF

### Admin Features
- **Admin Dashboard**: View all certificate requests
- **Request Management**: Approve or reject student requests
- **Admin Notes**: Add notes to requests during approval/rejection
- **User Overview**: View all registered users

### Technical Features
- **Firebase Backend**: Firestore database for scalable data storage
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured API endpoints
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant status updates

## 🏗️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- jsPDF (PDF generation)

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- Firestore Database

### Authentication & Security
- JWT (JSON Web Tokens)
- bcrypt (Password hashing)
- Express Validator
- CORS

## 📂 Project Structure

```
Bonafide-Generator/
├── config/
│   ├── firebase.js           # Firebase Admin SDK configuration
│   └── createAdmin.js        # Default admin user creation
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── User.js               # User model (Firestore)
│   └── BonafideRequest.js    # Bonafide request model (Firestore)
├── routes/
│   ├── auth.js               # Authentication routes
│   └── bonafide.js           # Bonafide request routes
├── services/
│   └── firestore.js          # Firestore service layer
├── public/
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── dashboard.html        # User dashboard
│   ├── admin.html            # Admin dashboard
│   ├── app.js                # PDF generation logic
│   └── firebase-config.js    # Firebase client configuration
├── server.js                 # Main server file
├── package.json              # Dependencies
├── firebase.json             # Firebase hosting config
├── .firebaserc               # Firebase project config
├── firestore.rules           # Firestore security rules
└── .env                      # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Firebase CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bnithin215/Bonafide-Generator.git
   cd Bonafide-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Firebase Configuration
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   FIREBASE_MEASUREMENT_ID=your-measurement-id

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d

   # Admin Credentials
   ADMIN_EMAIL=admin@tkrcollege.edu
   ADMIN_PASSWORD=admin123
   ```

4. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Copy your Firebase config to the `.env` file
   - (Optional) Download service account key for production

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:5000`

## 🔐 Default Admin Credentials

On first run, a default admin user is created:
- **Email**: admin@tkrcollege.edu
- **Password**: admin123

**⚠️ Important**: Change these credentials immediately after first login!

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Bonafide Request Routes
- `POST /api/bonafide/request` - Submit bonafide request (Protected)
- `GET /api/bonafide/my-requests` - Get user's requests (Protected)
- `GET /api/bonafide/all-requests` - Get all requests (Admin only)
- `GET /api/bonafide/request/:id` - Get single request (Protected)
- `PUT /api/bonafide/approve/:id` - Approve request (Admin only)
- `PUT /api/bonafide/reject/:id` - Reject request (Admin only)
- `DELETE /api/bonafide/request/:id` - Delete request (Protected)

## 🚢 Deployment

### Deploy to Firebase Hosting

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not already done)**
   ```bash
   firebase init
   ```
   - Select Hosting and Firestore
   - Choose your Firebase project
   - Use default settings

3. **Deploy**
   ```bash
   firebase deploy
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 Database Structure

### Users Collection
```javascript
{
  id: "auto-generated",
  name: "string",
  email: "string",
  password: "hashed-string",
  role: "user" | "admin",
  rollNumber: "string",
  department: "string",
  course: "string",
  fatherName: "string",
  dateOfBirth: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Bonafide Requests Collection
```javascript
{
  id: "auto-generated",
  userId: "user-id",
  studentName: "string",
  rollNumber: "string",
  fatherName: "string",
  department: "string",
  course: "string",
  academicYear: "string",
  dateOfBirth: "string",
  purpose: "string",
  conduct: "string",
  status: "pending" | "approved" | "rejected",
  adminNotes: "string",
  approvedBy: "admin-id",
  approvedAt: "timestamp",
  pdfGenerated: boolean,
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Firestore security rules for data access control
- Input validation using express-validator
- CORS enabled for controlled access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Nithin B**
- GitHub: [@bnithin215](https://github.com/bnithin215)

## 🙏 Acknowledgments

- TKR College of Engineering & Technology
- Firebase for backend infrastructure
- Express.js community
- All contributors

## 📧 Support

For support, email admin@tkrcollege.edu or create an issue in the repository.

---

Made with ❤️ for TKR College of Engineering & Technology
