"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "./ThemeProvider"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"

const Navigation = () => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Medical Firm
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          {/* <li>
            <Link href="/admin" className={pathname.startsWith("/admin") ? "active" : ""}>
              Admin
            </Link>
          </li> */}
          {/* <li>
            <Link href="/user" className={pathname.startsWith("/user") ? "active" : ""}>
              User
            </Link>
          </li> */}
        </ul>
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

export default Navigation

