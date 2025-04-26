"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight, Utensils } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { MealCard } from "@/components/meal-card"
import { UserNav } from "@/components/user-nav"

// Mock data for meals
const meals = [
  {
    id: "1",
    name: "Breakfast",
    date: "2025-04-26",
    items: ["Scrambled Eggs", "Toast", "Fresh Fruit", "Coffee/Tea"],
    image: "/breakfast.jpeg?height=200&width=300",
    averageRating: 4.2,
    feedbackCount: 28,
  },
  {
    id: "2",
    name: "Lunch",
    date: "2025-04-26",
    items: ["Grilled Chicken Salad", "Soup of the Day", "Whole Grain Roll", "Iced Tea"],
    image: "/lunch.jpeg?height=200&width=300",
    averageRating: 4.5,
    feedbackCount: 32,
  },
  {
    id: "3",
    name: "Dinner",
    date: "2025-04-26",
    items: ["Pasta Primavera", "Garlic Bread", "Caesar Salad", "Chocolate Cake"],
    image: "/dinner.jpg?height=200&width=300",
    averageRating: 3.8,
    feedbackCount: 15,
  },
]

export default function MealsPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
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
            Today's Meals
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Today's Meals</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Day</span>
            </Button>
            <div className="flex items-center px-3 py-1 rounded-md border">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{formatDate(currentDate)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Day</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
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
