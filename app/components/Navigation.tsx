"use client"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { useTheme } from "./ThemeProvider"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useAuth } from "./AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

const Navigation = () => {
  const {user}= useAuth()

  const handlesignout=()=>{
    signOut(auth).then(()=>{
      console.log("signout success")
      redirect("/login")
    })
  }

  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  // const isActive = (path: string) => {
  //   if (path === "/") return pathname === path
  //   return pathname.startsWith(path)
  // }

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-lg md:text-xl">
          Medical Firm
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {/* <li>
            <Link href="/register" className={isActive("/register") ? "active" : ""}>
              Register
            </Link>
          </li> */}
          {/* <li>
            <Link href="/login" className={isActive("/login") ? "active" : ""}>
              Login
            </Link>
          </li> */}
          {/* <li>
            <Link href="/admin" className={isActive("/admin") ? "active" : ""}>
              Admin
            </Link>
          </li> */}
          {/* <li>
            <Link href="/user" className={isActive("/user") ? "active" : ""}>
              User
            </Link>
          </li> */}
          <li>
            {user && <p onClick={handlesignout}>sign out</p>}
            {!user && <p>sign in</p>}
          </li>
        </ul>
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

export default Navigation

