import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { hash, compare } from "bcrypt"

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Find user in our mock database
    const userIndex = users.findIndex((user) => user.email === session.user.email)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, users[userIndex].password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    users[userIndex].password = hashedPassword

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
