"use client";

import { useState } from "react";
import Link from "next/link";

export default function GenerateAdPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-20 px-6 flex items-center justify-center">
      <div

        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Generate Your Ad
        </h1>
        <p className="mt-3 text-center text-gray-600">
          Fill out a few quick details and your AI ad will be ready in 60 seconds 🚀
        </p>

        <form className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Café Aroma"
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Best coffee in town"
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a category</option>
              <option>Café / Restaurant</option>
              <option>Gym / Fitness</option>
              <option>Salon / Spa</option>
              <option>Retail / Clothing</option>
              <option>Other</option>
            </select>
          </div>

<Link
  href={{ pathname: "/ad-preview", query: formData }}
  className="block w-full mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 text-center font-semibold shadow-lg hover:opacity-90"
>
  Generate My Ad
</Link>

        </form>
      </div>
    </div>
  );
}
