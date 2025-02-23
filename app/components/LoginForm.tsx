"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Dataitem {
  key: string;
  value: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true); // Show loading state

    try {
      // Fetch user data from Firestore
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userdata = doc.data();
        const userName = userdata.name;
        const userRole = userdata.role;
        const userData = userdata.data;

        if (userRole === "user") {
          toast.success('Sign in Success', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });

          setTimeout(() => {
            router.push(`/user/${userName}`);
            setIsLoading(false); // Reset loading after redirect
          }, 1000);

          return userData;
        } else {
          // Admin login with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          if (user) {
            router.push(`/admin/${user.displayName}`);
          }
          setIsLoading(false);
        }
      } else {
        toast.error("User not found!");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Check your credentials.");
      setIsLoading(false);
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
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
            disabled={isLoading} // Disable input while loading
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
            disabled={isLoading} // Disable input while loading
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary mt-6 w-full `}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (<span className="loading loading-dots loading-lg"></span>) : ("Login")}
        </button>
      </form>
    </>
  );
};

export default LoginForm;