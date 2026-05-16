"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createMockSellerSession } from "@/data/seller-analytics";
import { saveSellerSession } from "@/components/seller-analytics/seller-auth";
import posthog from "posthog-js";

export function SellerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter any email and password to open a mock seller account.");
      return;
    }

    const session = createMockSellerSession(email);
    saveSellerSession(session);
    posthog.identify(email, { email, seller_name: session.sellerName, role: "seller" });
    posthog.capture("seller_signed_in", { email, seller_name: session.sellerName });
    router.push("/seller");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Seller Sign In</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2 text-center">
        Seller Pro Analytics
      </h1>
      <p className="text-[13px] text-warm-gray mb-8 text-center">
        Use any test email and password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-600 text-[13px] text-center">{error}</p>}

        <div>
          <label
            htmlFor="seller-email"
            className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
          >
            Email
          </label>
          <input
            id="seller-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            placeholder="seller@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="seller-password"
            className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
          >
            Password
          </label>
          <input
            id="seller-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            placeholder="Enter any password"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-cta w-full text-[12px]">
          SIGN IN
        </button>
      </form>
    </div>
  );
}
