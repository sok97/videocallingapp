import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';

import useAuthUser from './hooks/useAuthUser.js';

function App() {
  const {isLoading, authUser} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  
  if (isLoading) return <PageLoader />
  
  return (
    <>
      <Toaster />
      <div>
        <Routes>
          {/* Fix the conditional rendering to prevent infinite loops */}
          <Route path='/' element={isAuthenticated && isOnboarded ? <HomePage/> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />} />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
          <Route path='/notifications' element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path='/call' element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
          <Route path='/chat' element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
          {/* This is the problematic route - make sure it doesn't redirect back to login if already authenticated */}
          <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        </Routes>
      </div>
    </>
  )
}

export default App
