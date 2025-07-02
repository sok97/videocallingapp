## Project Overview

This repository implements a language-exchange video-calling app with real-time chat, video calls, social graph features and customizable theming. It uses a two-tier architecture—an Express/MongoDB backend and a React/Vite frontend—leveraging Stream SDKs for chat and calling. Developers can deploy, customize or extend this platform to build interactive language-learning or community apps.

### Key Features  
- Real-time text chat and 1:1 or group video calls via Stream SDK  
- User profiles and social graph (follow/unfollow, friend lists)  
- Dynamic theming (light/dark mode, custom brand colors)  
- Authentication, user management and persistent chat history  
- Responsive React UI with routing and global state management  

### Architecture Overview  
#### Backend (Express + MongoDB)  
- server.js initializes an Express server with CORS, JSON middleware and error handlers  
- Routes:  
  - /auth – sign up, login, token refresh  
  - /users – profile CRUD, follow/unfollow  
  - /chat – message history, channel management  
- Integrates Stream Chat & Video SDKs for messaging and WebRTC calls  
- Serves frontend build in production  
- Connects to MongoDB on startup  

#### Frontend (React + Vite)  
- main.jsx bootstraps the React app:  
  - BrowserRouter for client-side routing  
  - React Query for data fetching and caching  
  - GlobalStyles and ThemeProvider for theming  
- App component defines routes for login, chat rooms and video call pages  
- Uses Stream React SDK components for chat UI and video call orchestration  

### Primary Use Cases  
- Instant language practice sessions with text support  
- Group study or tutoring with video conferencing  
- Community-centric platforms with follow/friend features  
- White-label apps requiring custom branding and themes  

### Audience  
This project targets developers who want to:
- Deploy a turnkey video-calling/chat application  
- Extend or rebrand the UI, authentication flow or messaging logic  
- Integrate additional features (e.g., file sharing, notifications)  
- Adapt the architecture for other real-time collaboration scenarios  

### Quick Start Scripts  
Clone the repo, install dependencies, then in two terminals:

```bash
# Start backend in development mode
npm run dev:backend

# Start frontend with hot reload
npm run dev:frontend
```

For production builds:

```bash
# Build both tiers
npm run build:backend
npm run build:frontend

# Start the production server
npm start
## 2. Quick Start & Setup

Get the app running locally in minutes. This section covers cloning the repo, configuring environment variables, installing dependencies, and running both backend and frontend in development and production modes.

### 2.1 Prerequisites

- Node.js v16+ and npm (or Yarn)  
- A MongoDB instance (local or hosted)  
- Stream Chat account (API Key & Secret)  

### 2.2 Clone the Repository

Run:

```bash
git clone https://github.com/sok97/videocallingapp.git
cd videocallingapp
```

### 2.3 Configure Environment Variables

#### 2.3.1 Backend

Create `backend/.env` with:

```
# MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/videocalling

# Stream Chat credentials
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# JWT secret for auth tokens
JWT_SECRET=your_jwt_secret

# Server port (optional, defaults to 4000)
PORT=4000
```

#### 2.3.2 Frontend

Create `frontend/.env` with:

```
# Stream Chat public key
VITE_STREAM_API_KEY=your_stream_api_key

# Base URL of backend API
VITE_BACKEND_URL=http://localhost:4000
```

> The frontend fetches chat tokens from `${VITE_BACKEND_URL}/chat/token` and other endpoints under `${VITE_BACKEND_URL}`.

### 2.4 Install Dependencies

Install backend and frontend packages:

```bash
# In project root
cd backend
npm install

cd ../frontend
npm install
```

### 2.5 Development Mode

#### 2.5.1 Run Backend

```bash
cd backend
npm run dev
```

- Starts Express with `nodemon src/server.js`  
- Connects to MongoDB via `src/lib/db.js`  
- Enables CORS and serves auth/chat routes

#### 2.5.2 Run Frontend

```bash
cd frontend
npm run dev
```

- Starts Vite dev server at `http://localhost:5173`  
- Uses your Stream API key and backend URL from `.env`

### 2.6 Production Build & Serve

#### 2.6.1 Build Frontend

```bash
cd frontend
npm run build
```

- Outputs static files to `frontend/dist`

#### 2.6.2 Start Backend in Production

