"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {ToastContainer, toast} from "react-toastify"

export interface Dataitem {
  key: string;
  value: string;
}

const LoginForm = () => {
  const [loading, setLoading]=useState(false)

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [data, Setdata] = useState<Dataitem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(loading) return
    setLoading(true)

    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty){
    querySnapshot.forEach((doc) => {
      const userdata = doc.data();
      setName(userdata.name);
      setRole(userdata.role);
      Setdata(userdata.data);
    });

    if (role == "user") {
      
      toast.success('Login Success', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
      setTimeout(()=>{
        setLoading(false)
        router.push(`/user/${name}`);
      },1000)
      
      return data;
    } 
    else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (user) {
          toast.success('Login Success', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            
          });
          setTimeout(()=>{
            setLoading(false)
            router.push(`/admin/${user.displayName}`);
          },1000)
          
        }
      } catch (error) {
        console.log("cant redirect to user or admin", error);
      }
    }
    }
    else{
      toast.error('user not found', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
      return
    }

  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
      />

      <form
        onSubmit={handleSubmit}
        className="card bg-blue-200 shadow-xl p-6 w-full max-w-sm mx-auto"
      >
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Unique ID :</span>
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
          {loading ? <span className="loading loading-dots loading-lg"></span> : "Login" }
        </button>
      </form>
    </>
  );
};

export default LoginForm;
