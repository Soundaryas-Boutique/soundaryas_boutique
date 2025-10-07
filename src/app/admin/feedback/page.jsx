"use client";
import Link from "next/link";

export default function FeedbackPage() {
  const feedbackOptions = [
    {
      title: "Complaints",
      description: "View and manage user complaints, with visual reports.",
      href: "/admin/feedback/complaints",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Product Reviews",
      description: "See what customers think about your products.",
      href: "/admin/feedback/reviews",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Suggestions",
      description: "Explore ideas users share to improve your boutique.",
      href: "/admin/feedback/suggestions",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Newsletter Subscribers",
      description: "Manage newsletter subscriptions and campaigns.",
      href: "/admin/feedback/newsletter",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Appointmet",
      description: "Veiw your sppointmets in detail here.",
      href: "/admin/feedback/appointment",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Feedback Overview</h1>
      <p className="mb-8 text-gray-700">
        Choose a category to explore customer feedback and insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbackOptions.map((item) => (
          <Link key={item.title} href={item.href}>
            <div
              className={`p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1 ${item.color}`}
            >
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
