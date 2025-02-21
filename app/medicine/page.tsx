"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure this points to your Firebase config
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { nanoid } from "nanoid";

interface Medicine {
  id: string; // Unique identifier for each medicine
  name: string;
  description: string;
  manufacturer: string;
  stock: number;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState({
    id: "",
    name: "",
    description: "",
    manufacturer: "",
    stock: 0,
  });

  // Fetch medicines from Firestore on mount
  useEffect(() => {
    const fetchMedicines = async () => {
      const medicinesRef = doc(db, "medicines", "list"); // Single document to store all medicines
      const medicinesSnap = await getDoc(medicinesRef);

      if (medicinesSnap.exists()) {
        const data = medicinesSnap.data().medicines || [];
        setMedicines(data);
      }
    };

    fetchMedicines();
  }, []);

  // Add a new medicine
  const addMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    const medicineWithId = {
      ...newMedicine,
      id: nanoid(), // Generate a unique ID for each medicine
    };

    // Optimistically update the UI
    setMedicines((prev) => [...prev, medicineWithId]);

    try {
      const medicinesRef = doc(db, "medicines", "list");
      const medicinesSnap = await getDoc(medicinesRef);

      if (medicinesSnap.exists()) {
        const existingData = medicinesSnap.data().medicines || [];
        const updatedMedicines = [...existingData, medicineWithId];
        await updateDoc(medicinesRef, { medicines: updatedMedicines });
        console.log("Medicine added to existing document");
      } else {
        await setDoc(medicinesRef, { medicines: [medicineWithId] });
        console.log("New document created with medicine");
      }
    } catch (error) {
      console.error("Error adding medicine: ", error);
      // Roll back UI update on error
      setMedicines((prev) => prev.filter((m) => m.id !== medicineWithId.id));
    }

    // Reset form
    setNewMedicine({
      id: "",
      name: "",
      description: "",
      manufacturer: "",
      stock: 0,
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Medicines Management
      </motion.h1>

      {/* Add Medicine Form */}
      <motion.div
        className="card bg-base-200 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Add Medicine Details</h2>
            <Link href="/dashboard">
              <Button>Back</Button>
            </Link>
          </div>

          <form onSubmit={addMedicine} className="space-y-4">
            {/* Name Field */}
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Medicine Name</span>
              </label>
              <input
                type="text"
                id="name"
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-control">
              <label htmlFor="description" className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                id="description"
                value={newMedicine.description}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, description: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                rows={3}
                placeholder="e.g., Uses, dosage, side effects"
              />
            </div>

            {/* Manufacturer Field */}
            <div className="form-control">
              <label htmlFor="manufacturer" className="label">
                <span className="label-text">Manufacturer</span>
              </label>
              <input
                type="text"
                id="manufacturer"
                value={newMedicine.manufacturer}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, manufacturer: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Stock Field */}
            <div className="form-control">
              <label htmlFor="stock" className="label">
                <span className="label-text">Stock Available</span>
              </label>
              <input
                type="number"
                id="stock"
                value={newMedicine.stock}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value) || 0 })
                }
                className="input input-bordered w-full"
                min="0"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Medicine
            </button>
          </form>
        </div>
      </motion.div>

      {/* Medicines List */}
      {medicines.length > 0 && (
        <motion.div
          className="card bg-base-200 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <h2 className="card-title">Medicines List</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Manufacturer</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <motion.tr
                      key={medicine.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <td>{medicine.name}</td>
                      <td>{medicine.description || "N/A"}</td>
                      <td>{medicine.manufacturer}</td>
                      <td>{medicine.stock}</td>
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