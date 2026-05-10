export type TooltipTerm = "sales" | "returns" | "tickets" | "rating" | "exposure" | "risk";

export const tooltipDescriptions: Record<TooltipTerm, string> = {
  sales: "Units sold for this SKU in the current reporting window.",
  returns: "Returned units as a share of sales, used to spot fit or quality issues.",
  tickets: "Buyer support requests linked to this SKU after purchase.",
  rating: "Average buyer rating for this SKU, from 1 to 5.",
  exposure: "How complete the SKU presentation is across copy, photos, variants, and sizes.",
  risk: "Combined signal showing which SKUs most need your attention first.",
};

export function termFromLabel(label: string): TooltipTerm | null {
  const normalized = label.toLowerCase();

  if (
    normalized === "sales" ||
    normalized === "returns" ||
    normalized === "tickets" ||
    normalized === "rating" ||
    normalized === "exposure" ||
    normalized === "risk"
  ) {
    return normalized;
  }

  return null;
}

export function TermTooltip({
  term,
  children,
}: {
  term: TooltipTerm;
  children: React.ReactNode;
}) {
  return (
    <span className="group/tooltip relative inline-flex cursor-help items-center underline-offset-4 hover:underline">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded bg-charcoal px-3 py-2 text-left text-[11px] font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100">
        {tooltipDescriptions[term]}
      </span>
    </span>
  );
}

export function TooltipLabel({ label }: { label: string }) {
  const term = termFromLabel(label);

  if (!term) return <>{label}</>;

  return <TermTooltip term={term}>{label}</TermTooltip>;
}
