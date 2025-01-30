"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const Secureregister = () => {
  const [code, setCode] = useState("");
  const [showAlert, setShowAlert]=useState(false)
  
  const handleclick = () => {
    if (code === process.env.NEXT_PUBLIC_AUTH_REGISTRATION_SECRET) {
      redirect("/register");
    } else {
        setShowAlert(true)
        setTimeout(()=>{
            setShowAlert(false)
        },2000)
      
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Input
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          setCode((e.target as HTMLInputElement).value)
        }
        className="w-1/2"
      />
      <p className="m-10">Enter the secret to access registration page</p>
      <Button onClick={handleclick}>Submit</Button>
      <div className="m-9">
      {showAlert && (
        <div role="alert" className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Warning: Invalid code!</span>
      </div>
      )}
      </div>
    </div>
  );
};

export default Secureregister;
