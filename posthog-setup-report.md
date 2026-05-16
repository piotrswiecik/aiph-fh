<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the FashionHero Shop project. The integration covers both the buyer-facing shop and the seller analytics POC, tracking the full user journeys for both personas.

## What was added

- **`instrumentation-client.ts`** — initializes `posthog-js` on the client side for all pages, with EU host routing through a reverse proxy, exception capture enabled, and debug mode in development.
- **`src/lib/posthog-server.ts`** — singleton `posthog-node` client for server-side event capture.
- **`next.config.ts`** — added `/ingest/*` rewrites that proxy PostHog requests through the Next.js server to `eu.i.posthog.com`, reducing ad-blocker interference.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set to the project's EU credentials.
- **12 events** instrumented across 8 files, covering buyer login/register, cart, checkout, wishlist, search, and the full seller analytics flow (login, SKU browse, sort, Pro+ interest).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Buyer signed in to their account | `src/app/account/login/page.tsx` |
| `user_registered` | Buyer created a new account | `src/app/account/register/page.tsx` |
| `product_added_to_cart` | Buyer added a product to the cart | `src/components/product-info.tsx` |
| `product_wishlisted` | Buyer toggled wishlist on a product (added/removed) | `src/components/wishlist-button.tsx` |
| `checkout_initiated` | Buyer clicked Place Order on the checkout page | `src/app/checkout/page.tsx` |
| `search_performed` | Buyer submitted a search query (Enter key) | `src/components/search-modal.tsx` |
| `seller_signed_in` | Seller submitted the mock login form | `src/components/seller-analytics/seller-login-form.tsx` |
| `seller_signed_out` | Seller clicked Sign Out | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_sku_sort_changed` | Seller changed SKU signals sort order | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_sku_viewed` | Seller opened a SKU detail page | `src/components/seller-analytics/seller-sku-detail.tsx` |
| `seller_pro_plus_banner_clicked` | Seller clicked the Pro+ Join Waitlist CTA | `src/components/seller-analytics/seller-dashboard.tsx` |
| `seller_pro_plus_waitlist_joined` | Seller submitted the Pro+ waitlist form | `src/components/seller-analytics/seller-pro-plus-page.tsx` |

## User identification

- Buyer login and registration call `posthog.identify(email, { email, ... })` immediately after successful auth.
- Seller login calls `posthog.identify(email, { email, seller_name, role: "seller" })`.
- Sign-out buttons call `posthog.reset()` to disassociate the session from the identified user.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/685297)
- [Buyer purchase funnel](/insights/OSUaNVEP) — conversion from sign-in → add-to-cart → checkout
- [Seller analytics funnel](/insights/0MNVmQIb) — seller sign-in → SKU viewed → Pro+ waitlist joined
- [Cart & checkout activity](/insights/5Luxomg3) — daily trend of add-to-cart and checkout events
- [Wishlist engagement](/insights/lF6zHFKQ) — daily trend of wishlist toggles
- [Seller Pro+ interest](/insights/VztTjSDt) — Pro+ banner clicks vs waitlist joins

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