```bash
cd backend
npm run start
```

- Serves API and static frontend files (from `../frontend/dist`)  
- Listens on `PORT` from `.env`  

Visit `http://localhost:4000` to access the production bundle.

### 2.7 Common Troubleshooting

- **MongoDB connection errors**  
  • Verify `MONGODB_URI` is correct and network/firewall allows access.  
  • Inspect startup logs in `backend/src/lib/db.js`.

- **CORS issues**  
  • By default, server applies `cors()` without origin whitelist.  
  • To restrict origins, update `src/server.js`:  
    ```js
    app.use(cors({ origin: 'http://localhost:5173' }));
    ```

- **JWT authentication failures**  
  • Confirm `JWT_SECRET` matches between backend and any token-generating clients.  
  • Check token payload with [jwt.io](https://jwt.io).

- **Stream Chat errors**  
  • Ensure `STREAM_API_KEY` and `STREAM_API_SECRET` are valid in both backend and frontend env files.  
  • Review responses in browser dev tools or backend logs.

- **Port conflicts**  
  • Change `PORT` in `backend/.env` or Vite dev port via `frontend/vite.config.js`.

With these steps you’ll have a local development environment and a production-ready build for the videocallingapp. Happy coding!
## 3. Backend API Reference

### Authentication Endpoints

#### POST /api/auth/signup  
Registers a new user, hashes password, issues JWT cookie.

• Method: POST  
• URL: `/api/auth/signup`  
• Auth: none  
• Headers:  
  - Content-Type: application/json  

Request Body  
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"    // optional
}
```

Success Response (201)  
Sets `Set-Cookie: jwt=<token>; HttpOnly`  
```json
{
  "success": true,
  "user": {
    "_id": "60f7a3c2a5e4e12d4c8b4567",
    "email": "user@example.com",
    "fullName": "John Doe",
    "isOnboarded": false,
    // ...
  }
}
```

Error Responses  
- 400 Bad Request: missing required fields  
- 409 Conflict: email already in use  
- 500 Internal Server Error

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securePassword123","fullName":"John Doe"}'
```

---

#### POST /api/auth/login  
Validates credentials, issues JWT cookie.

• Method: POST  
• URL: `/api/auth/login`  
• Auth: none  
• Headers: Content-Type: application/json  

Request Body  
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Success Response (200)  
Sets `Set-Cookie: jwt=<token>; HttpOnly`  
```json
{
  "success": true,
  "user": {
    "_id": "60f7a3c2a5e4e12d4c8b4567",
    "email": "user@example.com",
    "fullName": "John Doe",
    "isOnboarded": true
  }
}
```

Error Responses  
- 400 Bad Request: missing email/password  
- 401 Unauthorized: invalid credentials  
- 500 Internal Server Error

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securePassword123"}'
```

---

#### POST /api/auth/logout  
Clears the authentication cookie.

• Method: POST  
• URL: `/api/auth/logout`  
• Auth: none  
• Headers: Cookie: `jwt=<token>`  

Success Response (200)  
Clears `jwt` cookie  
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Error Responses  
- 400 Bad Request: no token provided  

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/auth/logout \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### GET /api/auth/me  
Fetches current user profile.

• Method: GET  
• URL: `/api/auth/me`  
• Auth: Protected (Cookie: `jwt=<token>`)  

Success Response (200)  
```json
{
  "_id": "60f7a3c2a5e4e12d4c8b4567",
  "email": "user@example.com",
  "fullName": "John Doe",
  "isOnboarded": true,
  // other profile fields
}
```

Error Responses  
- 401 Unauthorized: missing/invalid token  

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/auth/me \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### POST /api/auth/onboarding  
Collects additional profile info, updates MongoDB and Stream.

• Method: POST  
• URL: `/api/auth/onboarding`  
• Auth: Protected  
• Headers:  
  - Content-Type: application/json  
  - Cookie: `jwt=<token>`  

Request Body  
```json
{
  "fullName": "Jane Doe",
  "bio": "Software engineer and polyglot",
  "nativeLanguage": "English",
  "learningLanguage": "Spanish",
  "location": "Berlin, Germany"
}
```

Success Response (200)  
```json
{
  "success": true,
  "message": "User onboarded successfully",
  "user": {
    "_id": "60f7a3c2a5e4e12d4c8b4567",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "bio": "Software engineer and polyglot",
    "nativeLanguage": "English",
    "learningLanguage": "Spanish",
    "location": "Berlin, Germany",
    "isOnboarded": true,
    "profilePic": "https://avatar.iran.liara.run/public/42.png"
  }
}
```

Error Responses  
- 400 Missing fields array  
- 401 Unauthorized  
- 404 User not found  
- 500 Internal Server Error

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/auth/onboarding \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=<your_jwt_token>" \
  -d '{"fullName":"Jane Doe","bio":"Software engineer","nativeLanguage":"English","learningLanguage":"Spanish","location":"Berlin"}'
```

