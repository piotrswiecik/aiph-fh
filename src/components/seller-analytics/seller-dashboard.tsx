"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpDown,
  ArrowRight,
  Eye,
  LogOut,
  PackageCheck,
  Sparkles,
  Star,
  Ticket,
  TrendingDown,
} from "lucide-react";
import { getMockSellerAnalytics, sortSellerSkus } from "@/data/seller-analytics";
import posthog from "posthog-js";
import {
  clearSellerSession,
  useSellerSession,
} from "@/components/seller-analytics/seller-auth";
import { SellerDashboardSkeleton } from "@/components/seller-analytics/seller-loading";
import type {
  SellerAnalyticsSort,
  SellerAnalyticsStatus,
  SellerSkuAnalytics,
} from "@/types/seller-analytics";
import {
  TermTooltip,
  TooltipLabel,
  termFromLabel,
  tooltipDescriptions,
} from "@/components/seller-analytics/metric-tooltip";
import {
  type MetricSeverity,
  ratingSeverity,
  riskBarClass,
  riskDotClass,
  riskSeverity,
  riskTextClass,
  returnsSeverity,
  severityDotClass,
  severityTextClass,
  ticketsSeverity,
} from "@/components/seller-analytics/metric-severity";

const sortOptions: { value: SellerAnalyticsSort; label: string }[] = [
  { value: "risk", label: "Risk" },
  { value: "sales", label: "Sales" },
  { value: "returns", label: "Returns" },
  { value: "tickets", label: "Tickets" },
  { value: "exposure", label: "Exposure" },
];

function statusClass(status: SellerAnalyticsStatus): string {
  if (status === "Needs attention") return "bg-red-50 text-red-700 border-red-200";
  if (status === "Watch") return "bg-amber-50 text-amber-800 border-amber-200";
  if (status === "Super") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-white text-charcoal/70 border-black/10";
}

function rate(part: number, total: number): string {
  return `${Math.round((part / Math.max(total, 1)) * 100)}%`;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function Metric({
  label,
  value,
  subLabel,
  severity = "neutral",
}: {
  label: string;
  value: string;
  subLabel?: string;
  severity?: MetricSeverity;
}) {
  const term = termFromLabel(label);

  return (
    <div
      className="group/metric relative py-5 pr-4 md:border-r border-black/10 last:border-r-0"
      tabIndex={term ? 0 : undefined}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1">
        {label}
      </p>
      <p className={`inline-flex items-center gap-2 text-2xl font-light ${severityTextClass(severity)}`}>
        {severity !== "neutral" && <span className={`size-2 rounded-full ${severityDotClass(severity)}`} />}
        {value}
      </p>
      {subLabel && <p className="text-[12px] text-warm-gray mt-1">{subLabel}</p>}
      {term && (
        <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-48 rounded bg-charcoal px-3 py-2 text-left text-[11px] font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover/metric:opacity-100 group-focus/metric:opacity-100">
          {tooltipDescriptions[term]}
        </span>
      )}
    </div>
  );
}

function SkuRow({ sku }: { sku: SellerSkuAnalytics }) {
  const risk = riskSeverity(sku.riskScore);

  return (
    <Link
      href={`/seller/skus/${sku.sku}`}
      className="group grid gap-4 py-4 border-b border-black/10 transition-colors hover:bg-white/55 md:grid-cols-[64px_minmax(220px,1.2fr)_repeat(5,minmax(72px,0.55fr))_96px] md:items-center"
    >
      <Image
        src={sku.image}
        alt={sku.name}
        width={96}
        height={96}
        className="size-16 rounded object-cover bg-cream-light"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`border px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass(sku.status)}`}>
            {sku.status}
          </span>
          <span className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">
            {sku.sku}
          </span>
        </div>
        <p className="text-[14px] font-medium text-charcoal group-hover:underline underline-offset-4">
          {sku.name}
        </p>
        <p className="text-[12px] text-warm-gray capitalize">
          {sku.category} / {sku.colorName}
        </p>
      </div>

      <RowMetric label="Sales" value={String(sku.unitsSold)} />
      <RowMetric
        label="Returns"
        value={rate(sku.returnCount, sku.unitsSold)}
        severity={returnsSeverity(sku.returnCount / sku.unitsSold)}
      />
      <RowMetric
        label="Tickets"
        value={String(sku.supportTickets)}
        severity={ticketsSeverity(sku.supportTickets)}
      />
      <RowMetric
        label="Rating"
        value={sku.rating.toFixed(1)}
        severity={ratingSeverity(sku.rating)}
      />
      <RowMetric label="Exposure" value={`${sku.exposureScore}%`} />

      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] text-warm-gray">
            <TermTooltip term="risk">Risk</TermTooltip>
          </span>
          <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${riskTextClass(risk)}`}>
            <span className={`size-1.5 rounded-full ${riskDotClass(risk)}`} />
            {sku.riskScore}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${riskBarClass(risk)}`}
            style={{ width: `${sku.riskScore}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

function RowMetric({
  label,
  value,
  severity = "neutral",
}: {
  label: string;
  value: string;
  severity?: MetricSeverity;
}) {
  return (
    <div className="flex items-center justify-between md:block">
      <span className="text-[11px] text-warm-gray md:hidden">
        <TooltipLabel label={label} />
      </span>
      <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${severityTextClass(severity)}`}>
        {severity !== "neutral" && <span className={`size-1.5 rounded-full ${severityDotClass(severity)}`} />}
        {value}
      </span>
    </div>
  );
}

