import { useCallback } from 'react';
import { useThemeStore } from '@/lib/store/themeStore';

export const useClerkAppearance = () => {
  const { theme } = useThemeStore();

  const getAppearance = useCallback(() => {
    const isDark = theme === 'dark';
    return {
      variables: {
        colorBackground: isDark ? '#0D0D0D' : '#FAFAFA',
        colorPrimary: isDark ? '#FFFFFF' : '#212121',
        colorText: isDark ? '#FFFFFF' : '#212121',
        colorInputBackground: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
        colorInputText: isDark ? '#FFFFFF' : '#212121',
        colorInputPlaceholder: isDark ? '#9E9E9E' : '#757575',
        colorTextSecondary: isDark ? '#BDBDBD' : '#616161',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '0.75rem',
      },
      elements: {
        card: {
          background: isDark ? 'rgba(13, 13, 13, 0.95)' : 'rgba(250, 250, 250, 0.95)',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(33, 33, 33, 0.1)',
          borderRadius: '1rem',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(33, 33, 33, 0.05)',
          padding: '2rem',
        },
        headerTitle: {
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: isDark ? '#FFFFFF' : '#212121'
        },
        headerSubtitle: {
          fontSize: '0.875rem',
          color: isDark ? '#BDBDBD' : '#616161',
          marginBottom: '1.5rem'
        },
        formButtonPrimary: {
          backgroundColor: isDark ? '#FFFFFF' : '#212121',
          color: isDark ? '#212121' : '#FFFFFF',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: '0.75rem 1.5rem',
          width: '100%',
          border: 'none',
          '&:hover': {
            backgroundColor: isDark ? '#EEEEEE' : '#424242',
            transform: 'translateY(-1px)',
            boxShadow: isDark
              ? '0 10px 25px -5px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          '&:focus': {
            outline: 'none',
            boxShadow: isDark
              ? '0 0 0 3px rgba(255, 255, 255, 0.1)'
              : '0 0 0 3px rgba(33, 33, 33, 0.1)'
          },
          transition: 'all 0.2s ease-in-out',
        },
        formFieldInput: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E0E0E0',
          borderRadius: '0.75rem',
          color: isDark ? '#FFFFFF' : '#212121',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          width: '100%',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: isDark ? '#FFFFFF' : '#212121',
            boxShadow: isDark
              ? '0 0 0 3px rgba(255, 255, 255, 0.1)'
              : '0 0 0 3px rgba(33, 33, 33, 0.1)',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF'
          },
          '&:hover': {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#BDBDBD'
          }
        },
        formFieldLabel: {
          color: isDark ? '#FFFFFF' : '#212121',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginBottom: '0.5rem'
        },
        footerAgentText: {
          color: isDark ? '#BDBDBD' : '#616161',
          fontSize: '0.875rem'
        },
        footerAgentLink: {
          color: '#3B82F6',
          textDecoration: 'none',
          fontWeight: '500',
          '&:hover': {
            textDecoration: 'underline',
            color: isDark ? '#60A5FA' : '#2563EB'
          }
        },
        dividerLine: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 33, 33, 0.1)'
        },
        dividerText: {
          color: isDark ? '#BDBDBD' : '#616161',
          fontSize: '0.875rem'
        },
        socialButtonsBlockButton: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E0E0E0',
          borderRadius: '0.75rem',
          color: isDark ? '#FFFFFF' : '#212121',
          fontSize: '0.875rem',
          padding: '0.75rem 1rem',
          width: '100%',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F5F5F5',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#BDBDBD',
            transform: 'translateY(-1px)',
            boxShadow: isDark
              ? '0 4px 12px -2px rgba(255, 255, 255, 0.1)'
              : '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
          },
          '&:focus': {
            outline: 'none',
            boxShadow: isDark
              ? '0 0 0 3px rgba(255, 255, 255, 0.1)'
              : '0 0 0 3px rgba(33, 33, 33, 0.1)'
          }
        },
        socialButtonsBlockButtonIcon: {
          color: isDark ? '#FFFFFF' : '#212121'
        },
        closeButton: {
          display: 'none'
        },
        formFieldInputShowPasswordButton: {
          color: isDark ? '#EBB30B' : '#000000',
          border: 'none',
          background: 'transparent',
          '&:hover': {
            color: isDark ? '#FCD34D' : '#333333',
            background: 'transparent',
            border: 'none'
          },
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent'
          },
          '&:active': {
            background: 'transparent'
          }
        },
        formFieldInputEyeIcon: {
          color: isDark ? '#EBB30B' : '#000000',
          background: 'transparent'
        },
        identityPreviewEditButton: {
          color: isDark ? '#EBB30B' : '#000000',
          background: 'transparent',
          border: 'none',
          '&:hover': {
            color: isDark ? '#FCD34D' : '#333333'
          },
          '&:focus': {
            outline: 'none',
            boxShadow: 'none'
          }
        },
        userButtonPopoverCard: {
          backgroundColor: isDark ? 'rgba(13, 13, 13, 0.95)' : 'rgba(250, 250, 250, 0.95)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(33, 33, 33, 0.1)',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      },
    };
  }, [theme]);

  return getAppearance;
};