---

### Chat Endpoint

#### GET /api/chat/token  
Returns a Stream Chat token for the authenticated user.

• Method: GET  
• URL: `/api/chat/token`  
• Auth: Protected (Cookie: `jwt=<token>`)  

Success Response (200)  
```json
{
  "token": "<stream_token>"
}
```

Error Responses  
- 401 Unauthorized  
- 500 Internal Server Error

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/chat/token \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

### User & Friendship Endpoints

#### GET /api/users/recommended  
Fetches recommended users for friendship.

• Method: GET  
• URL: `/api/users/recommended`  
• Auth: Protected  

Success Response (200)  
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Alice Smith",
    "nativeLanguage": "French",
    "learningLanguage": "English",
    "profilePic": "https://..."
  },
  …
]
```

Error Responses  
- 401 Unauthorized  
- 500 Internal Server Error

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/users/recommended \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### GET /api/users/friends  
Retrieves the current user's friends list.

• Method: GET  
• URL: `/api/users/friends`  
• Auth: Protected  

Success Response (200)  
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7a8b9c0d2",
    "fullName": "Bob Lee",
    "nativeLanguage": "Spanish",
    "learningLanguage": "German",
    "profilePic": "https://..."
  },
  …
]
```

Error Responses  
- 401 Unauthorized  
- 500 Internal Server Error

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/users/friends \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### POST /api/users/friend-request/:recipientId  
Sends a friend request.

• Method: POST  
• URL: `/api/users/friend-request/:recipientId`  
• Auth: Protected  

Success Response (201)  
```json
{
  "_id": "610a1b2c3d4e5f6a7b8c9d0e",
  "sender": "60f1a2b3c4d5e6f7a8b9c0d1",
  "recipient": "60f1a2b3c4d5e6f7a8b9c0d2",
  "status": "pending",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Error Responses  
- 400 Cannot request self/existing friend/duplicate  
- 404 Recipient not found  
- 401 Unauthorized

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/users/friend-request/60f1a2b3c4d5e6f7a8b9c0d2 \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### POST /api/users/friend-request/:requestId/accept  
Accepts a pending friend request.

• Method: POST  
• URL: `/api/users/friend-request/:requestId/accept`  
• Auth: Protected  

Success Response (200)  
```json
{ "message": "Friend request accepted" }
```

Error Responses  
- 403 Not recipient  
- 404 Request not found  
- 401 Unauthorized

Example Curl  
```bash
curl -i -X POST https://api.videocallapp.com/api/users/friend-request/610a1b2c3d4e5f6a7b8c9d0e/accept \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### GET /api/users/friend-requests  
Fetches incoming pending and accepted sent requests.

• Method: GET  
• URL: `/api/users/friend-requests`  
• Auth: Protected  

Success Response (200)  
```json
{
  "incomingReqs": [
    {
      "_id": "...",
      "sender": {
        "_id": "...",
        "fullName": "...",
        "profilePic": "...",
        "nativeLanguage": "...",
        "learningLanguage": "..."
      },
      "status": "pending",
      "createdAt": "..."
    }
  ],
  "acceptedReqs": [
    {
      "_id": "...",
      "recipient": {
        "_id": "...",
        "fullName": "...",
        "profilePic": "..."
      },
      "status": "accepted",
      "createdAt": "..."
    }
  ]
}
```

Error Responses  
- 401 Unauthorized  
- 500 Internal Server Error

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/users/friend-requests \
  -H "Cookie: jwt=<your_jwt_token>"
