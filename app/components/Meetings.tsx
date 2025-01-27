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

interface Meeting {
  id: number
  userId: string
  personMet: string
  medicineDiscussed: string
  notes: string
  date: string
}

interface MeetingsTableProps {
  meetings: Meeting[]
  userId?: string
}

const MeetingsTable = ({ meetings, userId }: MeetingsTableProps) => {
  const [sortField, setSortField] = useState<keyof Meeting>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMeetings = meetings
    .filter(meeting => 
      userId ? meeting.userId === userId : true
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
                onClick={() => toggleSort("personMet")}
              >
                Person Met <SortIcon field="personMet" />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSort("medicineDiscussed")}
              >
                Medicine <SortIcon field="medicineDiscussed" />
              </TableHead>
              <TableHead>Notes</TableHead>
              {!userId && (
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("userId")}
                >
                  User Name <SortIcon field="userId" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.map((meeting) => (
              <motion.tr
                key={meeting.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <TableCell>{new Date(meeting.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{meeting.personMet}</TableCell>
                <TableCell>{meeting.medicineDiscussed}</TableCell>
                <TableCell>{meeting.notes}</TableCell>
                {!userId && <TableCell>{meeting.userId}</TableCell>}
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