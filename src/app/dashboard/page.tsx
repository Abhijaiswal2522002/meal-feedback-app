"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronLeft, ChevronRight, Download, Utensils, Star } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FeedbackChart } from "@/components/feedback-chart"
import { MealRatingsChart } from "@/components/meal-ratings-chart"
import { FeedbackTrendChart } from "@/components/feedback-trend-chart"
import { UserNav } from "@/components/user-nav"

// Mock data for dashboard stats
const stats = [
  {
    title: "Total Feedback",
    value: "1,284",
    change: "+12.5%",
    changeType: "positive",
  },
  {
    title: "Average Rating",
    value: "4.2",
    change: "+0.3",
    changeType: "positive",
  },
  {
    title: "Participation Rate",
    value: "68%",
    change: "-2.1%",
    changeType: "negative",
  },
  {
    title: "New Users",
    value: "38",
    change: "+5",
    changeType: "positive",
  },
]

// Mock data for recent feedback
const recentFeedback = [
  {
    id: "f1",
    mealName: "Breakfast",
    userName: "John Doe",
    userAvatar: "/placeholder-user.jpg",
    rating: 5,
    comment: "The scrambled eggs were perfectly cooked and the fruit was fresh. Great breakfast!",
    createdAt: "2025-04-26T08:30:00Z",
  },
  {
    id: "f2",
    mealName: "Lunch",
    userName: "Jane Smith",
    userAvatar: "/placeholder-user.jpg",
    rating: 4,
    comment: "I enjoyed the lunch, but would have liked more vegetarian options.",
    createdAt: "2025-04-26T13:15:00Z",
  },
  {
    id: "f3",
    mealName: "Dinner",
    userName: "Alex Johnson",
    userAvatar: "/placeholder-user.jpg",
    rating: 3,
    comment: "The pasta was a bit overcooked, but the salad was fresh and tasty.",
    createdAt: "2025-04-25T19:45:00Z",
  },
]

export default function DashboardPage() {
  const { data: session } = useSession({ required: true })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [dateRange, setDateRange] = useState("week")

  const formatDate = (date: Date) => {
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

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate)
    if (dateRange === "day") {
      newDate.setDate(currentDate.getDate() - 1)
    } else if (dateRange === "week") {
      newDate.setDate(currentDate.getDate() - 7)
    } else if (dateRange === "month") {
      newDate.setMonth(currentDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate)
    if (dateRange === "day") {
      newDate.setDate(currentDate.getDate() + 1)
    } else if (dateRange === "week") {
      newDate.setDate(currentDate.getDate() + 7)
    } else if (dateRange === "month") {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
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
            Today&apos;s Meals
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <UserNav />
        </nav>
      </header>
      <main className="flex-1 container py-6 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={goToPreviousPeriod}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Period</span>
            </Button>
            <div className="flex items-center px-3 py-1 rounded-md border">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{formatDate(currentDate)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={goToNextPeriod}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Period</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"} flex items-center mt-1`}
                >
                  {stat.changeType === "positive" ? "↑" : "↓"} {stat.change} from last {dateRange}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Distribution</CardTitle>
                  <CardDescription>Distribution of feedback ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <FeedbackChart />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Latest feedback from users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFeedback.map((feedback) => (
                      <div key={feedback.id} className="flex items-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={feedback.userAvatar || "/placeholder.svg"} alt={feedback.userName} />
                          <AvatarFallback>{feedback.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="font-medium">{feedback.userName}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{feedback.mealName}</span>
                            <div className="ml-2 flex items-center bg-muted rounded-full px-2 py-0.5">
                              <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                              <span className="text-xs font-medium">{feedback.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(new Date(feedback.createdAt))} at {formatTime(feedback.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Feedback
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="meals">
            <Card>
              <CardHeader>
                <CardTitle>Meal Ratings</CardTitle>
                <CardDescription>Average ratings for each meal type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <MealRatingsChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Trends</CardTitle>
                <CardDescription>Average ratings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <FeedbackTrendChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
