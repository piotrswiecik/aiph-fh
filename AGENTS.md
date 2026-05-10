# FashionHero Seller Pro Analytics - Agent Instructions

You are working on a prototype branch of the existing FashionHero Next.js app.

Before coding, read:

1. `docs/seller-pro-analytics-project-config.md`
2. `docs/seller-pro-analytics-feature-spec.md`
3. `DESIGN.md`

## Goal

Build an internal POC of Seller Pro Analytics: an authenticated seller dashboard showing SKU-level signals for sales, returns, support tickets, buyer ratings, and exposure quality.

This is an interactive mock for usability testing, not production software.

## Scope

Build only the seller analytics flow:

- seller login/auth-gated dashboard
- seller-owned SKU list
- risk-oriented sorting
- SKU detail page
- recommended actions section
- loading skeletons

Do not build SKU creation, SKU editing, seller registration, admin dashboards, checkout changes, buyer-facing changes, or public seller-data pages.

## Engineering Rules

- Use Next.js 16 App Router and TypeScript strict mode.
- Prefer Server Components by default.
- Use existing project patterns, components, styling, and routes where possible.
- Keep code simple; this is a POC.
- Use BetterAuth for protected seller pages.
- Use Drizzle ORM only if existing project patterns require data access.
- Add Vitest tests only where behavior is risky or easy to regress.

## Boundaries

Ask before:

- adding dependencies
- changing database schema or migrations
- running `pnpm dev`, `pnpm build`, or `pnpm test`
- modifying global styles, the design system, checkout, cart, public shop pages, or product pages

Never expose seller-specific sales, returns, support, or assortment data on public pages.

## Verification

The prototype should support this test flow:

seller dashboard -> problematic SKU/alert -> SKU detail -> recommended actions

A tester should understand within a few minutes which SKU needs attention, why, and what action they could take.
