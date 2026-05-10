export type SellerAnalyticsSort = "risk" | "returns" | "tickets" | "exposure";

export type SellerAnalyticsStatus = "Needs attention" | "Watch" | "Stable" | "Super";

export interface MockSellerSession {
  email: string;
  sellerId: string;
  sellerName: string;
  seed: number;
}

export interface SkuTrendPoint {
  label: string;
  sales: number;
  returns: number;
  tickets: number;
}

export interface ExposureBreakdown {
  copy: number;
  photos: number;
  variants: number;
  sizeCoverage: number;
}

export interface SellerSkuAnalytics {
  sku: string;
  productId: string;
  productSlug: string;
  name: string;
  category: string;
  image: string;
  colorName: string;
  unitsSold: number;
  returnCount: number;
  supportTickets: number;
  rating: number;
  exposureScore: number;
  exposureBreakdown: ExposureBreakdown;
  riskScore: number;
  status: SellerAnalyticsStatus;
  reasons: string[];
  recommendedActions: string[];
  trend: SkuTrendPoint[];
}