```

---

#### GET /api/users/outgoing-friend-requests  
Retrieves all pending requests sent by the user.

• Method: GET  
• URL: `/api/users/outgoing-friend-requests`  
• Auth: Protected  

Success Response (200)  
```json
[
  {
    "_id": "...",
    "recipient": {
      "_id": "...",
      "fullName": "...",
      "profilePic": "...",
      "nativeLanguage": "...",
      "learningLanguage": "..."
    },
    "status": "pending",
    "createdAt": "..."
  }
]
```

Error Responses  
- 401 Unauthorized  
- 500 Internal Server Error

Example Curl  
```bash
curl -i https://api.videocallapp.com/api/users/outgoing-friend-requests \
  -H "Cookie: jwt=<your_jwt_token>"
## Frontend Guide

This section covers the React/Vite frontend’s core patterns: client-side routing with access control, HTTP communication via Axios and a custom API wrapper, state management with React Query and Zustand, theming, and integrating Stream Chat and Video Calling components.

---

### Routing and Access Control (App.jsx)

Configure routes with React Router, guarding pages based on authentication (`authUser`) and onboarding status (`authUser.isOnboarded`).

#### Core Pattern

```jsx
// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthUser from './hooks/useAuthUser';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
// …other imports

function App() {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <div>Loading…</div>;

  return (
    <Routes>
      {/* Protected Home */}
      <Route
        path="/"
        element={
          isAuthenticated && isOnboarded
            ? <Layout showSidebar><HomePage /></Layout>
            : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
        }
      />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          isAuthenticated
            ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />)
            : <Navigate to="/login" />
        }
      />

      {/* Public Auth */}
      <Route
        path="/login"
        element={
          !isAuthenticated
            ? <LoginPage />
            : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
        }
      />

      {/* Add other routes (Chat, Notifications, Signup, Call) using the same pattern */}
    </Routes>
  );
}

export default App;
```

**Tips**  
- Wrap protected pages in `<Layout showSidebar>…</Layout>`.  
- Redirect un-authenticated users to `/login` and non-onboarded users to `/onboarding`.  
- Prevent logged-in users from seeing auth pages by redirecting them to `/` or `/onboarding`.  
- For maintainability, extract a `<ProtectedRoute>` component accepting `requiresOnboarding` and `showSidebar` props.

---

### HTTP Layer: Axios Instance & API Wrapper

Centralize API endpoints and keep HTTP logic out of components.

#### Axios Configuration

```js
// frontend/src/libs/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,      // send cookies for auth
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
```

#### API Wrapper Functions

```js
// frontend/src/libs/api.js
import apiClient from './axios';

export const signup = (data) => apiClient.post('/auth/signup', data);
export const login = (data)  => apiClient.post('/auth/login', data);
export const logout = ()      => apiClient.post('/auth/logout');
export const getAuthUser = () => apiClient.get('/auth/me');
export const completeOnboarding = (payload) =>
  apiClient.post('/auth/onboarding', payload);

export const getFriends = () =>
  apiClient.get('/friends');                     // fetch friend list
export const addFriend = (id) =>
  apiClient.post(`/friends/${id}/add`);

export const getChatToken = () =>
  apiClient.get('/stream/chat/token');           // returns { token, user }
export const getVideoToken = (id) =>
  apiClient.post(`/stream/video/token`, { callId: id });
```

#### Usage Example

```jsx
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getFriends } from '../libs/api';

function LoginForm() {
  const mutation = useMutation(login, {
    onSuccess: () => queryClient.invalidateQueries(['authUser']),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    mutation.mutate({
      email: form.get('email'),
      password: form.get('password'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* email/password inputs */}
      <button disabled={mutation.isLoading}>Log in</button>
    </form>
  );
}

function FriendsList() {
  const { data, isLoading } = useQuery(['friends'], getFriends);
  if (isLoading) return <div>Loading friends…</div>;
  return (
    <ul>
      {data.data.map(f => <li key={f.id}>{f.name}</li>)}
    </ul>
  );
}
```

---

### Authentication State with React Query (useAuthUser)

Wraps `getAuthUser` in a hook that returns `isLoading` and `authUser`. Disables retries on 401.

