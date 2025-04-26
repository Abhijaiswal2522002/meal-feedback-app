"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart";

// Mock data for feedback distribution
const data = [
  { name: "5 Stars", count: 42 },
  { name: "4 Stars", count: 35 },
  { name: "3 Stars", count: 18 },
  { name: "2 Stars", count: 8 },
  { name: "1 Star", count: 5 },
];

export function FeedbackChart() {
  return (
    <div className="w-full h-96"> {/* <- controls height nicely */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Number of Ratings" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
