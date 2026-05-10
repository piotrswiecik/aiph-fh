import type { Metadata } from "next";
import { SellerSkuDetail } from "@/components/seller-analytics/seller-sku-detail";

interface PageProps {
  params: Promise<{ sku: string }>;
}

export const metadata: Metadata = {
  title: "SKU Detail | FashionHero Seller Pro Analytics",
};

export default async function SellerSkuPage({ params }: PageProps) {
  const { sku } = await params;

  return <SellerSkuDetail skuId={decodeURIComponent(sku)} />;
}
