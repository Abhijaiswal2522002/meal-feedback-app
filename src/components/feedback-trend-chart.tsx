"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

// Mock data for feedback trends
const data = [
  { date: "Apr 20", breakfast: 4.1, lunch: 4.3, dinner: 3.7 },
  { date: "Apr 21", breakfast: 4.2, lunch: 4.2, dinner: 3.9 },
  { date: "Apr 22", breakfast: 4.0, lunch: 4.4, dinner: 3.8 },
  { date: "Apr 23", breakfast: 4.3, lunch: 4.5, dinner: 4.0 },
  { date: "Apr 24", breakfast: 4.2, lunch: 4.3, dinner: 3.9 },
  { date: "Apr 25", breakfast: 4.4, lunch: 4.6, dinner: 4.1 },
  { date: "Apr 26", breakfast: 4.2, lunch: 4.5, dinner: 3.8 },
]

export function FeedbackTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="breakfast" name="Breakfast" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="lunch" name="Lunch" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="dinner" name="Dinner" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
