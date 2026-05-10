export type MetricSeverity = "neutral" | "yellow" | "red";

export function returnsSeverity(returnRate: number): MetricSeverity {
  if (returnRate > 0.2) return "red";
  if (returnRate > 0.15) return "yellow";
  return "neutral";
}

export function ticketsSeverity(tickets: number): MetricSeverity {
  if (tickets > 5) return "red";
  if (tickets > 2) return "yellow";
  return "neutral";
}

export function ratingSeverity(rating: number): MetricSeverity {
  if (rating < 3.5) return "red";
  if (rating < 4) return "yellow";
  return "neutral";
}

export function riskSeverity(riskScore: number): MetricSeverity {
  if (riskScore >= 55) return "red";
  if (riskScore >= 35) return "yellow";
  return "neutral";
}

export function severityDotClass(severity: MetricSeverity): string {
  if (severity === "red") return "bg-red-600";
  if (severity === "yellow") return "bg-amber-400";
  return "bg-black/20";
}

export function severityBarClass(severity: MetricSeverity): string {
  if (severity === "red") return "bg-red-600";
  if (severity === "yellow") return "bg-amber-400";
  return "bg-charcoal";
}

export function riskBarClass(severity: MetricSeverity): string {
  if (severity === "neutral") return "bg-emerald-600";
  return severityBarClass(severity);
}

export function riskDotClass(severity: MetricSeverity): string {
  if (severity === "neutral") return "bg-emerald-600";
  return severityDotClass(severity);
}

export function riskTextClass(severity: MetricSeverity): string {
  if (severity === "neutral") return "text-emerald-700";
  return severityTextClass(severity);
}

export function severityTextClass(severity: MetricSeverity): string {
  if (severity === "red") return "text-red-700";
  if (severity === "yellow") return "text-amber-700";
  return "text-charcoal";
}
