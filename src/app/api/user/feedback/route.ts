import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import type { Feedback } from "@/lib/db-models"

// Mock data for user feedback
const userFeedback: Feedback[] = [
  {
    id: "f1",
    userId: "2",
    mealId: "1",
    rating: 5,
    comment: "The scrambled eggs were perfectly cooked and the fruit was fresh. Great breakfast!",
    createdAt: "2025-04-26T08:30:00Z",
    likes: 3,
  },
  {
    id: "f4",
    userId: "2",
    mealId: "2",
    rating: 4,
    comment: "The salad was fresh and the chicken was well seasoned. Would have liked more dressing options.",
    createdAt: "2025-04-25T12:45:00Z",
    likes: 1,
  },
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Filter feedback for the current user
    const feedback = userFeedback.filter((item) => item.userId === session.user.id)

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Feedback fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
