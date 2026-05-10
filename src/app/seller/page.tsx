import type { Metadata } from "next";
import { SellerDashboard } from "@/components/seller-analytics/seller-dashboard";

export const metadata: Metadata = {
  title: "Seller Pro Analytics | FashionHero",
};

export default function SellerDashboardPage() {
  return <SellerDashboard />;
}
