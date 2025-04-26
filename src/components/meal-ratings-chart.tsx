"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Mock data for meal ratings
const data = [
  { name: "Breakfast", rating: 4.2, feedbackCount: 28 },
  { name: "Lunch", rating: 4.5, feedbackCount: 32 },
  { name: "Dinner", rating: 3.8, feedbackCount: 15 },
  { name: "Snacks", rating: 4.0, feedbackCount: 12 },
  { name: "Weekend Special", rating: 4.7, feedbackCount: 22 },
]

export function MealRatingsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#22c55e" domain={[0, 5]} />
        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="rating" name="Average Rating" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="feedbackCount" name="Feedback Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
