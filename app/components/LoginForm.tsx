"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Dataitem {
  key: string;
  value: string;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      // If authentication is successful, fetch role from Firestore
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data(); // Get the first matching document

        toast.success("Login Success", {
          autoClose: 1000, 
          onClose: () => router.push(`/user/${docData.name}`),
        });
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log(user)

      if (user) {
        const name = user.email?.split("@")[0]
        toast.success("Login Success",{
          autoClose:1000,
          onClose:()=>router.push(`/admin/${name}`)
        });
        
      }
    } catch (error) {
      console.log("Login failed:", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
          {loading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
