import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';
import { useThemeStore } from '@/lib/store/themeStore';
import { useClerk } from '@clerk/nextjs';
import { useClerkAppearance } from '@/lib/hooks/useClerkAppearance';

export const Navigation = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const { openSignIn, openSignUp } = useClerk();
  const getAppearance = useClerkAppearance();

  // Throttle function
  const throttle = (func: (...args: any[]) => void, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  const navItems = useMemo(() => [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  const navigateToLandingSection = (href: string) => {
    const section = href.slice(1); // remove #
    router.push(`/#${section}`);
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const isOnLanding = pathname === '/';



  const handleSignIn = () => {
    openSignIn({
      signUpUrl: '/sign-up',
      afterSignInUrl: '/home',
      appearance: getAppearance(),
    });
    setIsOpen(false);
  };

  const handleSignUp = () => {
    openSignUp({
      signInUrl: '/sign-in',
      afterSignUpUrl: '/home',
      appearance: getAppearance(),
    });
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        transform: scrolled ? 'translateY(-10px)' : 'translateY(0px)',
        willChange: 'transform'
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
            : 'bg-light-50/90 backdrop-blur-md border-b border-light-300/20'
          : theme === 'dark'
          ? 'bg-transparent border-b border-white/10'
          : 'bg-transparent border-b border-gray-600/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {theme === 'dark' ? (
                <img src="/Logo.svg" alt="Uncubed" className="w-8 h-8" loading="lazy" sizes="32px" />
              ) : (
                <img src="/darkLogo.svg" alt="Uncubed" className="w-8 h-8" loading="lazy" sizes="32px" />
              )}
            </div>
            <span className={`text-xl font-bold bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-white to-gray-300'
                : 'bg-gradient-to-r from-light-900 to-light-600'
            }`}>
              Uncubed
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => isOnLanding ? scrollToSection(item.href) : navigateToLandingSection(item.href)}
                  className={`transition-colors duration-200 font-medium relative group ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-light-600 hover:text-light-900'
                  }`}
                >
                 <span className="relative">
                   {item.label}
                   <span className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 w-0 group-hover:w-full transition-all duration-300" />
                 </span>
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="glass"
              size="sm"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSignUp}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button - Enhanced visibility and touch target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden relative p-4 rounded-xl backdrop-blur-sm transition-all duration-200 group touch-manipulation ${
              theme === 'dark'
                ? 'bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:border-white/50'
                : 'bg-light-200/50 border-2 border-light-400/50 hover:bg-light-300/50 hover:border-light-500/50'
            }`}
            style={{
              minWidth: '48px',
              minHeight: '48px',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className={`w-6 h-6 drop-shadow-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} strokeWidth={2.5} />
                ) : (
                  <Menu className={`w-6 h-6 drop-shadow-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} strokeWidth={2.5} />
                )}
              </motion.div>
            </div>
            {/* Enhanced visual indicator */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        </div>

        {/* Mobile Navigation - Enhanced */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className={`py-6 space-y-2 backdrop-blur-md rounded-b-2xl mt-2 ${
            theme === 'dark'
              ? 'bg-black/80 border-t border-white/10'
              : 'bg-light-50/90 border-t border-light-300/20'
          }`}>
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : -20
                }}
                transition={{
                  delay: isOpen ? index * 0.1 : 0,
                  duration: 0.2
                }}
                onClick={() => isOnLanding ? scrollToSection(item.href) : navigateToLandingSection(item.href)}
                className={`block w-full text-left transition-all duration-200 font-medium py-3 px-6 rounded-lg mx-2 touch-manipulation ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-light-600 hover:text-light-900 hover:bg-light-200/30'
                }`}
                style={{
                  minHeight: '48px',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                {item.label}
              </motion.button>
            ))}

            <div className={`flex flex-col gap-3 pt-4 px-4 ${
              theme === 'dark'
                ? 'border-t border-white/10'
                : 'border-t border-light-300/20'
            }`}>
              {/* Theme Toggle for Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  y: isOpen ? 0 : 20
                }}
                transition={{
                  delay: isOpen ? navItems.length * 0.1 : 0,
                  duration: 0.2
                }}
                className="flex justify-center mb-4"
              >
                <ThemeToggle />
              </motion.div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{
                   opacity: isOpen ? 1 : 0,
                   y: isOpen ? 0 : 20
                 }}
                 transition={{
                   delay: isOpen ? (navItems.length + 1) * 0.1 : 0,
                   duration: 0.2
                 }}
               >
                  <Button
                    variant="glass"
                    size="md"
                    className="w-full touch-manipulation"
                    style={{
                      minHeight: '48px',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
               </motion.div>

               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{
                   opacity: isOpen ? 1 : 0,
                   y: isOpen ? 0 : 20
                 }}
                 transition={{
                   delay: isOpen ? (navItems.length + 2) * 0.1 : 0,
                   duration: 0.2
                 }}
               >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full touch-manipulation"
                    style={{
                      minHeight: '48px',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onClick={handleSignUp}
                  >
                    Get Started
                  </Button>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
});