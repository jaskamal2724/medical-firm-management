"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MeetingsTable from "@/app/components/Meetings";
import {  doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface Meeting {
  medicine: string;
  id: string;
  doctor: string;
  hospital: string;
  feedback: string;
  location: string;
  date: number;
  name: string;
}

export default function AdminDashboard() {
  const { username } = useParams();
  const name = String(username).replace(/[^a-zA-Z\s]/g, " ");

  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [fetchedMeetings, setFetchedMeetings] = useState<Meeting[]>([]);

  const meeting_data = async () => {
    try {
      const docref = doc(db, "meeting-data", "list");
      const docsnap = await getDoc(docref);

      if (docsnap.exists()) {
        const data = docsnap.data().meetings;
        setFetchedMeetings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    meeting_data();
    setMeetings(fetchedMeetings);
  }, [meetings]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome : {name}</h1>

      <div className="flex items-center justify-center gap-6">
        <Link href="/doctors">
          <Button className="text-blue-600 bg-white hover:text-white hover:bg-slate-500">
            Doctors
          </Button>
        </Link>
        <Link href="/chemists">
          <Button className="text-blue-600 bg-white hover:text-white hover:bg-slate-500">
            Chemists
          </Button>
        </Link>
        <Link href="/medicine">
          <Button className="text-blue-600 bg-white hover:text-white hover:bg-slate-500">
            Medicines
          </Button>
        </Link>
        <Link href="/employees">
          <Button className="text-blue-600 bg-white hover:text-white hover:bg-slate-500">
            Employees
          </Button>
        </Link>
      </div>

      <MeetingsTable meetings={fetchedMeetings} />
    </div>
  );
}
