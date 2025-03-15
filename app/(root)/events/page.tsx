// app/(public)/events/page.tsx
import { EventsList } from "@/components/public/EventsList";
import { Suspense } from "react";

export const metadata = {
  title: "Events | IslamicEvents",
  description: "Browse all upcoming Islamic events in your community",
};

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Upcoming Events</h1>

      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={<div className="text-center py-10">Loading events...</div>}
        >
          <EventsList />
        </Suspense>
      </div>
    </div>
  );
}
