# 📱 Contacts Management System - Corelia

A modern, full-stack contacts management application built with React, TypeScript, and Redux Toolkit.

---

## 🚀 Quick Start

Choose your preferred method to run the application:

### 🐳 **Option 1: Using Docker (Recommended)**

**Prerequisites:**

- Docker installed on your machine ([Download Docker](https://www.docker.com/get-started))

**Steps:**

1. **Pull the Docker image:**

   ```bash
   docker pull omarelnady/corelia:latest
   ```

2. **Run the container:**

   ```bash
   docker run -d -p 5173:5173 --name corelia omarelnady/corelia:latest
   ```

3. **Open your browser:**
   ```
   http://localhost:5173
   ```

**Docker Commands:**

| Command                  | Description             |
| ------------------------ | ----------------------- |
| `docker ps`              | View running containers |
| `docker stop corelia`    | Stop the application    |
| `docker start corelia`   | Start the application   |
| `docker restart corelia` | Restart the application |
| `docker logs corelia`    | View application logs   |
| `docker rm corelia`      | Remove the container    |

---

### 💻 **Option 2: Using npm (Development)**

**Prerequisites:**

- Node.js 18+ installed ([Download Node.js](https://nodejs.org/))
- npm or yarn package manager

**Steps:**

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd Task
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

**npm Commands:**

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm test`        | Run tests                |
| `npm run lint`    | Run ESLint               |

**Stop the server:**

- Press `Ctrl + C` in the terminal

---

## 📋 Features

- ✅ **User Authentication**: Secure login and registration
- ✅ **Contact Management**: Full CRUD operations
- ✅ **Smart Filtering**: User-specific contacts
- ✅ **Sorting & Pagination**: Sort by name or order
- ✅ **Persistent State**: Data saved in localStorage
- ✅ **Responsive Design**: Mobile-friendly UI
- ✅ **Form Validation**: Comprehensive input validation
- ✅ **Toast Notifications**: User-friendly feedback

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Form Handling**: React Hook Form
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── contacts/       # Contact-specific components
├── pages/              # Page components
│   ├── home.tsx        # Main contacts page
│   ├── login.tsx       # Login page
│   └── register.tsx    # Registration page
├── redux/              # State management
│   ├── authSlice.ts    # Authentication state
│   └── contactsSlice.ts # Contacts state
├── tests/              # Test files
│   ├── pages/          # Page tests
│   ├── setup/          # Test configuration
│   └── utils/          # Test utilities
└── layouts/            # Layout components
```

---

## 🧪 Testing

The project includes comprehensive test coverage (17 tests):

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Test Results:**

```
Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
- HomePage: 6 tests
- LoginPage: 6 tests
- RegisterPage: 5 tests
```

---

## 🔐 Default Credentials

For testing purposes, you can register a new account or use the application's registration flow.

---

## 📝 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing & Quality

- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Docker

- Build image: `docker build -t corelia .`
- Run container: `docker run -d -p 5173:5173 corelia`

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
vercel deploy --prod
```

### Docker Hub

The application is available on Docker Hub:

```bash
docker pull omarelnady/corelia:latest
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

**Docker:**

```bash
docker run -d -p 3000:5173 --name corelia omarelnady/corelia:latest
```

Then open: `http://localhost:3000`

**npm:**
The server will automatically use the next available port.

### Docker Container Not Starting

```bash
# Check logs
docker logs corelia

# Remove and recreate
docker rm -f corelia
docker run -d -p 5173:5173 --name corelia omarelnady/corelia:latest
```

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Development

Built with modern best practices:

- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Component-based architecture
- ✅ Redux for state management
- ✅ Comprehensive testing suite
- ✅ Docker support
- ✅ CI/CD ready

---

## 📞 Support

For issues or questions, please contact the development team.

---

**Made with ❤️ for Corelia**
