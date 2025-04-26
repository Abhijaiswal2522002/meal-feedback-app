import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare, hash } from "bcrypt"

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

// Mock user database functions
async function getUser(email: string) {
  return users.find((user) => user.email === email)
}

// This function is exported for use in the signup route
async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hash(password, 10)
  const newUser = {
    id: `${users.length + 1}`,
    name,
    email,
    password: hashedPassword,
    role: "user",
  }
  users.push(newUser)
  return newUser
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUser(credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
