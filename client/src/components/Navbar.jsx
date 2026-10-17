import React from 'react';
import { Sun, Moon, LogIn, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { evaluateEmailDomain } from '../utils/emailValidator';

function getUserInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const cleanParts = parts.filter((p) => !/^(dr|prof|mr|mrs|ms)\.?$/i.test(p));
  const target = cleanParts.length >= 2 ? cleanParts : parts;
  return (target[0][0] + target[target.length - 1][0]).toUpperCase();
}

function getRoleBadgeStyle(role) {
  switch (role) {
    case 'coordinator':
      return 'bg-amber-400/20 text-amber-200 border-amber-300/30';
    case 'specialist':
      return 'bg-purple-400/20 text-purple-200 border-purple-300/30';
    default:
      return 'bg-cyan-400/20 text-cyan-200 border-cyan-300/30';
  }
}

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const emailInfo = user ? evaluateEmailDomain(user.email) : null;
  const initials = getUserInitials(user?.name);

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#11243b] via-[#1b3b57] to-[#25527a] dark:from-[#0d1e36] dark:via-[#162d4e] dark:to-[#0f223d] border-b border-[#0e1e32]/30 dark:border-blue-500/30 shadow-md dark:shadow-xl dark:shadow-black/60 text-white transition-all duration-200">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Portal Branding */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-christ-800 to-christ-600 flex items-center justify-center text-white shadow-md font-bold text-base sm:text-lg border border-white/30 dark:border-blue-400/40 group-hover:scale-105 transition-transform shrink-0">
              CAI
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                  CENTRE FOR ARTIFICIAL INTELLIGENCE
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-white/20 dark:bg-blue-500/20 text-white dark:text-blue-200 border border-white/30 dark:border-blue-400/30 shrink-0">
                  Requests Office
                </span>
              </div>
              <p className="hidden sm:block text-xs text-blue-100/80 dark:text-blue-200/70 font-medium truncate">
                Christ University • Central Campus
              </p>
            </div>
          </div>

          {/* Navigation Links & User Controls */}
          <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                currentView === 'home'
                  ? 'bg-white/25 text-white shadow-xs font-bold border border-white/30 dark:bg-blue-600/30 dark:text-blue-100 dark:border-blue-400/40'
                  : 'text-white/85 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-white dark:hover:bg-blue-900/30'
              }`}
            >
              <span className="hidden lg:inline">Information for Applicants</span>
              <span className="lg:hidden">Info</span>
            </button>

            {user && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  currentView === 'dashboard'
                    ? 'bg-white/25 text-white shadow-xs font-bold border border-white/30 dark:bg-blue-600/30 dark:text-blue-100 dark:border-blue-400/40'
                    : 'text-white/85 hover:text-white hover:bg-white/15 dark:text-slate-300 dark:hover:text-white dark:hover:bg-blue-900/30'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:hidden" />
                <span>Dashboard</span>
              </button>
            )}

            {user && user.role === 'requester' && (
              <button
                onClick={() => setCurrentView('new-request')}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#1b3b57] hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 shadow-md dark:shadow-blue-950/50 hover:scale-105 transition-all shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">New Request</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-1.5 sm:p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/20 border border-white/25 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-white/10 dark:border-slate-700/80 transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/25 dark:border-slate-700 shrink-0">
                {/* User Avatar Circle with Initials */}
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 dark:from-blue-600 dark:to-cyan-400 text-[#0f223d] dark:text-white font-extrabold text-xs flex items-center justify-center shadow-xs border border-white/40 shrink-0 cursor-default select-none"
                  title={`${user.name} (${user.role.toUpperCase()})\n${user.campus}\n${user.email}`}
                >
                  {initials}
                </div>

                {/* User Metadata */}
                <div className="text-left hidden md:block max-w-[130px] lg:max-w-[175px] xl:max-w-[210px] min-w-0">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-xs font-bold text-white truncate" title={user.name}>
                      {user.name}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded border shrink-0 ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div
                    className="text-[10px] text-blue-100/70 dark:text-slate-300/70 truncate mt-0.5"
                    title={`${user.campus} • ${user.email}`}
                  >
                    {user.campus.replace(/^Christ University\s*/i, '')}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 dark:text-slate-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#1b3b57] hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 shadow-md dark:shadow-blue-950/50 hover:scale-105 transition-all shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
