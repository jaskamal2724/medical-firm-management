"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { NextResponse } from "next/server"

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return NextResponse.json(
        {message:"Filed Donot match"}
      )
    }

    // Here you would typically send the registration data to your backend
    // For this example, we'll just simulate a successful registratiom

    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
    const user = userCredential.user
    await updateProfile(user,{displayName:formData.username})

    // console.log("Registration data:", formData)
    // Redirect to login page after successful registration
    if(user){
      router.push("/login")
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
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="email" className="label">
          <span className="label-text">Email:</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="confirmPassword" className="label">
          <span className="label-text">Confirm Password:</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      {error && <p className="text-error mt-4">{error}</p>}
      <button type="submit" className="btn btn-primary mt-6 w-full">
        Register
      </button>
    </form>
  )
}

export default RegistrationForm

