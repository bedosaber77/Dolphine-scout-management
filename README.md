# 🐬 Dolphine Scout Management

**Dolphine Scout Management** is a comprehensive web-based platform designed to help scout organizations efficiently manage their members, events, and activities. This system provides a centralized solution for streamlining communication, data management, and reducing manual paperwork while enhancing the overall scouting experience.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Database](#database)
- [User Roles & Permissions](#user-roles--permissions)
- [System Entities](#system-entities)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🚀 Features

### Core Functionality
- **Member Management**: Comprehensive scout profile management with progress tracking
- **Event Management**: Create, manage, and track attendance for various scout activities
- **Achievement System**: Award and track scout accomplishments and recognitions
- **Financial Management**: Handle donations, sponsorships, and financial transactions
- **Communication Hub**: Announcement system for leaders to communicate with scouts and parents
- **Media Management**: Upload and manage photos, videos, and files for events
- **Real-time Updates**: Live updates for all system activities and changes

### Specialized Features
- **Camp Management**: Organize outdoor learning activities and camps
- **Equipment Tracking**: Manage tools and materials required for events
- **Location Management**: Track geographical details for events and activities
- **Progress Monitoring**: Detailed reports on scout participation and achievements

---

## 🧱 Tech Stack

| Layer     | Technologies                                       |
|-----------|----------------------------------------------------|
| Frontend  | React (Vite), Tailwind CSS, Zustand, React Router  |
| Backend   | Node.js, Express, PostgreSQL                       |
| Styling   | Tailwind CSS                                       |
| State     | Zustand                                            |
| Dev Tools | Prettier, ESLint, VS Code, Nodemon                 |

---

## 📁 Project Structure

```
Dolphine-scout-management/
├── .vscode/                 # VS Code configuration
├── client/                  # React frontend application
│   ├── src/
│   │   ├── assets/         # Static assets (images, icons, etc.)
│   │   ├── components/     # Reusable React components
│   │   ├── data/           # Static data and constants
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── routers/        # React Router configuration
│   │   ├── styles/         # CSS and styling files
│   │   └── store/          # Zustand auth store
│   ├── package.json
│   └── vite.config.js      # Vite configuration
├── server/                  # Node.js backend API
│   ├── config/             # Database and environment configuration
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # Express middleware functions
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions and helpers
│   ├── index.js            # Main server entry point
│   └── package.json
├── .gitignore
├── .prettierrc             # Prettier configuration
└── package.json            # Root package configuration
```

---

## 🧪 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Dolphine-scout-management.git
   cd Dolphine-scout-management
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

5. **Environment Configuration**
   Create a `.env` file in the server directory with your configuration:
   ```env
   PORT=5000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
---

## 🎯 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend application**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```
---

## 🗃️ Database

- Uses **PostgreSQL**.  
- Schema includes entities such as: `User`, `Scout`, `Troop`, `Event`, `Achievement`, `Transaction`, etc.  
- **Tip:** Use `psql` or pgAdmin to create the database before running the server.  

---

## 👥 User Roles & Permissions

### 🔧 Admin
- Manage user roles (create, update, delete users)
- Assign scout leaders to specific troops
- View and manage all scout profiles across the system
- Create, update, or delete events for all troops
- Backup and restore system data
- View financial balance and transactions

### 👨‍🏫 Scout Leader
- View and manage scout profiles within their assigned troop
- Create and manage events with attendance tracking
- Award achievements to scouts based on their accomplishments
- Generate reports on scout participation and progress
- Schedule and manage training sessions
- Upload media content for events

### 🎯 Scout
- View personal profile, achievements, and progress
- Access upcoming and past event schedules
- Track personal performance and participation history
- Receive announcements from scout leaders

### 👨‍👩‍👧‍👦 Parent
- Monitor their child's profile, achievements, and progress
- View event schedules and participation status
- Track their child's involvement in scout activities
- Receive important announcements and updates

---

## 🏗️ System Entities

The system manages the following core entities:

- **Users**: Admin, Scout Leaders, Parents, and Scouts
- **Troops**: Scout groups led by scout leaders
- **Events**: Planned activities including camps and gatherings
- **Achievements**: Awards and recognitions for scouts
- **Announcements**: Communication messages
- **Transactions**: Financial operations and donations
- **Media**: Photos, videos, and documentation
- **Equipment**: Tools and materials for events
- **Locations**: Geographical information for activities

---

## 🛣️ Roadmap

- [x] User Role Management  
- [x] Event & Attendance System  
- [x] Announcements & Notifications  
- [ ] Email/SMS Notifications Integration  
- [ ] PWA Support for mobile  
- [ ] Dark Mode UI  
- [ ] Dashboard Analytics  

---

## 🤝 Contributing

We welcome contributions to improve the Scout Management System! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, questions, or suggestions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation wiki


