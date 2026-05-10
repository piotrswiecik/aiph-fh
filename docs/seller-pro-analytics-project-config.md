# FH Seller Pro Analytics - Project Config

**PROJECT:** FashionHero Seller Pro Analytics
**ROLE:** Build an internal POC of a new seller-facing feature inside the FashionHero e-commerce app.

## Application Goal

Build a dedicated seller dashboard embedded in FashionHero. The dashboard is available only to authenticated sellers and shows SKU-level product line signals for the products each seller offers in the shop. It evaluates product economics (sales, returns), post-sale quality (support tickets, buyer ratings), and pre-sale exposure quality (copy, photos, available variants, and size coverage).

## Design Guidance

The prototype must follow the current visual conventions of the existing FashionHero shop at https://fashionhero.aiproductheroes.pl/. Keep the seller dashboard visually consistent with the current product. Detailed design rules are stored in `DESIGN.md`, built according to Google's design.md format: https://github.com/google-labs-code/design.md

## Boundaries

ALWAYS:
- Match layouts and pages to `DESIGN.md` to preserve visual consistency
- Use Server Components by default
- Show loading states with suspense skeletons
- Keep code simple; this is a prototype / POC
- Require authentication for every seller dashboard page

ASK FIRST:
- Before creating any public page without seller auth
- Before adding a dependency to `package.json`
- Before running `pnpm build`, `pnpm dev`, or `pnpm test`
- Before touching database structure or migrations

NEVER:
- Never show seller-specific data such as sales, returns, or assortment on public pages
- Never change the global design system, public shop, checkout, cart, product pages, or existing component structure except where required to embed the seller dashboard

## Code Style

- Next.js 16 App Router, TypeScript 6 strict mode
- Vitest for unit tests
- Standard ESLint and Prettier rules
- Drizzle ORM
- BetterAuth with email+password provider, middleware, and auth checks on every protected page

## Data Model

Seller account with login. SKU/product assigned to a seller.
