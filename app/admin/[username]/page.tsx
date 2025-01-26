"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
}

export default function AdminDashboard() {
  const { username } = useParams()
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ])
  const [newUser, setNewUser] = useState({ name: "", email: "" })
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const addUser = (e: React.FormEvent) => {
    e.preventDefault()
    setUsers([...users, { ...newUser, id: users.length + 1 }])
    setNewUser({ name: "", email: "" })
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome, {username}!</h1>
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
                    Edit
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="btn btn-error btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

