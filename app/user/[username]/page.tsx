"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

interface Meeting {
  id: number
  personMet: string
  medicineDiscussed: string
  notes: string
}

export default function UserDashboard() {
  const { username } = useParams()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [newMeeting, setNewMeeting] = useState({ personMet: "", medicineDiscussed: "", notes: "" })

  const addMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    setMeetings([...meetings, { ...newMeeting, id: meetings.length + 1 }])
    setNewMeeting({ personMet: "", medicineDiscussed: "", notes: "" })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome, {username}!</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Add Meeting Details</h2>
          <form onSubmit={addMeeting} className="space-y-4">
            <div className="form-control">
              <label htmlFor="personMet" className="label">
                <span className="label-text">Person Met:</span>
              </label>
              <input
                type="text"
                id="personMet"
                value={newMeeting.personMet}
                onChange={(e) => setNewMeeting({ ...newMeeting, personMet: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="medicineDiscussed" className="label">
                <span className="label-text">Medicine Discussed:</span>
              </label>
              <input
                type="text"
                id="medicineDiscussed"
                value={newMeeting.medicineDiscussed}
                onChange={(e) => setNewMeeting({ ...newMeeting, medicineDiscussed: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="notes" className="label">
                <span className="label-text">Notes:</span>
              </label>
              <textarea
                id="notes"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                className="textarea textarea-bordered h-24"
                rows={3}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Add Meeting
            </button>
          </form>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Meeting History</h2>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-base-100 p-4 rounded-lg shadow">
                <p>
                  <strong>Person Met:</strong> {meeting.personMet}
                </p>
                <p>
                  <strong>Medicine Discussed:</strong> {meeting.medicineDiscussed}
                </p>
                <p>
                  <strong>Notes:</strong> {meeting.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

