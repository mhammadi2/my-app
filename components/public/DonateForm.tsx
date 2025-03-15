"use client";

import { useState } from "react";

export function DonateForm() {
  // Handle form inputs using client-side state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  // Optional: Manage loading or error states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // IMPLEMENT: Replace with real payment or donation service logic
    // e.g., sending data to an API route or 3rd party payment gateway.

    try {
      // Mocking an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Thank you for your donation!");
    } catch (error: any) {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-5"
    >
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block font-semibold mb-1">
          Donation Amount ($USD)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          required
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>
      </div>

      {message && (
        <div className="text-center mt-3 text-green-600 font-medium">
          {message}
        </div>
      )}
    </form>
  );
}
