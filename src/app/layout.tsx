import type {Metadata} from 'next';
import './globals.css';
import { AscendProvider } from '@/lib/store';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: 'Ascend | Self-Development & Life Management',
  description: 'Structured personal development and life management for high achievers.',
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
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AscendProvider>
            {children}
            <Toaster />
          </AscendProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}