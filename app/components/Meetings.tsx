"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { nanoid } from "nanoid"


interface Meeting {
  medicine: string;
  id: string;
  doctor: string;
  hospital: string;
  feedback: string;
  location: string;
  date:number;
  name:string
}

interface MeetingsTableProps {
  meetings: Meeting[]
  userId?: string
}

const MeetingsTable = ({ meetings, userId }: MeetingsTableProps) => {
  const [sortField, setSortField] = useState<keyof Meeting>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")

  // to get document name 
  

  const filteredMeetings = meetings
    .filter(meeting => 
      userId ? meeting.id === userId : true
    )
    .filter(meeting =>
      Object.values(meeting).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1
      }
      return a[sortField] < b[sortField] ? 1 : -1
    })

  const toggleSort = (field: keyof Meeting) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: keyof Meeting }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? 
      <SortAsc className="inline h-4 w-4 ml-1" /> : 
      <SortDesc className="inline h-4 w-4 ml-1" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {userId ? `User ${userId} Meetings` : "All Meetings"}
        </h2>
        <div className="relative w-64">
          <Input
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSort("date")}
              >
                Date <SortIcon field="date" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSort("doctor")}
              >
                Doctor <SortIcon field="doctor" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSort("medicine")}
              >
                Medicine <SortIcon field="medicine" />
              </TableHead>
              <TableHead>Notes</TableHead>
              {!userId && (
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("id")}
                >
                  Location <SortIcon field="id" />
                </TableHead>
              )}
              <TableHead>Person</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.map((meeting) => (
              <motion.tr
                key={nanoid()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <TableCell>{new Date(meeting.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{meeting.doctor}</TableCell>
                <TableCell>{meeting.medicine}</TableCell>
                <TableCell>{meeting.feedback}</TableCell>
                {!userId && <TableCell>{meeting.location}</TableCell>}
                <TableCell>{meeting.name.replace(/[^a-zA-Z\s]/g, " ")}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No meetings found
        </div>
      )}
    </motion.div>
  )
}

export default MeetingsTable;
