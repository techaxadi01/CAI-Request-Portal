import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequesterDashboard from './pages/RequesterDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import SpecialistDashboard from './pages/SpecialistDashboard';
import NewRequestPage from './pages/NewRequestPage';
import RequestDetailPage from './pages/RequestDetailPage';

export default function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Render appropriate dashboard depending on active role
  const renderDashboard = () => {
    if (!user) {
      return <LoginPage setCurrentView={setCurrentView} />;
    }
    if (user.role === 'coordinator') {
      return (
        <CoordinatorDashboard
          setCurrentView={setCurrentView}
          setSelectedRequestId={setSelectedRequestId}
        />
      );
    }
    if (user.role === 'specialist') {
      return (
        <SpecialistDashboard
          setCurrentView={setCurrentView}
          setSelectedRequestId={setSelectedRequestId}
        />
      );
    }
    // Default to requester
    return (
      <RequesterDashboard
        setCurrentView={setCurrentView}
        setSelectedRequestId={setSelectedRequestId}
      />
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;
      case 'dashboard':
        return renderDashboard();
      case 'new-request':
        return (
          <NewRequestPage
            setCurrentView={setCurrentView}
            setSelectedRequestId={setSelectedRequestId}
          />
        );
      case 'request-detail':
        return (
          <RequestDetailPage
            requestId={selectedRequestId}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
}
