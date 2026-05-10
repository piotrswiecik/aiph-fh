import type { Metadata } from "next";
import { SellerLoginForm } from "@/components/seller-analytics/seller-login-form";

export const metadata: Metadata = {
  title: "Seller Sign In | FashionHero",
};

export default function SellerLoginPage() {
  return <SellerLoginForm />;
}
