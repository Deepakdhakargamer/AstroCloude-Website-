import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewMode, AdminHostingPlan } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Plans } from './components/Plans';
import { WhyChoose } from './components/WhyChoose';
import { LiveStatus } from './components/LiveStatus';
import { Footer } from './components/Footer';
import { Team } from './components/Team';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CategoryPlans } from './components/CategoryPlans';
import { Checkout } from './components/Checkout';
import { ToastContainer, ToastMessage } from './components/Toast';
import { getStoredPlans } from './utils/planSync';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('public');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AdminHostingPlan | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue'>('neon-purple');
  const [accentColor, setAccentColor] = useState('#8b5cf6');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleOpenRequestPlan = (plan?: AdminHostingPlan) => {
    setSelectedPlan(plan || (getStoredPlans().length > 0 ? getStoredPlans()[0] : null as any));
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanSubmitted = (planName: string, name: string, email: string) => {
    showToast(`Successfully requested "${planName}" for ${name}! Deployment pending approval.`, 'success');
  };

  const scrollToPlans = () => {
    const el = document.getElementById('plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getThemeBackground = () => {
    switch (selectedTheme) {
      case 'obsidian-black': return 'bg-black';
      case 'cyberpunk': return 'bg-zinc-950';
      case 'midnight-blue': return 'bg-[#030712]';
      case 'neon-purple':
      default:
        return 'bg-slate-950';
    }
  };

  return (
    <div 
      className={`min-h-screen font-sans text-slate-100 selection:text-white transition-colors duration-300 ${getThemeBackground()}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />



      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequestPlanClick={() => handleOpenRequestPlan()}
      />

      {/* Main Views */}
      {currentView === 'public' && (
        <main>
          <Hero
            onExplorePlans={scrollToPlans}
            onOpenDashboard={() => setCurrentView('dashboard')}
          />
          <Services
            onSelectService={(service) => {
              setSelectedCategoryId(service.id);
              setCurrentView('categoryPlans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <Plans
            onRequestPlan={(plan) => handleOpenRequestPlan(plan)}
          />
          <WhyChoose />
          <Team />
          <LiveStatus />
          <Footer />
        </main>
      )}

      {currentView === 'dashboard' && (
        <UserDashboard
          onRequestPlanClick={() => handleOpenRequestPlan()}
          onShowToast={showToast}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />
      )}

      {currentView === 'admin' && (
        <AdminPanel
          onShowToast={showToast}
        />
      )}
      {currentView === 'categoryPlans' && selectedCategoryId && (
        <CategoryPlans
          categoryId={selectedCategoryId}
          onBack={() => {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRequestPlan={(plan) => handleOpenRequestPlan(plan)}
        />
      )}



      <AnimatePresence>
        {currentView === 'checkout' && (
          <Checkout
            
            plan={selectedPlan}
            onBack={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
