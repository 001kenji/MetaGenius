# MetaGenius - AI Metadata Generator

MetaGenius is a web application that helps users automatically generate and manage metadata for their content using AI. This project consists of a React frontend and a Django backend.

## Features

- User authentication (email/password and Google OAuth)
- Metadata generation for various content types
- Dashboard for managing and viewing metadata
- Admin panel for user management
- Light/dark mode support
- Modern and responsive UI

## Prerequisites

- Node.js (v16+) for the frontend
- Python (v3.8+) for the backend
- npm or pnpm for frontend package management
- pip for backend package management
- A Google Cloud Platform account (for Google OAuth integration)

## Environment Setup

### Frontend (.env)

Create a `.env` file in the root of the frontend project:
# Project Summary
MetaGenius is a web application designed to streamline the management and generation of metadata for various digital assets. It focuses on enhancing user experience through intuitive interfaces and efficient functionality, catering to businesses that require robust metadata handling.

# Project Module Description
The MetaGenius application consists of several functional modules:
- **Authentication**: Handles user login and registration through the `LoginForm` and `RegisterForm` components.
- **Metadata Management**: Allows users to create and preview metadata using `MetadataForm` and `PreviewPanel`.
- **File Upload**: Facilitates file uploads via the `UploadModule`.
- **Dashboard**: Provides an overview and access to various application features through the `Dashboard` page.
- **Common Components**: Includes reusable UI elements such as buttons, modals, notifications, and loading spinners.

# Directory Tree
```
react_template/
├── README.md                   # Overview and setup instructions for the React application
├── eslint.config.js            # ESLint configuration for code linting
├── index.html                  # Main HTML file for the application
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration for CSS processing
├── public/
│   └── data/
│       └── example.json        # Sample data for testing
├── src/
│   ├── App.jsx                 # Main application component
│   ├── components/             # Contains all UI components
│   │   ├── auth/               # Authentication related components
│   │   ├── common/             # Common reusable components
│   │   ├── layout/             # Layout components like Footer and Navbar
│   │   └── metadata/           # Components for metadata handling
│   ├── contexts/               # Context providers for state management
│   ├── pages/                  # Main pages of the application
│   ├── services/               # API service modules
│   ├── utils/                  # Utility functions
│   ├── index.css               # Global CSS styles
│   └── main.jsx                # Entry point of the application
├── tailwind.config.js          # Tailwind CSS configuration
├── template_config.json        # Configuration for templates
└── vite.config.js              # Vite configuration for building the application
```

# File Description Inventory
- **ai_metadata_generator_prd.md**: Product Requirements Document for the AI metadata generator.
- **meta_genius_class_diagram.mermaid**: Class diagram for the system architecture.
- **meta_genius_sequence_diagram.mermaid**: Sequence diagram illustrating application interactions.
- **meta_genius_system_design.md**: Detailed system architecture design document.
- **react_template/**: Main directory containing the React web application files.

# Technology Stack
- **React**: Front-end library for building user interfaces.
- **Vite**: Build tool for faster development and production builds.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ESLint**: Tool for identifying and fixing problems in JavaScript code.
- **PostCSS**: Tool for transforming CSS with JavaScript plugins.

# Usage
To get started with the MetaGenius application:
1. Install dependencies: `npm install`
2. Build the application: `npm run build`
3. Run the application: `npm run start`
