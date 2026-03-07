
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AscendProvider } from '@/lib/store';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Ascend | Self-Development & Life Management',
  description: 'Structured personal development and life management for high achievers.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ascend',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/ascend-icon/192/192" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <FirebaseClientProvider>
            <AscendProvider>
              {children}
              <Toaster />
            </AscendProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
