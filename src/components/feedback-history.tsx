"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Calendar, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Feedback } from "@/lib/db-models"

interface FeedbackHistoryProps {
  userId: string
}

export function FeedbackHistory({ userId }: FeedbackHistoryProps) {
  const [feedbacks, setFeedbacks] = useState<(Feedback & { mealName: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/user/feedback")

        if (!response.ok) {
          throw new Error("Failed to fetch feedback")
        }

        const data = await response.json()

        // Fetch meal details for each feedback
        const feedbackWithMeals = await Promise.all(
          data.map(async (feedback: Feedback) => {
            try {
              const mealResponse = await fetch(`/api/meals/${feedback.mealId}`)
              if (mealResponse.ok) {
                const meal = await mealResponse.json()
                return { ...feedback, mealName: meal.name }
              }
              return { ...feedback, mealName: "Unknown Meal" }
            } catch (error) {
              return { ...feedback, mealName: "Unknown Meal" }
            }
          }),
        )

        setFeedbacks(feedbackWithMeals)
      } catch (error) {
        setError("Failed to load feedback history")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchFeedback()
    }
  }, [userId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-500">{error}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">You haven't provided any feedback yet.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/meals">View Today's Meals</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/meals/${feedback.mealId}`} className="font-medium hover:underline">
                    {feedback.mealName}
                  </Link>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>
                <Badge className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                  {feedback.rating}
                </Badge>
              </div>
              {feedback.comment && <p className="text-sm text-muted-foreground">{feedback.comment}</p>}
              <Separator />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/meals">Rate More Meals</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
