"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

export interface Dataitem{
  key:string
  value:string
}

const LoginForm = () => {
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const [name, setName]=useState("")
  const [role, setRole]=useState("")
  const [data, Setdata]=useState<Dataitem[]>([])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    
    const userRef = collection(db,"users")
    const q = query(userRef,where("email","==",email))
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc)=>{
      const userdata = doc.data()
      setName(userdata.name)
      setRole(userdata.role)
      Setdata(userdata.data)
    })
    
    if(role=="user"){
      router.push(`/user/${name}`)
    }
    else{
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        if(user){
          router.push(`/admin/${user.displayName}`)
        }
        
      } 
      catch (error) {
        
      }
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-6 w-full max-w-sm mx-auto">
      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">email:</span>
        </label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
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


