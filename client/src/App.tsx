import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequestForm from './components/RequestForm';
import JoinMandal from './components/JoinMandal';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import CreateMandal from './components/CreateMandal';
import VolunteerFeed from './components/VolunteerFeed';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import EventForm from './components/EventForm';

function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
        <Navbar user={user} />
        
        {/* Main Content Area - Responsive Container */}
        <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/join/:inviteCode" element={<JoinMandal onLogin={handleLogin} />} />
              <Route path="/feed" element={
                user ? <VolunteerFeed mandalId={user.mandalId} volunteerId={user.id} /> : <Navigate to="/login" replace />
              } />
              <Route path="/request" element={
                user ? <RequestForm mandalId={user.mandalId} requesterId={user.id} /> : <Navigate to="/login" replace />
              } />
              <Route path="/event" element={
                user ? <EventForm mandalId={user.mandalId} requesterId={user.id} /> : <Navigate to="/login" replace />
              } />
              <Route path="/admin" element={
                user ? <AdminDashboard currentMandalId={user.mandalId} /> : <Navigate to="/login" replace />
              } />
              <Route path="/create" element={<CreateMandal user={user} />} />
              {/* If no user, default to login page, otherwise default to feed */}
              <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
