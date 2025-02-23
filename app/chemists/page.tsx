"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure this points to your Firebase config
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { nanoid } from "nanoid";

interface Chemist {
  id: string; // Unique identifier for each chemist
  name: string;
  owner: string;
  contact: string;
  location: string;
}

export default function ChemistsPage() {
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [newChemist, setNewChemist] = useState({
    id: "",
    name: "",
    owner: "",
    contact: "",
    location: "",
  });

  // Fetch chemists from Firestore on mount
  useEffect(() => {
    const fetchChemists = async () => {
      const chemistsRef = doc(db, "chemists", "list");
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
      id: nanoid(),
    };

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
      setChemists((prev) => prev.filter((c) => c.id !== chemistWithId.id));
    }

    setNewChemist({
      id: "",
      name: "",
      owner: "",
      contact: "",
      location: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title */}
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Chemists Management
      </motion.h1>

      {/* Add Chemist Form */}
      <motion.div
        className="card bg-base-200 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0 mb-2">
            <h2 className="card-title text-lg sm:text-xl">Add Chemist Details</h2>
            
          </div>

          <form onSubmit={addChemist} className="space-y-4">
            {/* Name Field */}
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text text-sm sm:text-base">Chemist Name</span>
              </label>
              <input
                type="text"
                id="name"
                value={newChemist.name}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, name: e.target.value })
                }
                className="input input-bordered w-full text-sm sm:text-base"
                required
              />
            </div>

            {/* Shop Name Field */}
            <div className="form-control">
              <label htmlFor="owner" className="label">
                <span className="label-text text-sm sm:text-base">Owner</span>
              </label>
              <input
                type="text"
                id="owner"
                value={newChemist.owner}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, owner: e.target.value })
                }
                className="input input-bordered w-full text-sm sm:text-base"
                required
              />
            </div>

            {/* Contact Field */}
            <div className="form-control">
              <label htmlFor="contact" className="label">
                <span className="label-text text-sm sm:text-base">Contact</span>
              </label>
              <input
                type="text"
                id="contact"
                value={newChemist.contact}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, contact: e.target.value })
                }
                className="input input-bordered w-full text-sm sm:text-base"
                placeholder="+1234567890"
                required
              />
            </div>

            {/* Location Field */}
            <div className="form-control">
              <label htmlFor="location" className="label">
                <span className="label-text text-sm sm:text-base">Location</span>
              </label>
              <input
                type="text"
                id="location"
                value={newChemist.location}
                onChange={(e) =>
                  setNewChemist({ ...newChemist, location: e.target.value })
                }
                className="input input-bordered w-full text-sm sm:text-base"
                placeholder="Gurgaon"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full sm:text-base text-sm">
              Add Chemist
            </button>
          </form>
        </div>
      </motion.div>

      {/* Chemists List */}
      {chemists.length > 0 && (
        <motion.div
          className="card bg-base-200 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-lg sm:text-xl">Chemists List</h2>
            <div className="overflow-x-auto">
              <table className="table w-full table-compact sm:table-normal">
                <thead>
                  <tr>
                    <th className="text-sm sm:text-base">Name</th>
                    <th className="text-sm sm:text-base">Owner</th>
                    <th className="text-sm sm:text-base">Contact</th>
                    <th className="text-sm sm:text-base">Location</th>
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
                      <td className="text-sm sm:text-base">{chemist.name}</td>
                      <td className="text-sm sm:text-base">{chemist.owner}</td>
                      <td className="text-sm sm:text-base">{chemist.contact}</td>
                      <td className="text-sm sm:text-base">{chemist.location}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}