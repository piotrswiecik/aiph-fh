import { products } from "@/data/products";
import { sellers } from "@/data/sellers";
import type {
  ExposureBreakdown,
  MockSellerSession,
  SellerAnalyticsSort,
  SellerAnalyticsStatus,
  SellerSkuAnalytics,
  SkuTrendPoint,
} from "@/types/seller-analytics";

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed: number) {
  let state = seed || 1;

  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(random: () => number, min: number, max: number, decimals = 1): number {
  const value = random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getStatus(riskScore: number): SellerAnalyticsStatus {
  if (riskScore >= 55) return "Needs attention";
  if (riskScore >= 35) return "Watch";
  if (riskScore >= 18) return "Stable";
  return "Super";
}

function formatSku(productId: string, index: number): string {
  return `FH-${productId.padStart(3, "0")}-${String(index + 1).padStart(2, "0")}`;
}

function buildReasons(sku: SellerSkuAnalytics): string[] {
  const returnRate = sku.returnCount / sku.unitsSold;
  const ticketRate = sku.supportTickets / sku.unitsSold;
  const reasons: string[] = [];

  if (returnRate >= 0.18) reasons.push("Return rate is materially above the seller portfolio.");
  if (ticketRate >= 0.08) reasons.push("Support tickets are clustering around this SKU.");
  if (sku.rating < 4.1) reasons.push("Buyer rating is dragging confidence below target.");
  if (sku.exposureScore < 76) reasons.push("Exposure quality is limiting pre-sale clarity.");

  if (reasons.length === 0) {
    reasons.push("Performance is inside the expected operating range.");
  }

  return reasons;
}

function buildRecommendedActions(sku: SellerSkuAnalytics): string[] {
  const actions: string[] = [];

  if (sku.returnCount / sku.unitsSold >= 0.18) {
    actions.push("Audit size guidance and return reasons before the next merchandising review.");
  }

  if (sku.supportTickets / sku.unitsSold >= 0.08) {
    actions.push("Add a support macro for the top buyer question and update the product FAQ.");
  }

  if (sku.exposureBreakdown.photos < 76) {
    actions.push("Add one detail image and one worn image for the primary colorway.");
  }

  if (sku.exposureBreakdown.copy < 76) {
    actions.push("Rewrite the first two description lines around fit, material, and care.");
  }

  if (sku.exposureBreakdown.variants < 76 || sku.exposureBreakdown.sizeCoverage < 76) {
    actions.push("Review variant and size coverage before increasing exposure.");
  }

  if (sku.rating < 4.1) {
    actions.push("Read the latest low-rating comments and tag the dominant quality theme.");
  }

  if (actions.length === 0) {
    actions.push("Keep monitoring weekly; no immediate corrective action is required.");
  }

  return actions.slice(0, 4);
}

function buildTrend(
  random: () => number,
  unitsSold: number,
  returnCount: number,
  supportTickets: number
): SkuTrendPoint[] {
  return months.map((label, index) => {
    const monthWeight = 0.72 + index * 0.08 + random() * 0.18;
    const sales = Math.max(4, Math.round((unitsSold / months.length) * monthWeight));
    const returns = Math.max(0, Math.round((returnCount / months.length) * (0.7 + random() * 0.6)));
    const tickets = Math.max(0, Math.round((supportTickets / months.length) * (0.7 + random() * 0.8)));

    return { label, sales, returns, tickets };
  });
}

function buildSkuAnalytics(emailSeed: number, productId: string, index: number): SellerSkuAnalytics | null {
  const product = products.find((item) => item.id === productId);
  if (!product) return null;

  const random = createRandom(hashString(`${emailSeed}:${product.id}:${product.slug}`));
  const baseUnits = product.badge === "bestseller" ? randomInt(random, 112, 190) : randomInt(random, 38, 156);
  const pressure = random();
  const returnRate = pressure > 0.72 ? randomFloat(random, 0.2, 0.34, 2) : randomFloat(random, 0.02, 0.18, 2);
  const ticketRate = pressure > 0.55 ? randomFloat(random, 0.07, 0.17, 2) : randomFloat(random, 0.01, 0.08, 2);
  const exposureBreakdown: ExposureBreakdown = {
    copy: randomInt(random, 62, 98),
    photos: randomInt(random, 58, 98),
    variants: randomInt(random, 64, 99),
    sizeCoverage: randomInt(random, 60, 99),
  };
  const exposureScore = Math.round(
    (exposureBreakdown.copy +
      exposureBreakdown.photos +
      exposureBreakdown.variants +
      exposureBreakdown.sizeCoverage) /
      4
  );
  const rating = clamp(randomFloat(random, product.rating || 3.7, 4.95, 1) - (pressure > 0.8 ? 0.5 : 0), 3.4, 5);
  const returnCount = Math.round(baseUnits * returnRate);
  const supportTickets = Math.round(baseUnits * ticketRate);
  const riskScore = clamp(
    Math.round(
      returnRate * 170 +
        ticketRate * 210 +
        (100 - exposureScore) * 0.36 +
        Math.max(0, 4.6 - rating) * 12
    ),
    4,
    99
  );

  const sku: SellerSkuAnalytics = {
    sku: formatSku(product.id, index),
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    category: product.productCategory,
    image: product.images[0] ?? product.colors[0]?.image ?? "",
    colorName: product.colors[0]?.name ?? "Primary",
    unitsSold: baseUnits,
    returnCount,
    supportTickets,
    rating,
    exposureScore,
    exposureBreakdown,
    riskScore,
    status: getStatus(riskScore),
    reasons: [],
    recommendedActions: [],
    trend: buildTrend(random, baseUnits, returnCount, supportTickets),
  };

  return {
    ...sku,
    reasons: buildReasons(sku),
    recommendedActions: buildRecommendedActions(sku),
  };
}

export function createMockSellerSession(email: string): MockSellerSession {
  const normalizedEmail = email.trim().toLowerCase();
  const seed = hashString(normalizedEmail);
  const seller = sellers[seed % sellers.length];

  return {
    email: normalizedEmail,
    sellerId: seller.id,
    sellerName: seller.name,
    seed,
  };
}

export function getMockSellerAnalytics(email: string): {
  session: MockSellerSession;
  skus: SellerSkuAnalytics[];
} {
  const session = createMockSellerSession(email);
  const ownedProducts = products.filter((product) => product.sellerId === session.sellerId);
  const skus = ownedProducts
    .map((product, index) => buildSkuAnalytics(session.seed, product.id, index))
    .filter((sku): sku is SellerSkuAnalytics => Boolean(sku))
    .sort((a, b) => b.riskScore - a.riskScore);

  return { session, skus };
}

export function sortSellerSkus(
  skus: SellerSkuAnalytics[],
  sort: SellerAnalyticsSort
): SellerSkuAnalytics[] {
  const sorted = [...skus];

  switch (sort) {
    case "returns":
      return sorted.sort((a, b) => b.returnCount / b.unitsSold - a.returnCount / a.unitsSold);
    case "tickets":
      return sorted.sort((a, b) => b.supportTickets / b.unitsSold - a.supportTickets / a.unitsSold);
    case "exposure":
      return sorted.sort((a, b) => a.exposureScore - b.exposureScore);
    case "risk":
    default:
      return sorted.sort((a, b) => b.riskScore - a.riskScore);
  }
}
