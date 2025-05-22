# Cheers

Cheers is a modern matchmaking and chat web application built with React (client) and Node.js/Express (server). It allows users to create profiles, match with others based on preferences, and chat in real time with message limits and fun features.

## Features

- User authentication (signup/login)
- Profile creation with image upload
- Matchmaking based on gender, age, and drink preferences ("Cheers To")
- Like (favourite) and dislike users
- Real-time chat with Socket.IO
- Emoji picker in chat
- Automated suggestions and message limits in chat
- Profile editing
- Responsive, modern UI with Tailwind CSS

## Project Structure

```
cheers/
  client/    # React frontend
  server/    # Node.js/Express backend
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB database (local or cloud, e.g. MongoDB Atlas)

---

## Running the Server

1. Open a terminal and navigate to the `server` directory:
   ```powershell
   cd server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```powershell
   node index.js
   ```
   The server will run on [http://localhost:5000](http://localhost:5000)

---

## Running the Client

1. Open a new terminal and navigate to the `client` directory:
   ```powershell
   cd client
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
   The client will run on [http://localhost:5173](http://localhost:5173) by default.

---

## Usage
- Visit the client URL in your browser.
- Sign up, create your profile, and start matching and chatting!

---

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Socket.IO Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO

---

## License
This project is for educational/demo purposes.
