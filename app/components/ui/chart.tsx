"use client"

import { Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  yAxisWidth?: number
}

export function BarChart({ data, index, categories, colors, yAxisWidth = 50 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <Bar data={data} style={{ marginTop: "20px", marginRight: "30px", marginLeft: "20px", marginBottom: "5px" }} dataKey={""}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} />
        <Tooltip />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
        ))}
      </Bar>
    </ResponsiveContainer>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  colors: string[]
}

export function PieChart({ data, index, category, colors }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <Pie data={data} dataKey={category} nameKey={index} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </ResponsiveContainer>
  )
}

