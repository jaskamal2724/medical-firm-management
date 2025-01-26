import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "./components/Navigation"
import ThemeProvider from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Medical Firm Management",
  description: "Admin and User management for a medical firm",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-base-100 text-base-content">
            <Navigation />
            <main className="container mx-auto mt-4 p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

