"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";

interface CarouselIndicatorsProps extends React.HTMLAttributes<HTMLDivElement> {
  api: CarouselApi | null;
}

export function CarouselIndicators({
  api,
  className,
  ...props
}: CarouselIndicatorsProps) {
  const [count, setCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  if (count <= 1) {
    return null;
  }

  return (
    <div className={cn("flex justify-center gap-1 mt-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-all",
            selectedIndex === i ? "bg-emerald-600 w-4" : "bg-emerald-200"
          )}
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