function ProPlusBanner() {
  return (
    <section className="mb-8 border-y border-black/10 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-charcoal text-white">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1">
              Seller Pro+
            </p>
            <h2 className="text-xl font-light text-charcoal">Want to know even more before issues grow?</h2>
            <p className="mt-1 max-w-2xl text-[13px] text-warm-gray">
              Pro+ will add earlier warnings, margin impact, and buyer-theme clustering for SKUs that need deeper review.
            </p>
          </div>
        </div>
        <Link
          href="/seller/pro-plus"
          className="btn-cta gap-2 self-start text-[11px] md:self-auto"
          onClick={() => posthog.capture("seller_pro_plus_banner_clicked")}
        >
          JOIN WAITLIST
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}

export function SellerDashboard() {
  const router = useRouter();
  const { session, loaded } = useSellerSession();
  const [sort, setSort] = useState<SellerAnalyticsSort>("risk");

  useEffect(() => {
    if (loaded && !session) {
      router.replace("/seller/login");
    }
  }, [loaded, router, session]);

  const analytics = useMemo(() => {
    if (!session) return null;
    return getMockSellerAnalytics(session.email);
  }, [session]);

  const sortedSkus = useMemo(() => {
    if (!analytics) return [];
    return sortSellerSkus(analytics.skus, sort);
  }, [analytics, sort]);

  if (!loaded || !session || !analytics) {
    return <SellerDashboardSkeleton />;
  }

  const totalSales = analytics.skus.reduce((sum, sku) => sum + sku.unitsSold, 0);
  const totalReturns = analytics.skus.reduce((sum, sku) => sum + sku.returnCount, 0);
  const totalTickets = analytics.skus.reduce((sum, sku) => sum + sku.supportTickets, 0);
  const highestRisk = analytics.skus[0];
  const averageExposure = average(analytics.skus.map((sku) => sku.exposureScore));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10">
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Seller Pro Analytics</span>
      </nav>

      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-2">
            {analytics.session.sellerName} / {analytics.session.email}
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-charcoal">
            Seller Pro Analytics
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            posthog.capture("seller_signed_out");
            posthog.reset();
            clearSellerSession();
            router.push("/seller/login");
          }}
          className="btn-cta-outline gap-2 text-[11px] self-start md:self-auto"
        >
          <LogOut className="size-3.5" />
          SIGN OUT
        </button>
      </header>

      <section className="grid grid-cols-2 gap-x-4 md:grid-cols-5 border-y border-black/10 mb-8">
        <Metric label="SKU count" value={String(analytics.skus.length)} subLabel="seller owned" />
        <Metric label="Sales" value={String(totalSales)} subLabel="last 6 months" />
        <Metric
          label="Returns"
          value={rate(totalReturns, totalSales)}
          subLabel={`${totalReturns} units`}
          severity={returnsSeverity(totalReturns / totalSales)}
        />
        <Metric
          label="Tickets"
          value={String(totalTickets)}
          subLabel="buyer support"
          severity={ticketsSeverity(totalTickets)}
        />
        <Metric label="Exposure" value={`${averageExposure}%`} subLabel="portfolio avg" />
      </section>

      {highestRisk && (
        <Link
          href={`/seller/skus/${highestRisk.sku}`}
          className="flex flex-col gap-4 border-b border-black/10 pb-6 mb-8 md:flex-row md:items-center md:justify-between"
          onClick={() =>
            posthog.capture("seller_top_risk_sku_clicked", {
              sku: highestRisk.sku,
              sku_name: highestRisk.name,
              risk_score: highestRisk.riskScore,
              status: highestRisk.status,
            })
          }
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-red-50 p-2 text-red-700">
              <AlertTriangle className="size-4" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1">
                Top <TermTooltip term="risk">risk</TermTooltip>
              </p>
              <h2 className="text-xl font-light text-charcoal">{highestRisk.name}</h2>
              <p className="text-[13px] text-warm-gray mt-1">{highestRisk.reasons[0]}</p>
            </div>
          </div>
          <span className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Review SKU
          </span>
        </Link>
      )}

      <ProPlusBanner />

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-light text-charcoal">SKU signals</h2>
            <p className="text-[12px] text-warm-gray mt-1">
              Sorted by{" "}
              <TermTooltip term={sort}>
                {sortOptions.find((option) => option.value === sort)?.label.toLowerCase()}
              </TermTooltip>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSort(option.value);
                  posthog.capture("seller_sku_sort_changed", { sort: option.value });
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.7px] transition-colors ${
                  sort === option.value
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-transparent text-charcoal border-black/15 hover:border-charcoal"
                }`}
              >
                <ArrowUpDown className="size-3" />
                <TermTooltip term={option.value}>{option.label}</TermTooltip>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-[64px_minmax(220px,1.2fr)_repeat(5,minmax(72px,0.55fr))_96px] gap-4 border-y border-black/10 py-3">
          <span />
          <span className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray">SKU</span>
          <HeaderMetric icon={<PackageCheck className="size-3" />} label="Sales" />
          <HeaderMetric icon={<TrendingDown className="size-3" />} label="Returns" />
          <HeaderMetric icon={<Ticket className="size-3" />} label="Tickets" />
          <HeaderMetric icon={<Star className="size-3" />} label="Rating" />
          <HeaderMetric icon={<Eye className="size-3" />} label="Exposure" />
          <HeaderMetric label="Risk" />
        </div>

        <div className="border-t border-black/10 md:border-t-0">
          {sortedSkus.map((sku) => (
            <SkuRow key={sku.sku} sku={sku} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HeaderMetric({ icon, label }: { icon?: React.ReactNode; label: string }) {
  const term = termFromLabel(label);

  return (
    <span
      className="group/header-tooltip relative flex h-full w-full items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray"
      tabIndex={term ? 0 : undefined}
    >
      {icon}
      {label}
      {term && (
        <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-48 rounded bg-charcoal px-3 py-2 text-left text-[11px] font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover/header-tooltip:opacity-100 group-focus/header-tooltip:opacity-100">
          {tooltipDescriptions[term]}
        </span>
      )}
    </span>
  );
}
