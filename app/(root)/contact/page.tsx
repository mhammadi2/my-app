// app/(public)/contact/page.tsx
import { ContactForm } from "@/components/public/ContactForm";

export const metadata = {
  title: "Contact Us | IslamicEvents",
  description: "Get in touch with the IslamicEvents team",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-gray-600 text-center mb-10">
          Have questions or suggestions? We'd love to hear from you. Fill out
          the form below and we'll get back to you as soon as possible.
        </p>

        <ContactForm />

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium text-emerald-700 mb-2">Email</h3>
              <p className="text-gray-600">contact@islamicevents.org</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium text-emerald-700 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
