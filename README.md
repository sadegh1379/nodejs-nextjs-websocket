# Real-time User Application

A modern web application that demonstrates real-time user interactions using WebSocket technologies.

## Features

- Real-time user data updates using WebSocket
- User profile management
- Post display functionality

## Tech Stack

- **Frontend:**
  - Next.js
  - React
  - Tailwind CSS
  - RTK Query for WebSocket management

- **Backend:**
  - Node.js/Express
  - WebSocket (ws package)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

2. Backend Setup:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Technical Details

This application uses a simple WebSocket configuration with the `ws` package for the backend. On the frontend side, WebSocket connections are managed using RTK Query, which provides a clean and efficient way to handle real-time data updates.

