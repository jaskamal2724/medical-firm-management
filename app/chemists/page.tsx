"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure this points to your Firebase config

import { nanoid } from "nanoid";

interface Chemist {
  id: string; // Unique identifier for each chemist
  name: string;
  shopName: string;
  contact: string;
  location: string;
}

export default function ChemistsPage() {
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [newChemist, setNewChemist] = useState({
    id: "",
    name: "",
    shopName: "",
    contact: "",
    location: "",
  });

  // Fetch chemists from Firestore on mount
  useEffect(() => {
    const fetchChemists = async () => {
      const chemistsRef = doc(db, "chemists", "list"); // Single document to store all chemists
      const chemistsSnap = await getDoc(chemistsRef);

      if (chemistsSnap.exists()) {
        const data = chemistsSnap.data().chemists || [];
        setChemists(data);
      }
    };

    fetchChemists();
  }, []);

  // Add a new chemist
  const addChemist = async (e: React.FormEvent) => {
    e.preventDefault();

    const chemistWithId = {
      ...newChemist,
      id: nanoid(), // Generate a unique ID for each chemist
    };

    // Optimistically update the UI
    setChemists((prev) => [...prev, chemistWithId]);

    try {
      const chemistsRef = doc(db, "chemists", "list");
      const chemistsSnap = await getDoc(chemistsRef);

      if (chemistsSnap.exists()) {
        const existingData = chemistsSnap.data().chemists || [];
        const updatedChemists = [...existingData, chemistWithId];
        await updateDoc(chemistsRef, { chemists: updatedChemists });
        console.log("Chemist added to existing document");
      } else {
        await setDoc(chemistsRef, { chemists: [chemistWithId] });
        console.log("New document created with chemist");
      }
    } catch (error) {
      console.error("Error adding chemist: ", error);
      // Roll back UI update on error
      setChemists((prev) => prev.filter((c) => c.id !== chemistWithId.id));
    }

    // Reset form
    setNewChemist({
      id: "",
      name: "",
      shopName: "",
      contact: "",
      location: "",
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6"> {/* Reduced from max-w-4xl to max-w-xl */}
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Chemists Management
      </motion.h1>

      <div className="flex flex-col items-center justify-center gap-7">
      {/* Add Chemist Form */}
      <motion.div
        className="card bg-base-200 shadow-xl w-[500px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body">
          <div className="flex justify-center items-center">
            <h2 className="card-title">Add Chemist Details</h2> {/* Slightly larger title */}
          </div>

          <form onSubmit={addChemist} className="space-y-4"> {/* Increased spacing to match original */}
            {/* Name Field */}
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Chemist Name</span>
              </label>
              <input
                type="text"
                id="name"
                value={newChemist.name}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, name: e.target.value })
                }
                className="input input-bordered w-full" // Default size (larger than input-sm)
                required
              />
            </div>

            {/* Shop Name Field */}
            <div className="form-control">
              <label htmlFor="shopName" className="label">
                <span className="label-text">Shop Name</span>
              </label>
              <input
                type="text"
                id="shopName"
                value={newChemist.shopName}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, shopName: e.target.value })
                }
                className="input input-bordered w-full" // Default size
                required
              />
            </div>

            {/* Contact Field */}
            <div className="form-control">
              <label htmlFor="contact" className="label">
                <span className="label-text">Contact</span>
              </label>
              <input
                type="text"
                id="contact"
                value={newChemist.contact}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, contact: e.target.value })
                }
                className="input input-bordered w-full" // Default size
                placeholder="+1234567890"
                required
              />
            </div>

            {/* Location Field */}
            <div className="form-control">
              <label htmlFor="location" className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                id="location"
                value={newChemist.location}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, location: e.target.value })
                }
                className="input input-bordered w-full" // Default size
                placeholder="Gurgaon"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Chemist
            </button>
          </form>
        </div>
      </motion.div>

      {/* Chemists List */}
      {chemists.length > 0 && (
        <motion.div
          className="card bg-base-200 shadow-xl w-[700px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <h2 className="card-title text-center">Chemists List</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Shop Name</th>
                    <th>Contact</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {chemists.map((chemist) => (
                    <motion.tr
                      key={chemist.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <td>{chemist.name}</td>
                      <td>{chemist.shopName}</td>
                      <td>{chemist.contact}</td>
                      <td>{chemist.location}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
      </div>

    </div>
  );
}