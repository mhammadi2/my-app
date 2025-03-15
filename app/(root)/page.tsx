"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselIndicators } from "@/components/ui/carousel-indicators";
// import { EventsList } from "@/components/public/EventsList";

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();

  const testimonials = [
    {
      quote:
        "This platform has been invaluable for connecting with my local Muslim community and finding events that enrich my spiritual journey.",
      author: "Sarah A.",
      role: "Community Member",
    },
    {
      quote:
        "I've been able to organize multiple successful events thanks to this platform. It's made outreach so much simpler.",
      author: "Ahmed M.",
      role: "Event Organizer",
    },
    {
      quote:
        "The donation process is seamless, and I love knowing my contributions directly support meaningful community initiatives.",
      author: "Fatima K.",
      role: "Monthly Donor",
    },
  ];

  return (
    <div>
      {/* Hero Section with Enhanced Background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-300">
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="pattern"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
            Connect With Your Community
          </h1>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
            Discover and participate in Islamic events happening in your area.
            Build connections, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Browse Events
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-emerald-600/20"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Community Says
          </h2>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-2/3">
                  <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <div className="mb-4">
                      <svg
                        className="w-8 h-8 text-emerald-500 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-emerald-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 lg:-left-12" />
            <CarouselNext className="right-2 lg:-right-12" />
            <div className="mt-6">
              <CarouselIndicators api={api} className="static" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join these upcoming events in your community. Connect with others
            and enrich your spiritual journey.
          </p>
        </div>

        {/* <EventsList /> */}
        {/* Placeholder for events */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-emerald-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-medium text-emerald-600 mb-1">
                  Jun 15, 2025 • 7:00 PM
                </div>
                <h3 className="font-semibold mb-2">Event Title {item}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Event location • By Organizer Name
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      </section>

      {/* Call to Action with Enhanced Styling */}
      <section className="relative bg-gradient-to-r from-emerald-700 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Involved Today
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Whether you're looking to attend events, volunteer, or donate, there
            are many ways to be part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Make a Donation
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-emerald-600/20"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border-4 border-white"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full border-4 border-white"></div>
        </div>
      </section>
    </div>
  );
}
