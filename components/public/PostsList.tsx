// components/public/PostsList.tsx
// Notice we do NOT have "use client"; at the top.

import React from "react";

// Simulate a server-side data fetch (replace with your own API or DB call)
async function getPosts() {
  // Example: real-world scenario might involve fetching:
  // const res = await fetch("https://your-api-route/posts", { cache: "no-store" });
  // if (!res.ok) throw new Error("Failed to fetch posts");
  // return await res.json();

  // For this example, return a mock array:
  return [
    {
      id: 1,
      title: "First Post",
      excerpt: "This is the first post's excerpt",
    },
    {
      id: 2,
      title: "Second Post",
      excerpt: "This is the second post's excerpt",
    },
  ];
}

export async function PostsList() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="p-4 border border-gray-200 rounded hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
