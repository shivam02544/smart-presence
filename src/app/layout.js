import './globals.css';

export const metadata = {
  title: 'SmartPresence - Intelligent Attendance System',
  description: 'Secure, offline-first, and anti-proxy attendance tracking for modern educational institutions.',
  keywords: 'attendance, college, offline, anti-proxy, education, smart attendance, tracking',
  authors: [{ name: 'SmartPresence Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#06b6d4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full min-h-screen antialiased bg-dark-900 text-gray-100 selection:bg-primary-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
