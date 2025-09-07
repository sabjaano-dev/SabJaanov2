// src/app/ad-preview/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AdPreviewContent() {
  const params = useSearchParams();
  const businessName = params.get("businessName") ?? "";
  const tagline = params.get("tagline") ?? "";
  const category = params.get("category") ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Preview Your Ad
        </h1>

        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {businessName || "Your Business"}
          </h2>
          <p className="italic text-gray-600 mb-2">
            {tagline || "Tagline goes here…"}
          </p>
          <p className="text-sm text-gray-500">Category: {category || "N/A"}</p>
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center">
            Estimated Reach: 8,500 customers/month
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            href={{ pathname: "/generate-ad", query: { businessName, tagline, category } }}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Edit
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-lg h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <AdPreviewContent />
    </Suspense>
  );
}
