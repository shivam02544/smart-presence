import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ToastProvider from "@/providers/toast-provider";

export const metadata = {
  title: "SmartPresence - Intelligent Attendance System",
  description:
    "Secure, offline-first, and anti-proxy attendance tracking for modern educational institutions.",
  keywords:
    "attendance, college, offline, anti-proxy, education, smart attendance, tracking",
  authors: [{ name: "SmartPresence Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen antialiased bg-gray-50 text-gray-900
        dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300`}>
        <ThemeProvider>
          {/* 🔥 Toast System Enabled Globally */}
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <script>
          {`if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/service-worker.js")
              .then(() => console.log("✔ Service Worker Registered"))
              .catch(err => console.error("SW Registration Failed", err));
          }`}
        </script>
      </body>
    </html>
  );
}
