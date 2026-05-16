"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { useSellerSession } from "@/components/seller-analytics/seller-auth";
import { SellerDashboardSkeleton } from "@/components/seller-analytics/seller-loading";
import posthog from "posthog-js";

const WAITLIST_KEY = "fashionhero_pro_plus_waitlist";

export function SellerProPlusPage() {
  const router = useRouter();
  const { session, loaded } = useSellerSession();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (loaded && !session) {
      router.replace("/seller/login");
    }
  }, [loaded, router, session]);

  useEffect(() => {
    if (session) {
      queueMicrotask(() => setEmail(session.email));
    }
  }, [session]);

  if (!loaded || !session) {
    return <SellerDashboardSkeleton />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    const entry = {
      email: normalizedEmail,
      sellerName: session?.sellerName ?? "Mock seller",
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(entry));
    posthog.capture("seller_pro_plus_waitlist_joined", {
      email: normalizedEmail,
      seller_name: entry.sellerName,
    });
    setSubmitted(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <Link
        href="/seller"
        className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-10"
      >
        <ArrowLeft className="size-3.5" />
        Dashboard
      </Link>

      <section className="border-y border-black/10 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="mb-5 flex size-11 items-center justify-center rounded-full bg-charcoal text-white">
              <Sparkles className="size-5" />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-2">
              Coming soon
            </p>
            <h1 className="text-4xl md:text-6xl font-light text-charcoal tracking-normal">
              Seller Pro+
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-warm-gray">
              Want to know what is likely to hurt margin before it shows up in weekly reports?
              Pro+ will add predictive SKU alerts, buyer-theme clustering, and deeper economics views.
            </p>
          </div>

          <div className="border-t border-black/10 pt-6 md:border-t-0 md:border-l md:pl-8">
            {submitted ? (
              <div>
                <CheckCircle2 className="size-8 text-emerald-700 mb-4" />
                <h2 className="text-2xl font-light text-charcoal mb-2">You&apos;re on the list.</h2>
                <p className="text-[13px] text-warm-gray">
                  We&apos;ll send Pro+ rollout updates to {email.trim().toLowerCase()}.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-light text-charcoal mb-2">Get rollout updates</h2>
                <p className="text-[13px] text-warm-gray mb-6">
                  Leave an email and we&apos;ll notify you when Pro+ is ready for seller testing.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="pro-plus-email"
                      className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-warm-gray" />
                      <input
                        id="pro-plus-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full border border-black/15 rounded py-2.5 pl-10 pr-3 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
                        placeholder="seller@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-cta w-full text-[12px]">
                    NOTIFY ME
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
