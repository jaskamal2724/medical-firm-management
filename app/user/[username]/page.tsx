"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";

interface Meeting {
  medicine: string[]; // Changed back to medicine
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

interface Chemist {
  id: string;
  name: string;
  owner: string;
  contact: string;
  location: string;
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
  const [editable, setEditable] = useState(false);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]); // Added medicines state

  const [newMeeting, setNewMeeting] = useState({
    medicine: [] as string[], // Changed back to medicine
    doctor: "",
    hospital: "",
    feedback: "",
    location: "",
    date: Date.now(),
    name: `${username}`,
  });
  const [newChemist, setNewChemist] = useState({
    name: "",
    owner: "",
    contact: "",
    location: "",
  });
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    hospital: "",
    contact: "",
    location: "",
    anniversary: "",
  });
  const [showForm, setShowForm] = useState<"meeting" | "chemist" | "doctor">(
    "meeting"
  );

  
  // Filter doctors based on the location entered in the meeting form
  const filteredDoctors = doctors.filter((doctor) =>
    newMeeting.location
      ? doctor.location
          .toLowerCase()
          .includes(newMeeting.location.toLowerCase())
      : true
  );

  // Toggle between meeting, chemist, and doctor forms
  const toggleForm = (formType: "meeting" | "chemist" | "doctor") => {
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
        toast.success("Meeting added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("Meeting added to existing document");
      } else {
        await setDoc(userRef, { meetings: [newMeeting] });
        toast.success("Meeting added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("New document created with meeting");
      }
    } catch (error) {
      console.log("Error adding document ", error);
      toast.error("Failed to add meeting", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }

    setNewMeeting({
      medicine: [], // Changed back to medicine
      doctor: "",
      hospital: "",
      feedback: "",
      location: "",
      date: Date.now(),
      name: `${username}`,
    });
  };

  // Add chemist
  const addChemist = async (e: React.FormEvent) => {
    e.preventDefault();
    const chemistWithId = { ...newChemist, id: nanoid() };
    setChemists((prev) => [...prev, chemistWithId]);

    try {
      const chemistsRef = doc(db, "chemists", "list");
      const chemistsSnap = await getDoc(chemistsRef);

      if (chemistsSnap.exists()) {
        const existingData = chemistsSnap.data().chemists || [];
        const updatedChemists = [...existingData, chemistWithId];
        await updateDoc(chemistsRef, { chemists: updatedChemists });
        toast.success("Chemist added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("Chemist added to existing document");
      } else {
        await setDoc(chemistsRef, { chemists: [chemistWithId] });
        toast.success("Chemist added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("New document created with chemist");
      }
    } catch (error) {
      console.error("Error adding chemist: ", error);
      setChemists((prev) => prev.filter((c) => c.id !== chemistWithId.id));
      toast.error("Failed to add chemist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }

    setNewChemist({ name: "", owner: "", contact: "", location: "" });
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
        const existingData = Array.isArray(doctorsSnap.data().doctors)?doctorsSnap.data().doctors:[doctorsSnap.data().doctors];
        const updatedDoctors = [...existingData, doctorWithId];
        await updateDoc(doctorsRef, { doctors: updatedDoctors });
        toast.success("Doctor added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("Doctor added to existing document");
      } else {
        await setDoc(doctorsRef, { doctors: [doctorWithId] });
        toast.success("Doctor added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.log("New document created with doctor");
      }
    } catch (error) {
      console.error("Error adding doctor: ", error);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorWithId.id));
      toast.error("Failed to add doctor", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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

  const handlechange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handlecancel = () => {
    setEditable(false);
    setNewDoctor({
      name: "",
      specialty: "",
      hospital: "",
      contact: "",
      location: "",
      anniversary: "",
    });
  };

  const handleEdit = async (id: string) => {
    try {
      setEditable(true);
      const docRef = doc(db, "doctors", "list");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const doctorData = docSnap.data().doctors;
        const editable = doctorData.find((d: { id: string }) => d.id === id);
        console.log(editable);
        setNewDoctor(editable);
      }
      await updateDoc(docRef, { doctors: newDoctor });
      console.log("Doctor details updated successfully!");
    } 
    catch (error) {
      console.log(error)
    }
  };

  const handleeditchanges=()=>{
    console.log(newDoctor)
  }

  const handleDelete = async (id: string) => { console.log(id)};
  
  // Fetch doctors and medicines from Firestore on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsRef = doc(db, "doctors", "list");
      const doctorsSnap = await getDoc(doctorsRef);

      if (doctorsSnap.exists()) {
        const data = doctorsSnap.data().doctors || [];
        setDoctors(Array.isArray(data) ? data : [data]);

      }
    };

    const fetchMedicines = async () => {
      const medicinesRef = doc(db, "medicines", "list"); // Assuming medicines are stored in medicines/list
      const medicinesSnap = await getDoc(medicinesRef);

      if (medicinesSnap.exists()) {
        const data = medicinesSnap.data().medicines || [];
        setMedicines(data);
      }
    };

    const fetchchemists = async () => {
      const chemistsref = doc(db, "chemists", "list");
      const chemistsSnap = await getDoc(chemistsref);

      if (chemistsSnap.exists()) {
        const data = (await chemistsSnap.data().chemists) || [];
        setChemists(data);
      }
    };

    const fetchmeetings = async () => {
      const meetingsref = doc(db, "users", `${name}`);
      const meetingsSnap = await getDoc(meetingsref);

      if (meetingsSnap.exists()) {
        const data = await meetingsSnap.data().meetings;
        setMeetings(data);
      }
    };

    fetchDoctors();
    fetchMedicines();
    fetchchemists();
    fetchmeetings();
  }, []);

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

      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome, {name}
      </motion.h1>

      {editable ? (
        <div>
          <form  className="bg-blue-100 p-6 rounded-lg shadow-md w-96 mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Doctor</h2>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="">Name</label>
              <input
                type="text"
                name="name"
                value={newDoctor?.name}
                className="border p-2 rounded-lg  mb-2"
                placeholder="Doctor Name"
                required
                onChange={handlechange}
              />
              <label htmlFor="">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={newDoctor.specialty}
                className="border p-2 rounded-lg  mb-2"
                placeholder="Specialty"
                required
                onChange={handlechange}
              />
              <label htmlFor="">Hospital</label>
              <input
                type="text"
                name="hospital"
                value={newDoctor.hospital}
                className="border p-2 rounded-lg  mb-2"
                placeholder="Hospital"
                required
                onChange={handlechange}
              />
              <label htmlFor="">Contact</label>
              <input
                type="text"
                name="contact"
                value={newDoctor.contact}
                className="border p-2 rounded-lg  mb-2"
                placeholder="Contact"
                required
                onChange={handlechange}
              />
              <label htmlFor="">Anniversary</label>
              <input
                type="text"
                name="anniversary"
                value={newDoctor.anniversary}
                className="border p-2 rounded-lg  mb-2"
                onChange={handlechange}
              />
              <label htmlFor="">location</label>
              <input
                type="text"
                name="location"
                value={newDoctor.location}
                className="border p-2 rounded-lg  mb-2"
                placeholder="Location"
                required
                onChange={handlechange}
              />
            </div>
            <div className="flex items-center justify-center gap-7">
              <button
                onClick={handleeditchanges}
                type="button"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={handlecancel}
                type="button"
                className=" bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="space-y-6 max-w-xl mx-auto px-4 py-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center gap-4 flex-col">
                  <h2 className="card-title">
                    {showForm === "meeting"
                      ? "Add Meeting Details"
                      : showForm === "chemist"
                      ? "Add Chemist Details"
                      : "Add Doctor Details"}
                  </h2>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Button
                      onClick={() => toggleForm("meeting")}
                      variant="outline"
                    >
                      Add Meeting
                    </Button>
                    <Button
                      onClick={() => toggleForm("chemist")}
                      variant="outline"
                    >
                      Add Chemist
                    </Button>
                    <Button
                      onClick={() => toggleForm("doctor")}
                      variant="outline"
                    >
                      Add Doctor
                    </Button>
                  </div>
                </div>

                {showForm === "meeting" ? (
                  <form onSubmit={addMeeting} className="space-y-4">
                    <div className="form-control">
                      <label htmlFor="location" className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={newMeeting.location}
                        onChange={(e) =>
                          setNewMeeting({
                            ...newMeeting,
                            location: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                        placeholder="Gurgaon"
                      />
                    </div>
                    <div className="form-control">
                      <label htmlFor="doctor" className="label">
                        <span className="label-text">Doctor</span>
                      </label>
                      <select
                      
                        id="doctor"
                        value={newMeeting.doctor}
                        onChange={(e) =>
                          setNewMeeting({
                            ...newMeeting,
                            doctor: e.target.value,
                          })
                        }
                        className="select select-bordered w-full"
                        required
                      >
                        <option value="" disabled>
                          Select a Doctor
                        </option>
                        {filteredDoctors.length>0 && filteredDoctors.map((doctor) => (
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
                          setNewMeeting({
                            ...newMeeting,
                            hospital: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label htmlFor="medicine" className="label">
                        <span className="label-text">Medicine Prescribed</span>
                      </label>

                      {/* Custom dropdown solution */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            const dropdown =
                              document.getElementById("medicine-dropdown");
                            dropdown?.classList.toggle("hidden");
                          }}
                          className="select select-bordered w-full text-left flex justify-between items-center"
                        >
                          <span>
                            {newMeeting.medicine.length > 0
                              ? `${newMeeting.medicine.length} medicines selected`
                              : "Select medicines"}
                          </span>
                          <span>▼</span>
                        </button>

                        <div
                          id="medicine-dropdown"
                          className="hidden absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {medicines.map((medicine) => (
                            <div
                              key={medicine.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => {
                                const isSelected = newMeeting.medicine.includes(
                                  medicine.name
                                );
                                let updatedMeds;

                                if (isSelected) {
                                  updatedMeds = newMeeting.medicine.filter(
                                    (med) => med !== medicine.name
                                  );
                                } else {
                                  updatedMeds = [
                                    ...newMeeting.medicine,
                                    medicine.name,
                                  ];
                                }

                                setNewMeeting((prev) => ({
                                  ...prev,
                                  medicine: updatedMeds,
                                }));
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={newMeeting.medicine.includes(
                                  medicine.name
                                )}
                                onChange={() => {}} // Handled by div click
                                className="mr-2"
                              />
                              <span>
                                {medicine.name} ({medicine.manufacturer})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Display selected medicines */}
                      {newMeeting.medicine.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">
                            Selected Medicines:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {newMeeting.medicine.map((med, index) => (
                              <span
                                key={index}
                                className="badge badge-primary badge-outline px-3 py-2"
                              >
                                {med}
                                <button
                                  type="button"
                                  className="ml-2 text-xs"
                                  onClick={() => {
                                    const updatedMeds =
                                      newMeeting.medicine.filter(
                                        (m) => m !== med
                                      );
                                    setNewMeeting((prev) => ({
                                      ...prev,
                                      medicine: updatedMeds,
                                    }));
                                  }}
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label htmlFor="feedback" className="label">
                        <span className="label-text">Feedback</span>
                      </label>
                      <textarea
                        id="feedback"
                        value={newMeeting.feedback}
                        onChange={(e) =>
                          setNewMeeting({
                            ...newMeeting,
                            feedback: e.target.value,
                          })
                        }
                        className="textarea textarea-bordered h-24"
                        rows={3}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Add Meeting
                    </button>
                  </form>
                ) : showForm === "chemist" ? (
                  <form onSubmit={addChemist} className="space-y-4">
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
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label htmlFor="owner" className="label">
                        <span className="label-text">Owner</span>
                      </label>
                      <input
                        type="text"
                        id="owner"
                        value={newChemist.owner}
                        onChange={(e) =>
                          setNewChemist({
                            ...newChemist,
                            owner: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
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
                        value={newChemist.contact}
                        onChange={(e) =>
                          setNewChemist({
                            ...newChemist,
                            contact: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label htmlFor="chemistLocation" className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <input
                        type="text"
                        id="chemistLocation"
                        value={newChemist.location}
                        onChange={(e) =>
                          setNewChemist({
                            ...newChemist,
                            location: e.target.value,
                          })
                        }
                        className="input input-bordered w-full"
                        placeholder="Gurgaon"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                      Add Chemist
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
                          setNewDoctor({
                            ...newDoctor,
                            specialty: e.target.value,
                          })
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
                          setNewDoctor({
                            ...newDoctor,
                            hospital: e.target.value,
                          })
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
                          setNewDoctor({
                            ...newDoctor,
                            contact: e.target.value,
                          })
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
                          setNewDoctor({
                            ...newDoctor,
                            location: e.target.value,
                          })
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
          </div>

          <div>
            {showForm === "meeting"
              ? meetings.length > 0 && (
                  <motion.div
                    className="card bg-base-200 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card-body">
                      <h2 className="card-title mx-auto">Meeting History</h2>
                      <div className="overflow-x-auto">
                        <table className="table">
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
                )
              : showForm === "doctor"
              ? doctors.length > 0 && (
                  <motion.div
                    className="card bg-base-200 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card-body">
                      <h2 className="card-title mx-auto">Doctors</h2>
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Specialty</th>
                              <th>Contact</th>
                              <th>Location</th>
                              <th>Anniversary</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doctors.map((item) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <td>{item.name || "N/A"}</td>
                                <td>{item.specialty || "N/A"}</td>
                                <td>{item.contact || "N/A"}</td>
                                <td>{item.location || "N/A"}</td>
                                <td>{item.anniversary || "N/A"}</td>
                                <td
                                  className="cursor-pointer"
                                  onClick={() => handleEdit(item.id)}
                                >
                                  <Pencil />
                                </td>
                                <td
                                  className="cursor-pointer"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 />
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )
              : chemists.length > 0 && (
                  <motion.div
                    className="card bg-base-200 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card-body">
                      <h2 className="card-title mx-auto">Chemists</h2>
                      <div className="overflow-x-auto ">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Owner</th>
                              <th>Contact</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chemists.map((item) => (
                              <motion.tr
                                key={nanoid()}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <td>{item.name || "N/A"}</td>
                                <td>{item.owner || "N/A"}</td>
                                <td>{item.contact || "N/A"}</td>
                                <td>{item.location || "N/A"}</td>
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
      )}
    </>
  );
}
