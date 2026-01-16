'use client';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body className="w-full min-h-screen transition-colors duration-200 dark:bg-gray-800 shadow-md">
          <header className='flex flex-col sm:flex-row justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md transition-colors duration-200'>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">InterWork.ai</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <ThemeToggle />
            </div>
          </header>
          <main className="w-full">
            {children}
          </main>
        </body>
      </html>
    </ThemeProvider>
  );
}