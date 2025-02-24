"use client";

import {  useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

import {toast, ToastContainer} from "react-toastify"

interface Meeting {
  medicine: string;
  id: number;
  doctor: string;
  hospital: string;
  feedback: string;
  location: string;
  date: number;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
  location: string;
  anniversary: string;
}

interface Medicine {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  stock: number;
}

export default function UserDashboard() {
  const { username } = useParams();
  const name = String(username).replace("%20", " ");
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMeeting, setNewMeeting] = useState({
    doctor: "",
    hospital: "",
    medicine: "",
    feedback: "",
    location: "",
    date: Date.now(),
    name: `${username}`,
  });
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    manufacturer: "",
    stock: 0,
  });
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    hospital: "",
    contact: "",
    location: "",
    anniversary: "",
  });
  const [showForm, setShowForm] = useState<"meeting" | "medicine" | "doctor">(
    "meeting"
  );

  // Toggle between meeting, medicine, and doctor forms
  const toggleForm = (formType: "meeting" | "medicine" | "doctor") => {
    setShowForm(formType);
  };

  // Add meeting
  const addMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateMeetings = {
      ...newMeeting,
      id: meetings.length + 1,
      date: Date.now(),
      name: `${username}`,
    };

    setMeetings([...meetings, updateMeetings]);

    try {
      const userRef = doc(db, "users", `${username}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingData = userSnap.data().meetings || [];
        const updatedMeetings = [...existingData, newMeeting];
        await updateDoc(userRef, { meetings: updatedMeetings });
        console.log("Meeting added to existing document");
      } else {
        await setDoc(userRef, { meetings: [newMeeting] });
        console.log("New document created with meeting");
      }
    } catch (error) {
      console.log("Error adding document ", error);
    }

    setNewMeeting({
      doctor: "",
      hospital: "",
      medicine: "",
      feedback: "",
      location: "",
      date: Date.now(),
      name: `${username}`,
    });
  };

  // Add medicine
  const addMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    const medicineWithId = { ...newMedicine, id: nanoid() };
    setMedicines((prev) => [...prev, medicineWithId]);

    try {
      const medicinesRef = doc(db, "medicines", "list");
      const medicinesSnap = await getDoc(medicinesRef);

      if (medicinesSnap.exists()) {
        const existingData = medicinesSnap.data().medicines || [];
        const updatedMedicines = [...existingData, medicineWithId];
        await updateDoc(medicinesRef, { medicines: updatedMedicines });
        toast.success('medicine added', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
          });
        console.log("Medicine added to existing document");
      } else {
        await setDoc(medicinesRef, { medicines: [medicineWithId] });
        toast.success('medicine added', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
          });
        console.log("New document created with medicine");
      }
    } catch (error) {
      console.error("Error adding medicine: ", error);
      setMedicines((prev) => prev.filter((m) => m.id !== medicineWithId.id));
    }

    setNewMedicine({ name: "", description: "", manufacturer: "", stock: 0 });
  };

  // Add doctor
  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctorWithId = { ...newDoctor, id: nanoid() };
    setDoctors((prev) => [...prev, doctorWithId]);

    try {
      const doctorsRef = doc(db, "doctors", "list");
      const doctorsSnap = await getDoc(doctorsRef);

      if (doctorsSnap.exists()) {
        const existingData = doctorsSnap.data().doctors || [];
        const updatedDoctors = [...existingData, doctorWithId];
        await updateDoc(doctorsRef, { doctors: updatedDoctors });
        toast.success('doctor added', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
          });
        console.log("Doctor added to existing document");
      } else {
        await setDoc(doctorsRef, { doctors: [doctorWithId] });
        toast.success('doctor added', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
          });
        console.log("New document created with doctor");
      }
    } catch (error) {
      console.error("Error adding doctor: ", error);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorWithId.id));
    }

    setNewDoctor({
      name: "",
      specialty: "",
      hospital: "",
      contact: "",
      location: "",
      anniversary: "",
    });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => router.push("/login"))
      .catch((error) => console.error("Error signing out: ", error));
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

      <div className="space-y-6 max-w-xl mx-auto px-4 py-6">
        <motion.h1
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {name}
        </motion.h1>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center gap-4 flex-col">
              <h2 className="card-title">
                {showForm === "meeting"
                  ? "Add Meeting Details"
                  : showForm === "medicine"
                  ? "Add Medicine Details"
                  : "Add Doctor Details"}
              </h2>
              <div className="flex gap-2">
                <Button onClick={() => toggleForm("meeting")} variant="outline">
                  Add Meeting
                </Button>
                <Button
                  onClick={() => toggleForm("medicine")}
                  variant="outline"
                >
                  Add Medicine
                </Button>
                <Button onClick={() => toggleForm("doctor")} variant="outline">
                  Add Doctor
                </Button>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </div>
            </div>

            {showForm === "meeting" ? (
              <form onSubmit={addMeeting} className="space-y-4">
                <div className="form-control">
                  <label htmlFor="doctor" className="label">
                    <span className="label-text">Doctor</span>
                  </label>
                  <select
                    id="doctor"
                    value={newMeeting.doctor}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, doctor: e.target.value })
                    }
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="" disabled>
                      Select a Doctor
                    </option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label htmlFor="hospital" className="label">
                    <span className="label-text">Hospital</span>
                  </label>
                  <input
                    type="text"
                    id="hospital"
                    value={newMeeting.hospital}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, hospital: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="medicine" className="label">
                    <span className="label-text">Medicine Prescribed</span>
                  </label>
                  <select
                    id="medicine"
                    value={newMeeting.medicine}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, medicine: e.target.value })
                    }
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="" disabled>
                      Select a Medicine
                    </option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.name}>
                        {medicine.name} ({medicine.manufacturer})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label htmlFor="feedback" className="label">
                    <span className="label-text">Feedback</span>
                  </label>
                  <textarea
                    id="feedback"
                    value={newMeeting.feedback}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, feedback: e.target.value })
                    }
                    className="textarea textarea-bordered h-24"
                    rows={3}
                  ></textarea>
                </div>
                <div className="form-control">
                  <label htmlFor="location" className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={newMeeting.location}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, location: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Gurgaon"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Add Meeting
                </button>
              </form>
            ) : showForm === "medicine" ? (
              <form onSubmit={addMedicine} className="space-y-4">
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
                <div className="form-control">
                  <label htmlFor="description" className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    id="description"
                    value={newMedicine.description}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        description: e.target.value,
                      })
                    }
                    className="textarea textarea-bordered h-24"
                    rows={3}
                    placeholder="e.g., Uses, dosage, side effects"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="manufacturer" className="label">
                    <span className="label-text">Manufacturer</span>
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    value={newMedicine.manufacturer}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        manufacturer: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="stock" className="label">
                    <span className="label-text">Stock Available</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={newMedicine.stock}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        stock: parseInt(e.target.value) || 0,
                      })
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
            ) : (
              <form onSubmit={addDoctor} className="space-y-4">
                <div className="form-control">
                  <label htmlFor="doctorName" className="label">
                    <span className="label-text">Doctor Name</span>
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    value={newDoctor.name}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Vishal"
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="specialty" className="label">
                    <span className="label-text">Specialty</span>
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    value={newDoctor.specialty}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, specialty: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Cardiologist"
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="hospital" className="label">
                    <span className="label-text">Hospital</span>
                  </label>
                  <input
                    type="text"
                    id="hospital"
                    value={newDoctor.hospital}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, hospital: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Fortis, Delhi"
                    required
                  />
                </div>
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
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="anniversary" className="label">
                    <span className="label-text">Anniversary</span>
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
                <div className="form-control">
                  <label htmlFor="doctorLocation" className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    id="doctorLocation"
                    value={newDoctor.location}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, location: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Gurgaon"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Add Doctor
                </button>
              </form>
            )}
          </div>
        </div>

        {meetings.length > 0 && (
          <motion.div
            className="card bg-base-200 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body">
              <h2 className="card-title">Meeting History</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Hospital</th>
                      <th>Medicine</th>
                      <th>Feedback</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.map((meeting) => (
                      <motion.tr
                        key={nanoid()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <td>{meeting.doctor || "N/A"}</td>
                        <td>{meeting.hospital || "N/A"}</td>
                        <td>{meeting.medicine || "N/A"}</td>
                        <td>{meeting.feedback || "N/A"}</td>
                        <td>{meeting.location || "N/A"}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
