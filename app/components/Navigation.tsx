"use client"

import Link from "next/link"
import { redirect} from "next/navigation"
import { useTheme } from "./ThemeProvider"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useAuth } from "./AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import Image from "next/image"


const Navigation = () => {
  const {user}= useAuth()

  const handlesignout=()=>{
    signOut(auth).then(()=>{
      console.log("signout success")
      redirect("/login")
    })
  }

  
  const { theme, toggleTheme } = useTheme()

  // const isActive = (path: string) => {
  //   if (path === "/") return pathname === path
  //   return pathname.startsWith(path)
  // }

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-lg md:text-xl">

          <Image src="/lemon.png" alt={""} width={150} height={150}/>

        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
         
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
