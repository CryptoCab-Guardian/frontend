"use client"
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
        <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
      </body>
    </html>
  );
}
