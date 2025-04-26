"use client"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MealCardProps {
  meal: {
    id: string
    name: string
    date: string
    items: string[]
    image: string
    averageRating: number
    feedbackCount: number
  }
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className="flex items-center bg-white/90 text-black">
            <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
            {meal.averageRating.toFixed(1)} ({meal.feedbackCount})
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{meal.name}</CardTitle>
        <CardDescription>
          {meal.items.slice(0, 2).join(", ")}
          {meal.items.length > 2 && ` and ${meal.items.length - 2} more`}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link href={`/meals/${meal.id}`}>View Details & Rate</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
