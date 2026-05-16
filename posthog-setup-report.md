<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of FashionHero. PostHog was already substantially instrumented; the wizard verified and confirmed the existing setup, refreshed environment variable values, added three new capture calls covering missing funnel steps, and built an "Analytics basics" dashboard with five insights.

## Infrastructure (verified correct)

| File | Purpose |
|---|---|
| `instrumentation-client.ts` | Client-side PostHog init via `posthog-js`, reverse proxy at `/ingest`, EU host, exception capture enabled |
| `next.config.ts` | Rewrites for `/ingest/static/*`, `/ingest/array/*`, `/ingest/*` → EU PostHog endpoints |
| `src/lib/posthog-server.ts` | Server-side `posthog-node` singleton (`getPostHogClient()`) |
| `.env.local` | `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` written with correct values |

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Buyer signed in (with `posthog.identify`) | `src/app/account/login/page.tsx` |
| `user_registered` | Buyer registered (with `posthog.identify`) | `src/app/account/register/page.tsx` |
| `product_added_to_cart` | Product added to cart with SKU details | `src/components/product-info.tsx` |
| `product_wishlisted` | Product wishlisted or un-wishlisted | `src/components/wishlist-button.tsx` |
| `search_performed` | Search submitted with query and result count | `src/components/search-modal.tsx` |
| `checkout_initiated` | Place Order button clicked on checkout page | `src/app/checkout/page.tsx` |
| `seller_signed_in` | Seller signed in (with `posthog.identify`) | `src/components/seller-analytics/seller-login-form.tsx` |
| `seller_signed_out` | Seller signed out (with `posthog.reset`) | `src/components/seller-analytics/seller-dashboard.tsx`, `seller-sku-detail.tsx` |
| `seller_sku_sort_changed` | Seller changed SKU sort order | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_top_risk_sku_clicked` | **Added** — Seller clicked the top-risk SKU alert | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_sku_viewed` | Seller viewed a SKU detail page | `src/components/seller-analytics/seller-sku-detail.tsx` |
| `seller_pro_plus_banner_clicked` | Seller clicked the Pro+ banner CTA | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_pro_plus_waitlist_joined` | Seller joined the Pro+ waitlist | `src/components/seller-analytics/seller-pro-plus-page.tsx` |
| `cart_checkout_clicked` | **Added** — User clicked CHECKOUT in cart drawer | `src/components/cart-drawer.tsx` |
| `product_quick_view_opened` | **Added** — User opened quick-view modal for a product | `src/components/product-card.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/685462)
- [Buyer checkout funnel](/insights/fdILJLLv) — add-to-cart → clicked checkout → placed order
- [New user registrations & sign-ins](/insights/Uh7C62ol) — daily trend of buyer auth events
- [Seller analytics flow funnel](/insights/iLIRFjSg) — seller sign-in → top-risk SKU click → SKU detail
- [Product engagement signals](/insights/OQtaZy7w) — add-to-cart, wishlist, and quick-view trends
- [Seller Pro+ waitlist conversion](/insights/Ljo1IYLg) — Pro+ banner click → waitlist joined

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
