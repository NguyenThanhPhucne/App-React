# Discord Clone - Real-time Chat Application

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.8.2-red.svg)](https://redux-toolkit.js.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-green.svg)](https://socket.io/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-blue.svg)](https://mui.com/)

## Project Overview

A modern real-time chat application built with React, mimicking Discord's interface and functionality. The application features a responsive design that works seamlessly across desktop and mobile devices, with real-time messaging capabilities powered by Socket.io.

## Core Features

### Authentication & Security

- User registration and login with username/email validation
- JWT-based authentication with automatic token refresh mechanism
- Secure session management with localStorage persistence
- Safe logout functionality with token cleanup
- Password validation and security measures

### Server Management

- Create new servers with custom names, descriptions, and avatar uploads
- Join existing servers using invite links or invitation codes
- Server administration panel (edit, delete, member management)
- Server avatar management with image upload support
- Server invitation system with unique codes

### Channel System

- Text channels for real-time messaging and communication
- Channel creation, editing, and deletion with proper permissions
- Organized channel categorization (text, voice - in development)
- Channel-specific settings and customization options
- Message history and persistence

### Real-time Communication

- Instant message delivery via Socket.io WebSocket connections
- Real-time typing indicators showing when users are typing
- Message broadcasting to all channel members
- Automatic reconnection handling for network issues
- Message status indicators (sent, delivered, read)

### Responsive Design & Cross-Platform Support

- Desktop interface with sidebar, content area, and member list
- Mobile-optimized interface with touch-friendly controls and gestures
- Adaptive layout that automatically adjusts to different screen sizes
- Mobile-specific features: swipe navigation, mobile overlays
- Touch event handling and mobile gesture support

### Theme System & UI/UX

- Dark and light mode with smooth CSS transitions
- CSS variables system for easy theme customization
- Persistent theme preferences stored in localStorage
- Material Design icons and Lucide React icon library
- Consistent design language across all components

### Member Management & User Experience

- Member list displaying all server participants with online status
- User profile management with avatar uploads
- Online/offline status tracking and display
- Role-based permissions system (in development)
- User search and filtering capabilities

### File Management & Media Support

- Avatar upload system for both users and servers
- Image file handling with Multer backend integration
- Image preview and validation before upload
- Fallback image system for failed uploads
- Support for multiple image formats (JPG, PNG, etc.)

## Technical Architecture

### Frontend Technologies

- **React 19.1.0** - Modern component-based UI framework with hooks
- **Vite 6.3.5** - Lightning-fast build tool and development server
- **Redux Toolkit 2.8.2** - Efficient state management with RTK Query
- **React Router DOM 7.6.2** - Client-side routing with protected routes
- **Material-UI 7.2.0** - Comprehensive UI component library
- **Lucide React 0.515.0** - Beautiful and consistent icon library
- **React Icons 5.5.0** - Additional icon sets and custom icons

### State Management Architecture

- **Redux Store** with multiple specialized slices:
  - `userSlice`: User authentication and profile state
  - `appSlice`: Server and channel data management
  - `channelSlice`: Active channel and message state
  - `themeSlice`: UI theme preferences and transitions
- **Local Component State** using React hooks for UI interactions
- **Custom Hooks** for complex state logic and business rules

### Real-time Communication System

- **Socket.io Client 4.8.1** for WebSocket communication
- **Event-driven architecture** for real-time updates and notifications
- **Automatic reconnection** with exponential backoff strategy
- **Channel-based messaging** with proper room management
- **Typing indicators** and user activity tracking

### Development Tools & Quality Assurance

- **ESLint 9.25.0** for code quality and consistency
- **TypeScript Types** for React component type checking
- **Vite HMR** for fast development iteration
- **Build optimization** for production deployments

## Project Structure

```
Project/
├── public/                          # Static assets and files
│   ├── defaultAvatar.jpg            # Default user avatar image
│   ├── favicon.ico                  # Application favicon
│   └── uploads/                     # File upload directory
│       ├── server-avatars/          # Server avatar storage
│       └── user-avatars/            # User avatar storage
├── src/                             # Source code directory
│   ├── app/                         # Core application components
│   │   ├── components/              # React component library
│   │   │   ├── discord/             # Discord interface components
│   │   │   │   ├── content/         # Main content area components
│   │   │   │   ├── desktop/         # Desktop-specific layouts
│   │   │   │   ├── header/          # Header and navigation components
│   │   │   │   ├── members/         # Member list and user components
│   │   │   │   ├── message/         # Message display and input
│   │   │   │   ├── mobile/          # Mobile-specific components
│   │   │   │   ├── modals/          # Modal dialog components
│   │   │   │   ├── notifications/   # Notification system
│   │   │   │   └── sidebar/         # Sidebar navigation
│   │   │   └── ui/                  # Common UI components
│   │   ├── data/                    # Static data and mock content
│   │   ├── services/                # API and socket services
│   │   └── utils/                   # Utility functions and helpers
│   ├── appRoutes/                   # Routing configuration
│   ├── features/                    # Redux store slices
│   ├── hooks/                       # Custom React hooks
│   ├── pages/                       # Page-level components
│   └── styles/                      # CSS stylesheets and themes
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite build configuration
├── vercel.json                      # Vercel deployment settings
└── README.md                        # Project documentation
```

## Installation & Setup

### System Requirements

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Modern browser** with ES6+ support
- **Git** for version control

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone <repository-url>
cd Project
```

#### 2. Install Dependencies

```bash
npm install
# Alternative: yarn install
```

#### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000
```

#### 4. Start Development Server

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Key Components & Architecture

### Discord Interface Components

- **DesktopDiscordInterface**: Main desktop layout with three-panel design
- **MobileDiscordInterface**: Mobile-optimized layout with overlay system
- **DiscordSidebar**: Server and channel navigation with collapsible categories
- **DiscordContent**: Message display area with header and input
- **MemberList**: User list with online status and search functionality

### State Management System

- **useDiscordState**: Local component state management hook
- **useDiscordHandlers**: Event handlers and business logic encapsulation
- **Redux Store**: Global application state with middleware support
- **Custom Hooks**: Specialized hooks for specific functionality

### Service Layer

- **apiService**: REST API communication with error handling
- **socketService**: Real-time WebSocket connection management
- **File Upload Services**: Avatar and media upload handling

## API Integration & Backend Communication

### REST API Endpoints

- **Authentication**: `/login`, `/register`, `/user/*`
- **Server Management**: `/server/*` (CRUD operations)
- **Channel Operations**: `/server/:id/channels/*`
- **File Upload**: `/upload/*` (avatars, server icons)
- **User Management**: `/user/profile`, `/user/avatar`

### WebSocket Events & Real-time Features

- **Connection Management**: `connect`, `disconnect`, `reconnect`
- **Messaging**: `join-channel`, `send-message`, `new-message`
- **User Activity**: `typing`, `user-typing`, `stop-typing`
- **Channel Management**: `join-channel`, `leave-channel`
- **Message Operations**: `delete-message`, `edit-message`

## Development Guidelines & Best Practices

### Code Standards & Quality

- **Functional Components**: Use React hooks and functional components
- **State Management**: Redux Toolkit for global state, local state for UI
- **Styling**: Modular CSS with CSS variables and responsive design
- **Code Quality**: ESLint configuration and consistent formatting
- **Performance**: React.memo, useMemo, and useCallback optimization

### Component Architecture Principles

- **Separation of Concerns**: Clear separation between UI and business logic
- **Reusability**: Component composition and prop-based customization
- **Custom Hooks**: Extract complex logic into reusable hooks
- **Error Boundaries**: Proper error handling and user feedback

### Responsive Design Implementation

- **Mobile-First Approach**: Design for mobile devices first
- **CSS Grid & Flexbox**: Modern layout techniques
- **Media Queries**: Responsive breakpoints and adaptive layouts
- **Touch Interactions**: Mobile-specific gesture handling

## Deployment & Production

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel
vercel
```

### Manual Build & Deployment

```bash
# Build production bundle
npm run build

# Serve dist/ folder with static hosting service
# Examples: Netlify, AWS S3, GitHub Pages
```

### Production Environment Setup

- Configure `VITE_BACKEND_BASE_URL` for production backend
- Ensure CORS settings allow production domain
- Set up proper SSL certificates for secure communication
- Configure CDN for static asset delivery

## Testing & Quality Assurance

### Code Quality Tools

- **ESLint**: Code style enforcement and best practices
- **React Hooks**: Validation for custom hooks usage
- **TypeScript Types**: Type checking for React components
- **Prettier**: Code formatting consistency

### Browser Compatibility Testing

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Devices**: iOS Safari, Chrome Mobile, Samsung Internet
- **Responsive Design**: Tablet and desktop layout verification
- **Touch Events**: Mobile gesture and interaction testing

### Frontend Performance

- **Code Splitting**: Lazy loading for route-based components
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: Compression and responsive image loading
- **Caching Strategy**: Browser caching and service worker implementation

## License & Legal

This project is licensed under the MIT License. See the LICENSE file for full details.

## Author & Contact

Student's name: Nguyễn Thành Phúc and Student's ID: 24560045

---

_Built with modern web technologies: React, Redux Toolkit, Socket.io, and Vite for optimal performance and developer experience._
