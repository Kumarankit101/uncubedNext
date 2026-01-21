'use client';

import React from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';
import { Logo } from '@/app/components/ui/Logo';

export const Footer: React.FC = () => {
  const { theme } = useThemeStore();
  const currentYear = new Date().getFullYear();

  const footerSections = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' },
      { label: 'Integrations', href: '#integrations' }
    ],
    Company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' }
    ],
    Resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community' },
      { label: 'Status', href: '#status' }
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '#security' },
      { label: 'Cookies', href: '#cookies' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/uncubedai', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/uncubedai', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@uncubed.me', label: 'Email' }
  ];

  return (
    <footer className={`relative py-12 sm:py-20 px-4 sm:px-6 ${
      theme === 'dark'
        ? 'border-t border-white/10'
        : 'border-t border-gray-300/30'
    }`}>
      {/* Background without grid (grid is now global) */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-t ${
          theme === 'dark' ? 'from-black' : 'from-gray-50'
        } to-transparent`} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Brand section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={40} />
                <span className={`text-2xl font-bold bg-clip-text text-transparent ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-white to-gray-300'
                    : 'bg-gradient-to-r from-light-900 to-light-600'
                }`}>
                 Uncubed
               </span>
            </div>

            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } mb-8 max-w-sm leading-relaxed`}>
              Transform your startup ideas into reality with AI-powered tools and insights.
              Join thousands of successful entrepreneurs.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      } transition-all duration-200 group`}
                      aria-label={social.label}
                    >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerSections).map(([title, links]) => (
              <div key={title}>
                <h3 className={`${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                } font-semibold mb-4`}>{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                     <li key={link.label}>
                       <a
                         href={link.href}
                         target="_blank"
                         rel="noopener noreferrer"
                         className={`${
                           theme === 'dark'
                             ? 'text-gray-400 hover:text-white'
                             : 'text-gray-600 hover:text-gray-900'
                         } transition-colors duration-200 text-sm flex items-center group`}
                       >
                         {link.label}
                         <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                       </a>
                     </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className={`border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-300/30'
        } pt-8`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } text-sm`}>
              © {currentYear} Uncubed. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className={`${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } text-sm transition-colors duration-200`}>
                Privacy
              </a>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className={`${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } text-sm transition-colors duration-200`}>
                Terms
              </a>
              {/* <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                All systems operational
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};