```js
// frontend/src/hooks/useAuthUser.js
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../libs/api';

export default function useAuthUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: () => getAuthUser().then(res => res.data.user),
    retry: false,
  });
  return { isLoading, authUser: data };
}
```

**Usage**

```jsx
function Dashboard() {
  const { isLoading, authUser } = useAuthUser();
  if (isLoading) return <div>Loading…</div>;
  if (!authUser) return <Navigate to="/login" replace />;
  return <h1>Welcome, {authUser.name}</h1>;
}
```

Invalidate with `useQueryClient().invalidateQueries(['authUser'])` after login/logout.

---

### Global Theming with Zustand (useThemeStore)

Persist theme selection in `localStorage` and apply via a `data-theme` attribute on `<html>`.

```js
// frontend/src/store/useThemeStore.js
import { create } from 'zustand';

export const useThemeStore = create(set => ({
  theme: localStorage.getItem('mytheme') || 'light',
  setTheme: theme => {
    set({ theme });
    localStorage.setItem('mytheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
}));
```

#### Theme Constants

```js
// frontend/src/constants/index.js
export const THEMES = [
  { name: 'light', label: 'Light', colors: ['#fff','#4a5568','#2d3748','#1a202c'] },
  { name: 'dark',  label: 'Dark',  colors: ['#1a202c','#2d3748','#4a5568','#fff'] },
  // …add more
];
```

#### Applying Theme on App Init

```js
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/useThemeStore';

function Root() {
  const { theme } = useThemeStore();
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <App />;
}

const queryClient = new QueryClient();
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Root />
  </QueryClientProvider>,
  document.getElementById('root')
);
```

---

### Stream Chat Integration

Initialize Stream Chat client with a token from your API, then render chat components.

```jsx
// frontend/src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import { useQuery } from '@tanstack/react-query';
import { getChatToken } from '../libs/api';
import useAuthUser from '../hooks/useAuthUser';

function ChatPage() {
  const { authUser, isLoading: authLoading } = useAuthUser();
  const { data: tokenData, isLoading: tokenLoading } = useQuery(
    ['chatToken'],
    getChatToken,
    { enabled: !!authUser }
  );
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    if (!tokenData || !authUser) return;
    const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_CHAT_API_KEY);
    client.connectUser(
      { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
      tokenData.data.token
    );
    setChatClient(client);
  }, [tokenData, authUser]);

  if (authLoading || tokenLoading || !chatClient) return <div>Loading chat…</div>;

  const channel = chatClient.channel('messaging', 'global');
  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
}

export default ChatPage;
```

**Key Points**  
- Fetch a chat token via React Query, then `StreamChat.getInstance(...).connectUser()`.  
- Use `<Chat>` and `<Channel>` wrappers to render messages.  
- Always clean up the client on unmount: `return () => chatClient.disconnectUser();` if needed.

---

### Video Call Integration

Wire a call button to generate a call link, send it in chat, and implement the call page with Stream Video.

#### Sending a Call Link

```jsx
// in ChatPage.jsx, inside your Channel window
import CallButton from '../components/CallButton';
import { toast } from 'react-toastify';

function ChatWithCall({ channel }) {
  const handleVideoCall = () => {
    const callLink = `${window.location.origin}/call/${channel.id}`;
    channel.sendMessage({ text: `🔴 Join call: ${callLink}` });
    toast.success('Call link sent');
  };

  return (
    <div className="relative">
      <CallButton handleVideoCall={handleVideoCall} />
      {/* <Window><MessageList /><MessageInput /></Window> */}
    </div>
  );
}
```

#### Call Page Implementation

```jsx
// frontend/src/pages/CallPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';
import useAuthUser from '../hooks/useAuthUser';
import { getVideoToken } from '../libs/api';

export default function CallPage() {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { authUser, isLoading: authLoading } = useAuthUser();
  const { data: tokenData, isLoading: tokenLoading } = useQuery(
    ['videoToken', callId],
    () => getVideoToken(callId).then(res => res.data.token),
    { enabled: !!authUser }
  );
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!authUser || !tokenData || !callId) return;
    (async () => {
      const videoClient = new StreamVideoClient({
        apiKey: import.meta.env.VITE_STREAM_VIDEO_API_KEY,
        user: {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        token: tokenData,
      });
      const callInstance = videoClient.call('default', callId);
      await callInstance.join({ create: true });
      setClient(videoClient);
      setCall(callInstance);
    })().catch(() => navigate('/', { replace: true }));
  }, [authUser, tokenData, callId, navigate]);

  if (authLoading || tokenLoading || !client || !call) {
    return <div>Loading call…</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    </StreamVideo>
  );
}

function CallContent() {
  const { useCallCallingState } = useCallStateHooks();
  const state = useCallCallingState();
  const navigate = useNavigate();

  if (state === CallingState.LEFT) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
}
```

