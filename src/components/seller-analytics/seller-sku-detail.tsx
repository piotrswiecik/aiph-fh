"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  LogOut,
  MessageSquare,
  PackageCheck,
  Star,
  TrendingDown,
} from "lucide-react";
import { getMockSellerAnalytics } from "@/data/seller-analytics";
import {
  clearSellerSession,
  useSellerSession,
} from "@/components/seller-analytics/seller-auth";
import { SellerDashboardSkeleton } from "@/components/seller-analytics/seller-loading";
import type {
  SellerAnalyticsStatus,
  SellerSkuAnalytics,
  SkuTrendPoint,
} from "@/types/seller-analytics";
import {
  TermTooltip,
  termFromLabel,
  tooltipDescriptions,
} from "@/components/seller-analytics/metric-tooltip";
import {
  type MetricSeverity,
  ratingSeverity,
  returnsSeverity,
  severityDotClass,
  severityTextClass,
  ticketsSeverity,
} from "@/components/seller-analytics/metric-severity";

function statusClass(status: SellerAnalyticsStatus): string {
  if (status === "Needs attention") return "bg-red-50 text-red-700 border-red-200";
  if (status === "Watch") return "bg-amber-50 text-amber-800 border-amber-200";
  if (status === "Super") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-white text-charcoal/70 border-black/10";
}

function rate(part: number, total: number): string {
  return `${Math.round((part / Math.max(total, 1)) * 100)}%`;
}

function DetailMetric({
  label,
  value,
  icon,
  severity = "neutral",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  severity?: MetricSeverity;
}) {
  const term = termFromLabel(label);

  return (
    <div
      className="group/detail-metric relative py-5 pr-4 md:border-r border-black/10 last:border-r-0"
      tabIndex={term ? 0 : undefined}
    >
      <div className="flex items-center gap-2 text-warm-gray mb-2">
        {icon}
        <p className="text-[11px] font-medium uppercase tracking-[0.8px]">{label}</p>
      </div>
      <p className={`inline-flex items-center gap-2 text-2xl font-light ${severityTextClass(severity)}`}>
        {severity !== "neutral" && <span className={`size-2 rounded-full ${severityDotClass(severity)}`} />}
        {value}
      </p>
      {term && (
        <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-48 rounded bg-charcoal px-3 py-2 text-left text-[11px] font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover/detail-metric:opacity-100 group-focus/detail-metric:opacity-100">
          {tooltipDescriptions[term]}
        </span>
      )}
    </div>
  );
}

