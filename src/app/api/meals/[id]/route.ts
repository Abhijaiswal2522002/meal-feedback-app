import { NextResponse } from "next/server"
import type { Feedback } from "@/lib/db-models"

// Mock data for feedback
const feedbacks: Feedback[] = [
  {
    id: "f1",
    userId: "user1",
    mealId: "1",
    rating: 5,
    comment: "The scrambled eggs were perfectly cooked and the fruit was fresh. Great breakfast!",
    createdAt: "2025-04-26T08:30:00Z",
    likes: 3,
  },
  {
    id: "f2",
    userId: "user2",
    mealId: "1",
    rating: 4,
    comment: "I enjoyed the breakfast, but would have liked more options for the hot drinks.",
    createdAt: "2025-04-26T09:15:00Z",
    likes: 1,
  },
  {
    id: "f3",
    userId: "user3",
    mealId: "2",
    rating: 3,
    comment: "The soup was a bit too salty for my taste, but everything else was good.",
    createdAt: "2025-04-26T13:45:00Z",
    likes: 0,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const feedback = feedbacks.find((f) => f.id === params.id)

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  return NextResponse.json(feedback)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const index = feedbacks.findIndex((f) => f.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    // Update the feedback
    feedbacks[index] = {
      ...feedbacks[index],
      ...body,
    }

    return NextResponse.json(feedbacks[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = feedbacks.findIndex((f) => f.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  // Remove the feedback
  feedbacks.splice(index, 1)

  return NextResponse.json({ success: true })
}
