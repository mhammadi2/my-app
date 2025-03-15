// components/public/EventCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

export function EventCard({ event }) {
  const {
    id,
    title,
    description,
    location,
    startDate,
    endDate,
    imageUrl,
    capacity,
    registered,
  } = event;

  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const isFullyBooked = registered >= capacity;
  const availableSpots = capacity - registered;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="bg-emerald-100 h-full w-full flex items-center justify-center text-emerald-800">
            <CalendarIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {formatDate(startDate)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <UsersIcon className="h-4 w-4 mr-1" />
          {isFullyBooked ? (
            <span className="text-red-500">Fully booked</span>
          ) : (
            <span>{availableSpots} spots available</span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/events/${id}`} className="w-full">
          <Button
            className="w-full"
            variant={isFullyBooked ? "outline" : "default"}
          >
            {isFullyBooked ? "View Details" : "Register Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
