import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// In a real app, this would be a database call
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2b$10$8OxDlUjXR3QS0nj2FyDvbOsXZwQ5QD1dCBYURA3oq3uFJlBcfd6Eq", // "password123"
    role: "admin",
  },
  {
    id: "2",
    name: "Test User",
    email: "user@example.com",
    password: "$2b$10$8OxDlUjXR3QS0nj2FyDvbOsXZwQ5QD1dCBYURA3oq3uFJlBcfd6Eq", // "password123"
    role: "user",
  },
]

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    // Find user in our mock database
    const userIndex = users.findIndex((user) => user.email === session.user.email)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user name
    users[userIndex].name = name

    // Return updated user (without password)
    return NextResponse.json({
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      role: users[userIndex].role,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
