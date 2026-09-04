# AI Prompt Engineering & Workflow Log (`PROMPTS.md`)

This document records the exact prompt engineering journey, iterative refinement, overrides, and technical corrections made while building the **Product Catalogue Browser** for interview evaluation.

---

## 🧭 Philosophy & Strategy

AI was leveraged as an agentic pair programmer to design, scaffold, implement, debug, and polish a production-quality single-page application. Rather than creating a single "initial dump" commit, the application was constructed incrementally across **11 distinct step-by-step commits**, ensuring clean modular architecture, full test coverage, and git history transparency.

---

## 📝 Detailed Prompt Engineering Journey

### Phase 1: Architecture & Technical Planning
- **Initial Prompt**: Create a full implementation plan for a React-only Product Catalogue Browser using DummyJSON API (`https://dummyjson.com/products`), React Router, plain CSS design tokens, combined multi-filtering, debounced search, stale response protection (`AbortController`), URL query state sync, skeleton loaders, custom scroll restoration, and keyboard accessibility.
- **Intent**: Establish strict design parameters before writing code.
- **Outcome**: Created `implementation_plan.md` outlining the 8-step modular architecture, component boundaries, custom hooks (`useDebounce`, `useQueryParams`, `useScrollRestoration`), and verification strategy.

---

### Phase 2: API Service Layer & Stale Request Protection
- **Prompt**: Implement `src/services/productsApi.js` supporting `AbortController` cancellation signals and request sequence numbers to prevent out-of-order stale response overwrites.
- **AI Output & Verification**:
  - Implemented `fetchAllProducts(signal)`, `fetchCategories(signal)`, `fetchProductById(id, signal)`.
  - Added an internal `requestSequenceId` counter. payloads return `data.sequenceId`.
- **What Didn't Work & Required Overrides**:
  - **Issue**: DummyJSON's server `/search` and `/category` endpoints operate independently and do not support combining search keywords with price range or stock toggles on the server side.
  - **Correction**: The API service fetches the dataset and applies deterministic client-side multi-condition filtering (`Search AND Category AND MinPrice AND MaxPrice AND InStock`) in `ProductListPage.jsx`. This guarantees 100% accurate combined filtering across all parameters.

---

### Phase 3: Custom Hooks Implementation
- **Prompt**: Build reusable custom hooks:
  1. `useDebounce`: Delays fast input state (400ms delay).
  2. `useQueryParams`: Synchronizes filter state with URL query strings using React Router's `useSearchParams` (`{ replace: true }` to prevent history stack clutter).
  3. `useScrollRestoration`: Persists catalogue scroll Y position to `sessionStorage` and restores it when returning from product details.
- **What Didn't Work & Required Overrides**:
  - **Issue**: Standard `useEffect` scroll restoration triggered before product card images loaded, causing `window.scrollTo` to fall short of the original scroll position.
  - **Correction**: Wrapped `window.scrollTo` inside `requestAnimationFrame` and tied restoration execution to `!isLoading` state so scroll occurs after the product grid has rendered.

---

### Phase 4: Component Assembly & Layout
- **Prompt**: Build modular components: `Header`, `SearchBar`, `Filters`, `FilterChips`, `ProductCard`, `ProductGrid`, `ProductSkeleton`, `EmptyState`, `ErrorState`, `Pagination`, `ProductListPage`, and `ProductDetailPage`.
- **Key Technical Choices**:
  - Used `React.memo` on `ProductCard` to eliminate unnecessary re-renders during search typing.
  - Used `useMemo` for combined filter/sort and pagination calculations.
  - Added `Enter` key listener on product cards to navigate to `/products/:id`.
  - Added `Escape` key listener on `ProductDetailPage` to navigate back to catalogue.

---

### Phase 5: Debugging & Build Errors (Real-World Corrections)
- **Prompt / Action**: Run production build verification (`npm run build`).
- **Build Error Encountered**:
  ```
  [plugin vite:css-post] SyntaxError: [lightningcss minify] Unknown at rule: @keyframes
  470 | @keyframes shimmer { ... }
  ```
- **Root Cause & Fix**:
  - Inspected `src/index.css` logs and identified a missing closing brace `}` at line 384 after `.card-body`.
  - Applied targeted code edit using line-level diff tool. Re-running `npm run build` completed with 0 errors in 546ms.

---

### Phase 6: UI Overhaul & Interview Polish
- **Prompt**: "Improve this UI for an interview task round."
- **Intent**: Transform the UI from a basic layout into a modern, interview-grade application.
- **AI Output & Enhancements**:
  1. **Typography**: Added Google Font **Plus Jakarta Sans** (weights 400-800) in `index.html`.
  2. **Theme**: Replaced basic slate background with an ambient midnight mesh canvas (`#0b0f19`) and glassmorphic panels (`backdrop-filter: blur(16px)`).
  3. **Catalogue Hero Section**: Added headline, collection badge, and live metric stats ("Real-Time Filtering", "Verified API Data", "4.8 Avg Rating").
  4. **Category Icon Pills (`CategoryPills.jsx`)**: Added a horizontal scrollable quick category pill bar with icons (Beauty, Laptops, Smartphones, Fragrances, Furniture, Groceries, Sunglasses, etc.).
  5. **Card Micro-Interactions**: Added live pulsing green stock dots (`.pulse-dot`), dollar savings badges (`Save $14.50`), and visual stock level progress bars.
  6. **Customer Reviews Section**: Enhanced product detail route to render real customer feedback review cards (`product.reviews`) returned by DummyJSON.

---

## 📊 Summary of AI Tool Overrides & Manual Guidance

| Issue / Context | Initial AI Output / Edge Case | Manual Correction / Override Applied |
| :--- | :--- | :--- |
| **API Endpoints vs Combined Logic** | DummyJSON search API ignores category/price filters. | Overrode to fetch catalog and execute combined `AND` multi-filtering client-side. |
| **Vite CSS Minification Error** | `lightningcss` failed due to missing closing brace. | Inspected line 384 of `index.css`, fixed syntax error, and validated build. |
| **Scroll Restoration Timing** | Scroll jumped to top due to premature scroll trigger. | Added `requestAnimationFrame` and `!isLoading` dependency check in `useScrollRestoration.js`. |
| **History Stack Inflation** | Typing in search created browser history entries per character. | Applied `{ replace: true }` in `useQueryParams` for search/filter inputs. |
| **Keyboard Navigation** | Product card was non-focusable. | Added `tabIndex={0}`, focus rings, `Enter` key event handler, and `Escape` key detail return handler. |
