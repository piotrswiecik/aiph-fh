# Feature: Seller Pro Analytics

**OPPORTUNITY:** Seller nie wie, które SKU generują nieproporcjonalne zwroty, support tickety lub mają problemy z ekspozycją.

**OUTCOME:** Podnieść średni net margin contribution w segmencie negocjowanym z 3,4% do 6,2%.

## Co Budujemy

Dashboard dla zalogowanego sellera FashionHero. Po loginie email+hasło seller widzi tylko swoje SKU, domyślnie posortowane od najbardziej problematycznych. Dashboard pokazuje sprzedaż, zwroty, tickety, oceny i kompletność ekspozycji; pozwala zmienić sortowanie oraz wejść w podstronę SKU z trendami sprzedaży, zwrotów i ticketów w czasie.

## Kryteria Akceptacji

- Dashboard i podstrony SKU są dostępne tylko po auth
- Seller widzi wyłącznie swoje SKU; dane sellerów nie przeciekają między kontami
- Lista SKU pokazuje: sprzedaż, zwroty, tickety, ocenę i kompletność ekspozycji
- Działają: sortowanie po ryzyku/zwrotach/ticketach/ekspozycji, wejście w szczegóły SKU, loading skeletony
- Layout działa na desktop i mobile bez błędów wyświetlania

## Non-goals

Nie budujemy tworzenia SKU, edycji SKU ani rejestracji nowych sellerów.

## Przykłady

- `FH-SHOE-001`: sprzedaż 124, zwroty 25, tickety 7, ocena 4.2, ekspozycja 72% -> `Needs attention`
- `FH-PANTS-001`: 100, 1, 2, 4.9, 90% -> `Super`
- `FH-HAT-001`: 98, 2, 16, 3.7, 91% -> `Needs attention`
