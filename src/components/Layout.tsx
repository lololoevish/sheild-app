'use client'
import { useState } from 'react'
import Head from 'next/head'
import { Space_Grotesk, Inter } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`${darkMode ? 'dark' : ''} ${spaceGrotesk.className}`}>
      <Head>
        <title>Shield CRM</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header - Digital Brutalism Style */}
        <header className="p-4 md:p-6 border-b-4 border-black dark:border-white bg-white dark:bg-black">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl md:text-3xl font-bold tracking-tighter">SHIELD</div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 border-2 border-black dark:border-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <a href="#" className="px-3 py-1 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                Dashboard
              </a>
              <a href="#" className="px-3 py-1 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                Contacts
              </a>
              <a href="#" className="px-3 py-1 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                Analytics
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Mobile Menu (hidden by default) */}
          <div className="md:hidden mt-4 border-t-2 border-black dark:border-white pt-4">
            <nav className="flex flex-col gap-2">
              <a href="#" className="px-3 py-2 border-2 border-black dark:border-white">Dashboard</a>
              <a href="#" className="px-3 py-2 border-2 border-black dark:border-white">Contacts</a>
              <a href="#" className="px-3 py-2 border-2 border-black dark:border-white">Analytics</a>
            </nav>
          </div>
        </header>

        {/* Main Content - 3 Column Layout */}
        <main className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          <aside className="col-span-1">
            <div className="p-4 border-2 border-black dark:border-white rounded-lg">
              <h3 className="text-xl font-bold mb-4">Navigation</h3>
              {/* Sidebar content */}
            </div>
          </aside>
          
          <section className="col-span-2">
            {children}
          </section>
        </main>

        {/* Footer */}
        <footer className="p-8 border-t-4 border-black dark:border-white bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Pricing</a></li>
              </ul>
            </div>
            {/* More footer sections */}
          </div>
        </footer>
      </div>
    </div>
  )
}