'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  CreditCard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Send
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { useRouter } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import { Logo } from '@/app/components/ui/Logo';
import { Modal } from '@/app/components/ui/Modal';
import { ContactForm } from '@/app/components/landing/ContactForm';
import Link from 'next/link';
import SmoothLink from '@/app/components/navigation/SmoothLink';
import { usePathname } from 'next/navigation';
import useCredits from '@/lib/hooks/useCredits';
import NetworkIndicator from '@/app/components/NetworkIndicator';

const navigationItems = [
  { label: 'Home', path: '/home' },
  { label: 'Projects', path: '/projects' },
  { label: 'AI Agents', path: '/agents' },
];

export const Header: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { theme } = useThemeStore();
  const credits = useCredits();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const headerPosition = isSmallScreen && isMobileMenuOpen ? 'relative' : 'fixed';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if screen is small
  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setUser(null);
    await signOut();
    router.push('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`${headerPosition} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
            : 'bg-light-50/90 backdrop-blur-md border-b border-light-300/20'
          : theme === 'dark'
          ? 'bg-transparent border-b border-white/10'
          : 'bg-transparent border-b border-gray-600/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
           {/* Logo */}
           <Link href="/home" className="flex items-center gap-2 sm:gap-3 group">
             <div className="group-hover:scale-110 transition-transform duration-200">
               <Logo size={32} />
             </div>
            <span className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-white to-gray-300'
                : 'bg-gradient-to-r from-light-900 to-light-600'
            }`}>
              Uncubed
            </span>
           </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <SmoothLink
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200 font-medium relative group ${
                    isActive
                      ? theme === 'dark'
                        ? 'text-white'
                        : 'text-light-900'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-light-600 hover:text-light-900'
                  }`}
                >
                  <span className="font-medium relative">
                    {item.label}
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </span>
                </SmoothLink>
               );

            })}
           </nav>

           {/* Mobile Menu Toggle */}
           <div className="md:hidden flex items-center gap-2">
             <ThemeToggle />
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className={`p-2 rounded-xl transition-all duration-200 ${
                 theme === 'dark'
                   ? 'hover:bg-white/[0.08]'
                   : 'hover:bg-light-200/50'
               }`}
             >
               {isMobileMenuOpen ? <X className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`} /> : <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-light-600'}`} />}
             </button>
           </div>

             {/* User Profile & Credits */}
             <div className="hidden md:flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

             {/* Credits Display */}
             <div className={`hidden sm:flex items-center gap-2 ${
               theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
             }`}>
               <CreditCard className={`w-4 h-4 ${
                 theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
               }`} />
               <span className="text-sm font-medium">{credits}</span>
               <span className={`text-xs ${
                 theme === 'dark' ? 'text-gray-500' : 'text-light-600'
               }`}>
                 credits
               </span>
             </div>
            
             {/* Background network indicator */}
             <NetworkIndicator />

             {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group ${
                  theme === 'dark'
                    ? 'hover:bg-white/[0.08]'
                    : 'hover:bg-light-200/50'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 transition-all duration-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                 {/* Removed user name/email from header, will be shown only inside dropdown */}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </button>

              {/* Dropdown Menu - Pure Black */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                     {/* Backdrop overlay for mobile */}
                     <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="fixed inset-0 bg-black z-40 md:hidden"
                       onClick={() => setIsDropdownOpen(false)}
                     />
                    
                    {/* Dropdown content - Pure Black */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-full mt-2 w-64 border rounded-xl shadow-2xl z-50 ${
                        theme === 'dark'
                          ? 'bg-black border-white/20'
                          : 'bg-light-50 border-light-300/30'
                      }`}
                      style={{ 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                      }}
                    >
                      <div className="p-2">
                        {/* User Info */}
                        <div className={`px-3 py-3 border-b ${
                          theme === 'dark' ? 'border-white/10' : 'border-light-300/20'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 transition-all duration-300 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-medium truncate ${
                                theme === 'dark' ? 'text-white' : 'text-light-900'
                              }`}>{user?.name}</div>
                              <div className={`text-xs truncate ${
                                theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                              }`}>{user?.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Credits (Mobile, linked) */}
                        <div className="sm:hidden flex items-center justify-between px-3 py-2 text-black">
                          <div className="flex items-center gap-2">
                            <CreditCard className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
                            }`} />
                            <span className="text-sm">Credits</span>
                          </div>
                          <span className="text-sm font-medium">{credits}</span>
                        </div>

                         {/* Menu Items */}
                         <div className="py-2">
                           <Link
                             href="/billing"
                             onClick={() => setIsDropdownOpen(false)}
                             className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                               theme === 'dark'
                                 ? 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                                 : 'text-light-700 hover:text-light-900 hover:bg-light-200/30'
                             }`}
                           >
                              <CreditCard className="w-4 h-4" />
                              <span>Billing</span>
                            </Link>


                           <button
                             onClick={() => {
                               setIsDropdownOpen(false);
                               setIsContactModalOpen(true);
                             }}
                             className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 w-full text-left ${
                               theme === 'dark'
                                 ? 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                                 : 'text-light-700 hover:text-light-900 hover:bg-light-200/30'
                             }`}
                           >
                             <Send className="w-4 h-4" />
                             <span>Report Bug</span>
                           </button>
                         </div>

                        {/* Logout */}
                        <div className={`border-t pt-2 ${
                          theme === 'dark' ? 'border-white/10' : 'border-light-300/20'
                        }`}>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden flex flex-col gap-1 mt-4 pt-4 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-light-300/20'
              }`}
            >
              {/* Navigation Items */}
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.path;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                  >
                    <SmoothLink
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 justify-end touch-manipulation relative group ${
                        isActive
                          ? theme === 'dark'
                            ? 'text-white'
                            : 'text-light-900'
                          : theme === 'dark'
                          ? 'hover:bg-white/5 text-gray-300 hover:text-white'
                          : 'hover:bg-light-200/50 text-light-600 hover:text-light-900'
                      }`}
                      style={{
                        minHeight: '48px',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <span className="font-medium text-sm relative">
                        {item.label}
                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`} />
                      </span>
                    </SmoothLink>
                  </motion.div>
                );
              })}

               {/* Actions */}
               <div className={`border-t pt-2 mt-4 ${
                 theme === 'dark' ? 'border-white/10' : 'border-light-300/20'
               }`}>
                 <Link
                   href="/billing"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`flex items-center justify-end gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                     theme === 'dark'
                       ? 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                       : 'text-light-700 hover:text-light-900 hover:bg-light-200/30'
                   }`}
                 >
                   <span>Billing</span>
                   <CreditCard className="w-4 h-4" />
                 </Link>
                 <button
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     setIsContactModalOpen(true);
                   }}
                   className={`flex items-center justify-end gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 w-full ${
                     theme === 'dark'
                       ? 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                       : 'text-light-700 hover:text-light-900 hover:bg-light-200/30'
                   }`}
                 >
                   <span>Report Bug</span>
                   <Send className="w-4 h-4" />
                 </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-end gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Section */}
              <div className="px-3 py-3 border-t mt-4">
                <div className="flex items-center justify-end gap-3">
                  <div className="flex-1 min-w-0 text-right">
                    <div className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>{user?.name}</div>
                    <div className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                    }`}>{user?.email}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-sm font-medium mr-2">{credits}</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
                    }`}>Credits</span>
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Report Bug"
        size="lg"
      >
        <ContactForm />
      </Modal>
    </motion.header>
  );
};