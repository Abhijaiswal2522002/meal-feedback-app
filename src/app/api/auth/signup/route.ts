import { NextResponse } from "next/server"
import { hash } from "bcrypt"

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
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      role: "user",
    }

    // In a real app, this would save to a database
    users.push(newUser)

    // Return success without exposing password
    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
