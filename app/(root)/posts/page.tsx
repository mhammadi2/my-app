// app/(public)/posts/page.tsx
import { PostsList } from "@/components/public/PostsList";
import { Suspense } from "react";

export const metadata = {
  title: "Blog | IslamicEvents",
  description: "Latest articles, news, and insights from the Islamic community",
};

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Blog</h1>

      <div className="max-w-5xl mx-auto">
        <Suspense
          fallback={<div className="text-center py-10">Loading posts...</div>}
        >
          <PostsList />
        </Suspense>
      </div>
    </div>
  );
}
