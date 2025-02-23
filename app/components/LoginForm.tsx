"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

export interface Dataitem {
  key: string;
  value: string;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Check Firestore for User Credentials
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists in Firestore
        let fetchedName = "";
        // let fetchedData: Dataitem[] = [];

        querySnapshot.forEach((doc) => {
          const userdata = doc.data();
          fetchedName = userdata.name;
          // fetchedData = userdata.data;
        });

        toast.success("User Login Success", { autoClose: 1000 });

        setTimeout(() => {
          setLoading(false);
          router.push(`/user/${fetchedName}`);
        }, 1000);

        return;
      }

      // Step 2: If not found in Firestore, check Firebase Authentication for Admin
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        toast.success("Admin Login Success", { autoClose: 1000 });

        setTimeout(() => {
          setLoading(false);
          router.push(`/admin/${userCredential.user.displayName || "admin"}`);
        }, 1000);
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={5000} pauseOnHover />
      <form onSubmit={handleSubmit} className="card bg-blue-200 shadow-xl p-6 w-full max-w-sm mx-auto">
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Unique ID :</span>
          </label>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <div className="form-control mt-4">
          <label htmlFor="password" className="label">
            <span className="label-text">Password:</span>
          </label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <button type="submit" className="btn btn-primary mt-6 w-full">
          {loading ? <span className="loading loading-dots loading-lg"></span> : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
