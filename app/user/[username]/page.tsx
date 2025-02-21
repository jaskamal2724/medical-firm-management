"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { nanoid } from "nanoid";



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
}

export default function UserDashboard() {
  const { username } = useParams();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]); // State for doctors list

  const [newMeeting, setNewMeeting] = useState({
    doctor: "",
    hospital: "",
    medicine: "",
    feedback: "",
    location: "",
    date: Date.now(),
    name: `${username}`,
  });


  // Fetch meetings and doctors data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch meetings
      const userRef = doc(db, "users", `${username}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const meetingsData = userSnap.data().meetings || [];
        setMeetings(meetingsData);
      }

      // Fetch doctors
      const doctorsRef = doc(db, "doctors", "list");
      const doctorsSnap = await getDoc(doctorsRef);
      if (doctorsSnap.exists()) {
        const doctorsData = doctorsSnap.data().doctors || [];
        setDoctors(doctorsData);
      }
    };

    fetchData();
  }, []); // Depend on username, not newMeeting, to avoid infinite loop




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

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >


        Welcome, {username}
      </motion.h1>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex gap-52">
            <h2 className="card-title">Add Meeting Details</h2>
            <Link href="/login">
              <Button className="ml-0">Sign Out</Button>
            </Link>
          </div>

          <form onSubmit={addMeeting} className="space-y-4">
            {/* Doctor Dropdown */}
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

            {/* Hospital */}
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

            {/* Medicine */}
            <div className="form-control">
              <label htmlFor="medicine" className="label">
                <span className="label-text">Medicine Prescribed</span>
              </label>
              <input
                type="text"
                id="medicine"
                value={newMeeting.medicine}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, medicine: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Feedback */}
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

            {/* Location */}
            <div className="form-control">
              <label htmlFor="location" className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="flex items-center space-x-2">
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
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Meeting
            </button>
          </form>
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
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <motion.div
                  key={nanoid()}
                  className="bg-base-100 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <p className="font-semibold text-primary">Doctor:</p>
                    <p>{meeting.doctor || "N/A"}</p>

                    <p className="font-semibold text-primary">Hospital:</p>
                    <p>{meeting.hospital || "N/A"}</p>

                    <p className="font-semibold text-primary">Medicine:</p>
                    <p>{meeting.medicine || "N/A"}</p>
                    <p className="font-semibold text-primary">Feedback:</p>
                    <p>{meeting.feedback || "N/A"}</p>

                    <p className="font-semibold text-primary">Location:</p>
                    <p>{meeting.location || "N/A"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );



}