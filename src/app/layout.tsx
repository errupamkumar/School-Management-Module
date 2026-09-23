import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { CampusProvider } from '@/components/providers/CampusProvider';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Vidyalaya - School Management System',
  description: 'Complete School Management System for Indian Schools',
  applicationName: 'Vidyalaya',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vidyalaya',
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('school-ms-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var lang = localStorage.getItem('school-ms-lang');
                  if (lang) {
                    document.documentElement.lang = lang;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CampusProvider>
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
              </CampusProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