**Highlights**  
- Extract `:callId` from URL via `useParams()`.  
- Fetch a video token before creating the `StreamVideoClient`.  
- Call `join({ create: true })` to auto-create the room if it doesn’t exist.  
- Monitor `CallingState.LEFT` to redirect participants when the call ends.  

With these patterns, you can extend your app’s routing, global state, theming, and real-time chat/video calling features in a consistent, maintainable way.
## 5. Development & Contribution Guide

This guide covers repository layout, coding standards, Git workflow, environment setup, local development, and deployment notes.

### 5.1 Repository Structure
```
/
├── backend/                # Node.js + TypeScript API
│   ├── src/
│   ├── package.json        # scripts: dev, start
│   ├── tsconfig.json
│   └── .env.example
├── frontend/               # React + Vite UI
│   ├── src/
│   ├── public/
│   ├── package.json        # scripts: dev, build, lint, preview
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── .env.example
├── package.json            # root scripts: install, dev, build, start
└── README.md
```

### 5.2 Coding Standards

#### ESLint
- Frontend uses `frontend/eslint.config.js`.  
- Run lint:  
  ```bash
  cd frontend
  npm run lint
  ```
- Autofix issues:  
  ```bash
  npm run lint -- --fix
  ```

#### Prettier
- Install at root:  
  ```bash
  npm install --save-dev prettier
  ```
- Add `.prettierrc`:
  ```json
  {
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 80
  }
  ```
- Format files:  
  ```bash
  npx prettier --write .
  ```

### 5.3 Git Workflow
1. Create a feature branch off `main`:  
   ```
   git checkout main
   git pull
   git checkout -b feature/your-feature
   ```
2. Commit often with clear messages:  
   ```
   git commit -m "feat(auth): add JWT login endpoint"
   ```
3. Push and open a Pull Request targeting `main`.
4. Ensure CI passes lint/build before merging.
5. Delete your branch after merge.

### 5.4 Environment Setup

#### Backend `.env.example`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/videocall
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

#### Frontend `.env.example`
```
VITE_API_URL=http://localhost:5000/api
VITE_STREAM_KEY=your_stream_api_key
VITE_STREAM_SECRET=your_stream_api_secret
```

Copy each to `.env` and fill in real values.

### 5.5 Local Development

1. Install all dependencies and run both services:  
   ```bash
   npm run install          # root: installs backend & frontend deps
   npm run dev              # runs dev servers concurrently
   ```
2. Backend dev server runs on `http://localhost:5000`  
3. Frontend dev server runs on `http://localhost:3000`

### 5.6 Deployment Notes

#### Build Scripts
- Frontend:  
  ```bash
  cd frontend
  npm run build            # outputs to frontend/dist
  ```
- Backend (TypeScript compile + start):  
  ```bash
  cd backend
  npm run build            # tsc → dist/
  npm run start            # node dist/index.js
  ```

#### Static Serving
- Serve `frontend/dist` with Nginx, Vercel, or any static host.
- Ensure `VITE_API_URL` points to your production API.

#### Production Environment Variables
- Define secrets in your host’s environment (e.g., Docker, Kubernetes Secrets).
- Never commit real secrets to Git.
- Example Docker Compose snippet:
  ```yaml
  services:
    backend:
      image: videocallingapp-backend:latest
      environment:
        - MONGODB_URI=${MONGODB_URI}
        - JWT_SECRET=${JWT_SECRET}
        - STREAM_API_KEY=${STREAM_API_KEY}
        - STREAM_API_SECRET=${STREAM_API_SECRET}
    frontend:
      image: videocallingapp-frontend:latest
      environment:
        - VITE_API_URL=${VITE_API_URL}
  ```
- Rebuild images after any code or environment-variable changes.