function TrendRows({ trend }: { trend: SkuTrendPoint[] }) {
  const maxSales = Math.max(...trend.map((point) => point.sales), 1);

  return (
    <div className="space-y-4">
      {trend.map((point) => (
        <div key={point.label} className="grid grid-cols-[40px_1fr] gap-4 items-center">
          <span className="text-[12px] text-warm-gray">{point.label}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 rounded-full bg-black/10 flex-1 overflow-hidden">
                <div
                  className="h-full rounded-full bg-charcoal"
                  style={{ width: `${Math.max(8, (point.sales / maxSales) * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right text-[12px] text-charcoal">{point.sales}</span>
            </div>
            <div className="flex gap-3 text-[11px] text-warm-gray">
              <TrendDataPoint
                label="returns"
                value={point.returns}
                severity={returnsSeverity(point.returns / point.sales)}
              />
              <TrendDataPoint
                label="tickets"
                value={point.tickets}
                severity={ticketsSeverity(point.tickets)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendDataPoint({
  label,
  value,
  severity,
}: {
  label: string;
  value: number;
  severity: MetricSeverity;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${severityTextClass(severity)}`}>
      {severity !== "neutral" && <span className={`size-1.5 rounded-full ${severityDotClass(severity)}`} />}
      {value} {label}
    </span>
  );
}

function ExposureRow({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] text-charcoal">{label}</span>
        <span className="text-[12px] font-medium text-charcoal">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full rounded-full bg-charcoal" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1.5 text-[11px] text-warm-gray">{description}</p>
    </div>
  );
}

function MissingSku() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
      <Link
        href="/seller"
        className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-8"
      >
        <ArrowLeft className="size-3.5" />
        Back to dashboard
      </Link>
      <h1 className="text-3xl font-light text-charcoal mb-3">SKU unavailable</h1>
      <p className="text-[13px] text-warm-gray">
        This SKU is not in the signed-in seller portfolio.
      </p>
    </div>
  );
}

export function SellerSkuDetail({ skuId }: { skuId: string }) {
  const router = useRouter();
  const { session, loaded } = useSellerSession();

  useEffect(() => {
    if (loaded && !session) {
      router.replace("/seller/login");
    }
  }, [loaded, router, session]);

  const analytics = useMemo(() => {
    if (!session) return null;
    return getMockSellerAnalytics(session.email);
  }, [session]);

  const sku = useMemo<SellerSkuAnalytics | undefined>(() => {
    return analytics?.skus.find((item) => item.sku === skuId);
  }, [analytics, skuId]);

  if (!loaded || !session || !analytics) {
    return <SellerDashboardSkeleton />;
  }

  if (!sku) {
    return <MissingSku />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/seller"
          className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => {
            clearSellerSession();
            router.push("/seller/login");
          }}
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray hover:text-charcoal transition-colors"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>

      <header className="grid gap-6 md:grid-cols-[220px_1fr] md:items-end mb-8">
        <Image
          src={sku.image}
          alt={sku.name}
          width={440}
          height={440}
          className="w-full max-w-[220px] aspect-square rounded object-cover bg-cream-light"
        />
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`border px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass(sku.status)}`}>
              {sku.status}
            </span>
            <span className="text-[11px] uppercase tracking-[0.8px] text-warm-gray">
              {analytics.session.sellerName} / {sku.sku}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-charcoal mb-3">{sku.name}</h1>
          <p className="text-[14px] text-warm-gray max-w-2xl">
            {sku.reasons[0]}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-x-4 md:grid-cols-5 border-y border-black/10 mb-10">
        <DetailMetric
          label="Sales"
          value={String(sku.unitsSold)}
          icon={<PackageCheck className="size-3.5" />}
        />
        <DetailMetric
          label="Returns"
          value={rate(sku.returnCount, sku.unitsSold)}
          icon={<TrendingDown className="size-3.5" />}
          severity={returnsSeverity(sku.returnCount / sku.unitsSold)}
        />
        <DetailMetric
          label="Tickets"
          value={String(sku.supportTickets)}
          icon={<MessageSquare className="size-3.5" />}
          severity={ticketsSeverity(sku.supportTickets)}
        />
        <DetailMetric
          label="Rating"
          value={sku.rating.toFixed(1)}
          icon={<Star className="size-3.5" />}
          severity={ratingSeverity(sku.rating)}
        />
        <DetailMetric
          label="Exposure"
          value={`${sku.exposureScore}%`}
          icon={<Eye className="size-3.5" />}
        />
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <section>
          <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-3 mb-5">
            <div>
              <h2 className="text-2xl font-light text-charcoal">Trend</h2>
              <p className="text-[12px] text-warm-gray mt-1">
                <TermTooltip term="sales">Sales</TermTooltip>,{" "}
                <TermTooltip term="returns">returns</TermTooltip>, and{" "}
                <TermTooltip term="tickets">tickets</TermTooltip> by month.
              </p>
            </div>
            <span className="text-[12px] font-medium text-charcoal">
              <TermTooltip term="risk">Risk</TermTooltip> {sku.riskScore}
            </span>
          </div>
          <TrendRows trend={sku.trend} />
        </section>

        <section>
          <h2 className="text-2xl font-light text-charcoal border-b border-black/10 pb-3 mb-5">
            <TermTooltip term="exposure">Exposure</TermTooltip> quality
          </h2>
          <div className="space-y-4">
            <ExposureRow
              label="Copy"
              value={sku.exposureBreakdown.copy}
              description="How clearly the listing explains fit, material, care, and buyer expectations."
            />
            <ExposureRow
              label="Photos"
              value={sku.exposureBreakdown.photos}
              description="How well the image set shows the product, details, and primary use context."
            />
            <ExposureRow
              label="Variants"
              value={sku.exposureBreakdown.variants}
              description="How complete the available color and style options are for this SKU."
            />
            <ExposureRow
              label="Size coverage"
              value={sku.exposureBreakdown.sizeCoverage}
              description="How well available sizes cover expected buyer demand."
            />
          </div>
        </section>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] mt-12">
        <section>
          <h2 className="text-2xl font-light text-charcoal border-b border-black/10 pb-3 mb-5">
            Why it matters
          </h2>
          <div className="space-y-3">
            {sku.reasons.map((reason) => (
              <div key={reason} className="flex gap-3 text-[13px] text-charcoal/80">
                <CheckCircle2 className="size-4 mt-0.5 text-charcoal shrink-0" />
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-light text-charcoal border-b border-black/10 pb-3 mb-5">
            Recommended actions
          </h2>
          <div className="space-y-3">
            {sku.recommendedActions.map((action, index) => (
              <div key={action} className="grid grid-cols-[24px_1fr] gap-3 text-[13px] text-charcoal/80">
                <span className="size-6 rounded-full bg-charcoal text-white text-[11px] flex items-center justify-center">
                  {index + 1}
                </span>
                <p>{action}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
