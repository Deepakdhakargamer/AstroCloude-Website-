import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ViewMode, AdminHostingPlan, AdminUser } from './types';
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
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ToastContainer, ToastMessage } from './components/Toast';
import { getStoredPlans } from './utils/planSync';
import { getCurrentSession, logoutUser, isUserAdmin, verifySessionWithDatabase } from './utils/userSync';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('public');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AdminHostingPlan | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue'>('neon-purple');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [userDashboardTab, setUserDashboardTab] = useState<'profile' | 'tickets' | 'orders'>('profile');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const session = getCurrentSession();
    return session ? session.user : null;
  });
  const [redirectTarget, setRedirectTarget] = useState<ViewMode>('public');

  useEffect(() => {
    // Authoritatively verify session against database on mount
    verifySessionWithDatabase().then((verifiedUser) => {
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      }
    });

    const handleAuthUpdate = (e: any) => {
      const session = e.detail;
      setCurrentUser(session ? session.user : null);
    };
    window.addEventListener('astro_auth_changed', handleAuthUpdate);

    // Check direct URL / hash access for protected purchase, admin, or dashboard view
    const checkDirectUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const hash = window.location.hash.replace('#', '');
      const directView = viewParam || hash;

      if (!directView) return;

      const session = getCurrentSession();

      if (directView === 'checkout') {
        if (!session || !session.user) {
          setRedirectTarget('checkout');
          setCurrentView('login');
          showToast('Please login or register to purchase a plan.', 'info');
        } else {
          const plans = getStoredPlans();
          if (plans.length > 0) setSelectedPlan(plans[0]);
          setCurrentView('checkout');
        }
      } else if (directView === 'admin') {
        if (!session || !session.user) {
          setRedirectTarget('public');
          setCurrentView('login');
          showToast('Please sign in with administrator credentials.', 'info');
        } else {
          const adminAuthorized = isUserAdmin(session.user);
          if (adminAuthorized) {
            setCurrentView('admin');
          } else {
            showToast('Access Denied: Administrator account required.', 'error');
            setCurrentView('public');
          }
        }
      } else if (directView === 'dashboard') {
        if (!session || !session.user) {
          setRedirectTarget('public');
          setCurrentView('login');
          showToast('Please sign in to access your dashboard.', 'info');
        } else {
          setUserDashboardTab('profile');
          setCurrentView('dashboard');
        }
      } else if (directView === 'orders') {
        if (!session || !session.user) {
          setRedirectTarget('public');
          setCurrentView('login');
          showToast('Please sign in to view your orders.', 'info');
        } else {
          setUserDashboardTab('orders');
          setCurrentView('dashboard');
        }
      } else if (directView === 'login') {
        setRedirectTarget('public');
        setCurrentView('login');
      } else if (directView === 'register') {
        setRedirectTarget('public');
        setCurrentView('register');
      }
    };

    checkDirectUrl();
    window.addEventListener('hashchange', checkDirectUrl);

    return () => {
      window.removeEventListener('astro_auth_changed', handleAuthUpdate);
      window.removeEventListener('hashchange', checkDirectUrl);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSelectedPlan(null);
    setUserDashboardTab('profile');
    setRedirectTarget('public');
    setCurrentView('public');
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    showToast('You have been signed out successfully.', 'info');
  };

  const handleOpenRequestPlan = (plan?: AdminHostingPlan) => {
    const targetPlan = plan || (getStoredPlans().length > 0 ? getStoredPlans()[0] : null);
    setSelectedPlan(targetPlan);

    // MANDATORY AUTHENTICATION CHECK: Do not allow unauthenticated users to continue to checkout
    if (!currentUser) {
      setRedirectTarget('checkout');
      setCurrentView('login');
      showToast('Please login or register to purchase a plan.', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToPlans = () => {
    const el = document.getElementById('plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewChange = (view: ViewMode) => {
    if (view === 'login') {
      setRedirectTarget('public');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'register') {
      setRedirectTarget('public');
      setCurrentView('register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'checkout') {
      if (!currentUser) {
        setRedirectTarget('checkout');
        setCurrentView('login');
        showToast('Please login or register to purchase a plan.', 'info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (view === 'dashboard') {
      if (!currentUser) {
        setRedirectTarget('public');
        setCurrentView('login');
        showToast('Please sign in to access your dashboard.', 'info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setUserDashboardTab('profile');
    }

    if (view === 'admin') {
      if (!currentUser) {
        setRedirectTarget('public');
        setCurrentView('login');
        showToast('Please sign in with administrator credentials.', 'info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const adminAuthorized = isUserAdmin(currentUser);
      if (!adminAuthorized) {
        showToast('Access Denied: Administrator account required.', 'error');
        setCurrentView('public');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const isAdmin = isUserAdmin(currentUser);

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
        onViewChange={handleViewChange}
        onRequestPlanClick={() => handleOpenRequestPlan()}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenOrders={() => {
          setUserDashboardTab('orders');
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccount={() => {
          setUserDashboardTab('profile');
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Views */}
      {currentView === 'public' && (
        <main>
          <Hero
            onExplorePlans={scrollToPlans}
            onOpenDashboard={() => handleViewChange('dashboard')}
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

      {/* Login Page */}
      {currentView === 'login' && (
        <LoginPage
          onNavigate={(view) => {
            if (view === 'register') {
              setCurrentView('register');
            } else {
              handleViewChange(view);
            }
          }}
          onShowToast={showToast}
          redirectTarget={redirectTarget}
        />
      )}

      {/* Register Page */}
      {currentView === 'register' && (
        <RegisterPage
          onNavigate={(view) => {
            if (view === 'login') {
              setCurrentView('login');
            } else {
              handleViewChange(view);
            }
          }}
          onShowToast={showToast}
          redirectTarget={redirectTarget}
        />
      )}

      {/* Protected User Dashboard */}
      {currentView === 'dashboard' && (
        currentUser ? (
          <UserDashboard
            onRequestPlanClick={() => handleOpenRequestPlan()}
            onShowToast={showToast}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            currentUser={currentUser}
            onLogout={handleLogout}
            initialTab={userDashboardTab}
            onNavigateHome={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <LoginPage
            onNavigate={handleViewChange}
            onShowToast={showToast}
            redirectTarget="public"
          />
        )
      )}

      {/* Protected Admin Control Panel */}
      {currentView === 'admin' && (
        !currentUser ? (
          <LoginPage
            onNavigate={handleViewChange}
            onShowToast={showToast}
            redirectTarget="public"
          />
        ) : isAdmin ? (
          <AdminPanel
            onShowToast={showToast}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Access Denied</h2>
                <p className="text-xs text-slate-400 mt-2">
                  The Admin Control Panel is restricted to authorized Administrator accounts only. Your current role is <span className="text-rose-400 font-semibold">{currentUser.role || 'Standard User'}</span>.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setCurrentView('public');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-lg shadow-purple-600/30"
                >
                  Return to Home Page
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Switch Account / Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )
      )}

      {/* Category Plans */}
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

      {/* Checkout */}
      <AnimatePresence>
        {currentView === 'checkout' && (
          currentUser ? (
            <Checkout
              plan={selectedPlan}
              onBack={() => {
                setCurrentView('public');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
              currentUser={currentUser}
              onRequireAuth={() => {
                setRedirectTarget('checkout');
                setCurrentView('login');
                showToast('Please login or register to purchase a plan.', 'info');
              }}
              onOrderSuccess={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <LoginPage
              onNavigate={(view) => {
                if (view === 'register') {
                  setCurrentView('register');
                } else {
                  handleViewChange(view);
                }
              }}
              onShowToast={showToast}
              redirectTarget="checkout"
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}
