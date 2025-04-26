"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Calendar, MessageSquare, Star, ThumbsUp, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FeedbackForm } from "@/components/feedback-form"
import { UserNav } from "@/components/user-nav"

// Mock data for a meal
const meal = {
  id: "1",
  name: "Breakfast",
  date: "2025-04-26",
  items: ["Scrambled Eggs", "Toast", "Fresh Fruit", "Coffee/Tea"],
  image: "/placeholder.svg?height=400&width=600",
  description:
    "Start your day with our nutritious breakfast. Our eggs are locally sourced and the bread is freshly baked each morning. Served with a selection of seasonal fruits.",
  averageRating: 4.2,
  feedbackCount: 28,
  nutritionalInfo: {
    calories: 450,
    protein: "15g",
    carbs: "55g",
    fat: "18g",
  },
}

// Mock data for feedback
const feedbacks = [
  {
    id: "f1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder-user.jpg",
    rating: 5,
    comment: "The scrambled eggs were perfectly cooked and the fruit was fresh. Great breakfast!",
    createdAt: "2025-04-26T08:30:00Z",
    likes: 3,
  },
  {
    id: "f2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder-user.jpg",
    rating: 4,
    comment: "I enjoyed the breakfast, but would have liked more options for the hot drinks.",
    createdAt: "2025-04-26T09:15:00Z",
    likes: 1,
  },
  {
    id: "f3",
    userId: "user3",
    userName: "Alex Johnson",
    userAvatar: "/placeholder-user.jpg",
    rating: 3,
    comment: "The toast was a bit too crispy for my taste, but everything else was good.",
    createdAt: "2025-04-26T07:45:00Z",
    likes: 0,
  },
]

export default function MealDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState(feedbacks)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!session?.user) return

    const newFeedback = {
      id: `f${feedbackList.length + 1}`,
      userId: session.user.id,
      mealId: params.id,
      userName: session.user.name || "Anonymous",
      userAvatar: session.user.image || "/placeholder-user.jpg",
      rating,
      comment,
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    // In a real app, this would be an API call to save the feedback
    // For now, we'll just update the local state
    setFeedbackList([newFeedback, ...feedbackList])

    try {
      // Simulate API call to save feedback
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Feedback saved:", newFeedback)
    } catch (error) {
      console.error("Error saving feedback:", error)
    }
  }

  const handleLike = (feedbackId: string) => {
    setFeedbackList(
      feedbackList.map((feedback) =>
        feedback.id === feedbackId ? { ...feedback, likes: feedback.likes + 1 } : feedback,
      ),
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Utensils className="h-6 w-6 mr-2" />
          <span className="font-bold">MealFeedback</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/meals">
            Today&apos;s Meals
          </Link>
          {session?.user.role === "admin" && (
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
          )}
          <UserNav />
        </nav>
      </header>
      <main className="flex-1 container py-6 md:py-12 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meals
        </Button>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{meal.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(meal.date)}
                    </CardDescription>
                  </div>
                  <Badge className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {meal.averageRating.toFixed(1)} ({meal.feedbackCount})
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{meal.description}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Menu Items</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {meal.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Nutritional Information</h3>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                      <span className="text-muted-foreground">Calories</span>
                      <span className="font-medium">{meal.nutritionalInfo.calories}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                      <span className="text-muted-foreground">Protein</span>
                      <span className="font-medium">{meal.nutritionalInfo.protein}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                      <span className="text-muted-foreground">Carbs</span>
                      <span className="font-medium">{meal.nutritionalInfo.carbs}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-muted">
                      <span className="text-muted-foreground">Fat</span>
                      <span className="font-medium">{meal.nutritionalInfo.fat}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>Share your thoughts about this meal</CardDescription>
              </CardHeader>
              <CardContent>
                {session ? (
                  <FeedbackForm onSubmit={handleFeedbackSubmit} />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Please log in to submit feedback</p>
                    <Button asChild>
                      <Link href={`/login?callbackUrl=${encodeURIComponent(`/meals/${params.id}`)}`}>
                        Login to Submit Feedback
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Feedback</CardTitle>
                  <Badge variant="outline" className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {feedbackList.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackList.map((feedback) => (
                    <div key={feedback.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={feedback.userAvatar || "/placeholder.svg"} alt={feedback.userName} />
                            <AvatarFallback>{feedback.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{feedback.userName}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(feedback.createdAt)} at {formatTime(feedback.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center bg-muted rounded-full px-2 py-1">
                            <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                            <span className="text-xs font-medium">{feedback.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm">{feedback.comment}</p>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleLike(feedback.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {feedback.likes > 0 ? feedback.likes : "Like"}
                        </Button>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 MealFeedback. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
