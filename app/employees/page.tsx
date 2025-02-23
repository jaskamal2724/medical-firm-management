"use client"
import bcrypt from "bcryptjs";
import { collection, getDocs, addDoc, query, where, doc, deleteDoc } from "firebase/firestore";
import { Pencil, Trash2, Download } from "lucide-react";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ExcelJS from "exceljs";

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    data: { [key: string]: string }[];
    role: string;
  }
  
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

const Page = () => {
  
    const [users, setUsers] = useState<User[]>([]);
  
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
  
    const [fetchedMeetings, setFetchedMeetings] = useState<Meeting[]>([]);
  
    const allusers = async () => {
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data(); // Use the `data()` method to access document data
  
        if (!data.meetings) {
          usersData.push({
            id: nanoid(),
            name: data.name,
            email: data.email,
            password: "",
            data: [],
            role: "user",
          });
  
          setUsers(usersData);
        } else {
          const response = data.meetings;
          // console.log(...response)
          setFetchedMeetings((prev) => [...prev, ...response]);
        }
      });
    };
  
    useEffect(() => {
      // Simulating fetching meetings data
      allusers();
      setMeetings(fetchedMeetings);
    }, [meetings]);
  
    const addUser = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const docRef = await addDoc(collection(db, "users"), {
          name: newUser.name,
          email: newUser.email,
          password: await bcrypt.hash(newUser.password, 10),
          data: [],
          role: "user",
        });
        console.log("user added", docRef.id);
        setUsers([
          ...users,
          { ...newUser, id: String(users.length + 1), data: [], role: "user" },
        ]);
        setNewUser({ name: "", email: "", password: "" });
      } catch (error) {
        console.error("error adding user", error);
      }
    };
  
    const updateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
        setUsers(
          users.map((user) => (user.id === editingUser.id ? editingUser : user))
        );
        setEditingUser(null);
      }
    };
  
    const deleteUser = async (email: string) => {
      try {
        // Query Firestore to find the document with the matching email
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          console.log(`No user found with email: ${email}`);
          return;
        }
  
        // Assuming email is unique, there should only be one match
        querySnapshot.forEach(async (docSnap) => {
          const userRef = doc(db, "users", docSnap.id);
          await deleteDoc(userRef);
          console.log(
            `User with email ${email} and ID ${docSnap.id} deleted from Firestore`
          );
        });
  
        // Update local state
        setUsers(users.filter((user) => user.email !== email));
      } catch (error) {
        console.error("Error deleting user from Firestore: ", error);
      }
    };
  
    const downloadUserMeetings = async (userId: string) => {
      const userMeetings = meetings.filter((meeting) => meeting.id === userId);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Meetings");
  
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Person Met", key: "personMet", width: 20 },
        { header: "Medicine Discussed", key: "medicineDiscussed", width: 20 },
        { header: "Notes", key: "notes", width: 30 },
        { header: "Date", key: "date", width: 15 },
      ];
  
      userMeetings.forEach((meeting) => {
        worksheet.addRow(meeting);
      });
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `user_${userId}_meetings.xlsx`;
      link.click();
    };
  
  return (
    <>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Management</h2>
          <form
            onSubmit={editingUser ? updateUser : addUser}
            className="flex flex-wrap gap-2"
          >
            <input
              type="text"
              placeholder="Name"
              value={editingUser ? editingUser.name : newUser.name}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, name: e.target.value })
                  : setNewUser({ ...newUser, name: e.target.value })
              }
              className="input input-bordered flex-1"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewUser({ ...newUser, email: e.target.value })
              }
              className="input input-bordered flex-1"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={editingUser ? editingUser.password : newUser.password}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, password: e.target.value })
                  : setNewUser({ ...newUser, password: e.target.value })
              }
              className="input input-bordered flex-1"
              required
            />
            <button type="submit" className="btn btn-primary">
              {editingUser ? "Update User" : "Add User"}
            </button>
          </form>
        </div>
      </div>

      {users.length > 0 && (
        <div className="overflow-x-auto mt-10">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="btn btn-warning btn-sm mr-2"
                    >
                      <Pencil></Pencil>
                    </button>
                    <button
                      onClick={() => deleteUser(user.email)}
                      className="btn btn-error btn-sm mr-2"
                    >
                      <Trash2></Trash2>
                    </button>
                    <button
                      onClick={() => downloadUserMeetings("user.id")}
                      className="btn btn-info btn-sm"
                    >
                      <Download></Download>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Page;
