README.md
Personalized Dynamic Digital Portfolio Generator
MCSP-232 | Master of Computer Applications (MCA_NEW)
Submitted by: Yenumula Sri Venkatesh (EN: 2450994032)
Project Guide: Prathik K (M.Tech)
Year of Submission: 2026

Project Description
This is a full-stack MERN web application that allows users to create, manage, and instantly host a professional, dynamic, and fully responsive digital portfolio.

Users log in to a secure dashboard, manage their career data (Education, Experience, Projects, Skills, etc.), choose from multiple templates, and get a public portfolio website hosted at a unique URL (/view/[username]). No coding knowledge is required.

Features
- Secure JWT-based authentication (Register / Login)
- Full CRUD operations on portfolio sections
- Multiple customizable portfolio templates
- Dynamic public portfolio at /view/[username]
- Fully responsive (Mobile-First Design)
- Image upload support

Technology Stack (MERN)
Frontend    : React.js + Tailwind CSS / antd
Backend     : Node.js + Express.js
Database    : MongoDB (embedded documents)
Auth        : JWT + bcrypt
Others      : MongoDB Compass, Postman

Prerequisites
- Node.js (LTS v18 or higher)
- MongoDB (local or MongoDB Atlas)
- VS Code (recommended)

How to Run the Project from VS Code

1. Backend Setup
   cd backend
   npm install
   # Create .env file
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db
   JWT_SECRET=your_super_secret_jwt_key_here_2026
   npm start

2. Frontend Setup (Open new terminal)
   cd frontend
   npm install
   npm start

   Frontend will open at http://localhost:3000

How to Use
1. Go to http://localhost:3000
2. Register / Login
3. Fill Education, Experience, Projects, Skills
4. Choose template
5. View live portfolio: http://localhost:3000/view/your-username

Prepared by: Yenumula Sri Venkatesh
Date: 30 March 2026