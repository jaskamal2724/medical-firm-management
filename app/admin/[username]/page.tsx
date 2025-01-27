"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ExcelJS from "exceljs"
import MeetingsTable from "@/app/components/Meetings"
import { Pencil,  Trash2, Download} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  password: string
}

interface Meeting {
  id: number
  userId: string
  personMet: string
  medicineDiscussed: string
  notes: string
  date: string
}

export default function AdminDashboard() {
  const { username } = useParams()
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", password: "password123" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password456" },
  ])
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])

  const fetchedMeetings: Meeting[] = [
    {
      id: 1,
      userId: "John",
      personMet: "Dr. Brown",
      medicineDiscussed: "Aspirin",
      notes: "Follow-up in 2 weeks",
      date: "2023-06-01",
    },
    {
      id: 2,
      userId: "John",
      personMet: "Nurse Johnson",
      medicineDiscussed: "Ibuprofen",
      notes: "Patient reported improvement",
      date: "2023-06-03",
    },
    {
      id: 3,
      userId: "Jane",
      personMet: "Dr. Smith",
      medicineDiscussed: "Amoxicillin",
      notes: "Prescribed for 7 days",
      date: "2023-06-02",
    },
    {
      id: 4,
      userId: "Jane",
      personMet: "Pharmacist Lee",
      medicineDiscussed: "Vitamin D",
      notes: "Recommended daily supplement",
      date: "2023-06-04",
    },
  ]

  useEffect(() => {
    // Simulating fetching meetings data
    setMeetings(fetchedMeetings)
  }, [fetchedMeetings])

  const addUser = (e: React.FormEvent) => {
    e.preventDefault()
    setUsers([...users, { ...newUser, id: users.length + 1 }])
    setNewUser({ name: "", email: "", password: "" })
  }

  const updateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
      setEditingUser(null)
    }
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const downloadUserMeetings = async (userId: string) => {
    const userMeetings = meetings.filter((meeting) => meeting.userId === userId)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Meetings")

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Person Met", key: "personMet", width: 20 },
      { header: "Medicine Discussed", key: "medicineDiscussed", width: 20 },
      { header: "Notes", key: "notes", width: 30 },
      { header: "Date", key: "date", width: 15 },
    ]

    userMeetings.forEach((meeting) => {
      worksheet.addRow(meeting)
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = `user_${userId}_meetings.xlsx`
    link.click()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome, Admin {username}!</h1>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Management</h2>
          <form onSubmit={editingUser ? updateUser : addUser} className="flex flex-wrap gap-2">
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

      <div className="overflow-x-auto">
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
                  
                  <button onClick={() => setEditingUser(user)} className="btn btn-warning btn-sm mr-2">
                    <Pencil></Pencil>
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="btn btn-error btn-sm mr-2">
                    <Trash2></Trash2>
                  </button>
                  <button onClick={() => downloadUserMeetings("user.id")} className="btn btn-info btn-sm">
                    <Download></Download>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MeetingsTable meetings={fetchedMeetings}/>
    </div>
  )
}

