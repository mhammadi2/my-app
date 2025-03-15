// app/(public)/about/page.tsx
import Image from "next/image";

export const metadata = {
  title: "About Us | IslamicEvents",
  description:
    "Learn about our mission, vision, and the team behind IslamicEvents",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          About IslamicEvents
        </h1>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            IslamicEvents is dedicated to fostering spiritual growth, community
            engagement, and positive social impact through meaningful events and
            programs. We strive to create inclusive spaces where Muslims and the
            wider community can connect, learn, and grow together.
          </p>
          <p className="text-gray-600">
            Our platform makes it easy to discover, organize, and participate in
            Islamic events in your area. From educational seminars and
            charitable initiatives to cultural celebrations and family
            activities, we're committed to enriching lives through community
            engagement.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg text-emerald-700 mb-3">
                Unity
              </h3>
              <p className="text-gray-600 text-sm">
                Bringing together diverse communities through shared values and
                experiences
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg text-emerald-700 mb-3">
                Education
              </h3>
              <p className="text-gray-600 text-sm">
                Promoting knowledge, understanding, and personal growth
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg text-emerald-700 mb-3">
                Service
              </h3>
              <p className="text-gray-600 text-sm">
                Contributing positively to society through charitable work and
                community service
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <p className="text-gray-600 mb-8 text-center">
            We're a dedicated team of professionals passionate about serving the
            community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Team member placeholders - replace with actual team info */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4"></div>
                <h3 className="font-medium">Team Member {i}</h3>
                <p className="text-sm text-gray-600">Position</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
          <p className="text-gray-600 text-center mb-6">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
