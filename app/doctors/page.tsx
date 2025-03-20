"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure this points to your Firebase config
import { nanoid } from "nanoid";
import { LogIn } from "lucide-react";

interface Doctor {
  id: string; // Unique identifier for each doctor
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  location: string;
  anniversary: string;
  addedby: string;
}

export default function DoctorsPage() {

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState({
    id: "",
    name: "",
    specialty: "",
    hospital: "",
    contact: "",
    location: "",
    anniversary: "",
    addedby: "",
  });

  // Fetch doctors from Firestore on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsRef = doc(db, "doctors-test", "list"); // Single document to store all doctors
      const doctorsSnap = await getDoc(doctorsRef);

      if (doctorsSnap.exists()) {
        const data = doctorsSnap.data().doctors || [];
        setDoctors(data);
      } else {
        <LogIn />;
      }
    };

    fetchDoctors();
  }, []);

  // Add a new doctor
  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    const doctorWithId = {
      ...newDoctor,
      id: nanoid(),
      addedby:"(admin)"
    };

    // Optimistically update the UI
    setDoctors((prev) => [...prev, doctorWithId]);

    try {
      const doctorsRef = doc(db, "doctors-test", "list");
      const doctorsSnap = await getDoc(doctorsRef);

      if (doctorsSnap.exists()) {
        const existingData = doctorsSnap.data().doctors || [];
        const updatedDoctors = [...existingData, doctorWithId];
        await updateDoc(doctorsRef, { doctors: updatedDoctors });
        console.log("Doctor added to existing document");
      } else {
        await setDoc(doctorsRef, { doctors: [doctorWithId] });
        console.log("New document created with doctor");
      }
    } catch (error) {
      console.error("Error adding doctor: ", error);
      // Roll back UI update on error
      setDoctors((prev) => prev.filter((d) => d.id !== doctorWithId.id));
    }

    // Reset form
    setNewDoctor({
      id: "",
      name: "",
      specialty: "",
      hospital: "",
      contact: "",
      location: "",
      anniversary: "",
      addedby:"",
    });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Doctors Management
      </motion.h1>

      <div className="flex flex-col items-center justify-center gap-7">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex justify-center items-center">
              <h2 className="card-title text-center">Add Doctor Details</h2>
            </div>

            <form onSubmit={addDoctor} className="space-y-4">
              <div className="flex items-center justify-center gap-6">
                <div className="form-control">
                  <label htmlFor="name" className="label">
                    <span className="label-text">Doctor Name</span>
                  </label>
                  <input
                    placeholder="Vishal"
                    type="text"
                    id="name"
                    value={newDoctor.name}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="specialty" className="label">
                    <span className="label-text">Specialty</span>
                  </label>
                  <input
                    placeholder="Cariologist"
                    type="text"
                    id="specialty"
                    value={newDoctor.specialty}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, specialty: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="hospital" className="label">
                  <span className="label-text">Hospital</span>
                </label>
                <input
                  placeholder="Fortis , Delhi"
                  type="text"
                  id="hospital"
                  value={newDoctor.hospital}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, hospital: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="form-control">
                  <label htmlFor="contact" className="label">
                    <span className="label-text">Contact</span>
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={newDoctor.contact}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, contact: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="e.g., +1234567890"
                    required
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="contact" className="label">
                    <span className="label-text">Birthday</span>
                  </label>
                  <input
                    type="text"
                    id="anniversary"
                    value={newDoctor.anniversary}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        anniversary: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="24 March 1997"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="location" className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={newDoctor.location}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, location: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., Gurgaon"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add Doctor
              </button>
            </form>
          </div>
        </div>

        {/* Doctors List */}
        {doctors.length > 0 && (
          <motion.div
            className="card bg-base-200 shadow-xl w-[900px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body">
              <h2 className="card-title">Doctors List</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Hospital</th>
                      <th>Contact</th>
                      <th>Anniversary</th>
                      <th>Location</th>
                      <th>Added By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <motion.tr
                        key={doctor.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <td>{doctor.name}</td>
                        <td>{doctor.specialty}</td>
                        <td>{doctor.hospital}</td>
                        <td>{doctor.contact}</td>
                        <td>{doctor.anniversary}</td>
                        <td>{doctor.location}</td>
                        <td>{doctor.addedby}</td>
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
