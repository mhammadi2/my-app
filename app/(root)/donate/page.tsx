// app/(public)/donate/page.tsx
import { DonateForm } from "@/components/public/DonateForm";

export const metadata = {
  title: "Donate | IslamicEvents",
  description: "Support our mission with your generous donation",
};

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Support Our Mission
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Your donation helps us organize community events, educational
          programs, and charitable initiatives. Every contribution makes a
          difference.
        </p>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Make a Donation
          </h2>
          <DonateForm />
        </div>

        <div className="bg-emerald-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            How Your Donation Helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-700 text-xl">📚</span>
              </div>
              <h3 className="font-medium mb-2">Education</h3>
              <p className="text-sm text-gray-600">
                Fund classes, workshops, and learning materials
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-700 text-xl">🤝</span>
              </div>
              <h3 className="font-medium mb-2">Community</h3>
              <p className="text-sm text-gray-600">
                Support events that bring people together
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-700 text-xl">🏥</span>
              </div>
              <h3 className="font-medium mb-2">Charity</h3>
              <p className="text-sm text-gray-600">
                Help those in need through our relief initiatives
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
