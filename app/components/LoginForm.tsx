"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would validate credentials here
    if (username === "jassi" && password === "admin") {
      router.push(`/admin/${username}`)
    } else if (username === "jassi" && password === "user") {
      router.push(`/user/${username}`)
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-6 w-full max-w-sm mx-auto">
      <div className="form-control">
        <label htmlFor="username" className="label">
          <span className="label-text">Username:</span>
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="password" className="label">
          <span className="label-text">Password:</span>
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-6 w-full">
        Login
      </button>
    </form>
  )
}

export default LoginForm

