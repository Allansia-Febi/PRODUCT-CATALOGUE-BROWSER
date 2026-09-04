# Product Catalogue Browser

A production-quality, single-page **Product Catalogue Browser** built with **React**, **React Router**, custom hooks, and styled using plain CSS with modern design tokens. This project connects directly to the public **DummyJSON Products API** (`https://dummyjson.com/products`) and operates entirely client-side without a backend.

> 📄 **AI Prompt Engineering Journey**: See [PROMPTS.md](file:///C:/Users/strka/.gemini/antigravity/scratch/product-catalogue-browser/PROMPTS.md) for a complete, transparent log of prompts, technical overrides, bug fixes, and prompt iterations used to build this application.

---

## 📑 Table of Contents
1. [Setup & Execution](#-setup--execution)
2. [Data Fetching & API Strategy](#-data-fetching--api-strategy)
3. [Stale Response Protection & Race Conditions](#-stale-response-protection--race-conditions)
4. [Pagination Decision](#-pagination-decision)
5. [URL Query State Management](#-url-query-state-management-usequeryparams)
6. [Scroll Position Restoration](#-scroll-position-restoration-usescrollrestoration)
7. [Performance & Rendering Optimization](#-performance--rendering-optimization)
8. [Keyboard Accessibility](#-keyboard-accessibility)
9. [Git Commit History](#-git-commit-history)
10. [What I Would Improve With More Time](#-what-i-would-improve-with-more-time)

---

## 🚀 Setup & Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 tested)
- **npm**: v9.0.0 or higher

### Installation & Local Development
1. Clone or navigate to the project directory:
   ```bash
   cd product-catalogue-browser
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

### Production Build Verification
To create and verify an optimized production bundle:
```bash
npm run build
```

---

## 📡 Data Fetching & API Strategy

- **Data Source**: Uses the **DummyJSON public API** (`https://dummyjson.com/products`). No backend or database exists.
- **Endpoints Used**:
  - `GET https://dummyjson.com/products?limit=200` — Retrieves product catalog dataset.
  - `GET https://dummyjson.com/products/categories` — Retrieves category metadata.
  - `GET https://dummyjson.com/products/:id` — Retrieves single product details for `/products/:id`.
- **Combined Filtering Architecture**: DummyJSON server endpoints (`/search` vs `/category`) operate independently. Our API service layer fetches the catalog and executes deterministic multi-condition filtering (`Search AND Category AND MinPrice AND MaxPrice AND InStock`) on the client side, along with client-side sorting and pagination. This guarantees all active filter criteria combine accurately without logical conflicts.

---

## 🛡️ Stale Response Protection & Race Conditions

When users type rapidly in the search bar or toggle filters quickly, multiple asynchronous requests can be initiated in short succession. To ensure an older, slower request **never overwrites** newer search results:

1. **`AbortController` Cancellation**: Every API request in [productsApi.js](file:///C:/Users/strka/.gemini/antigravity/scratch/product-catalogue-browser/src/services/productsApi.js) accepts an `AbortSignal`. When search or filter parameters update, previous pending requests are automatically cancelled via `controller.abort()`. Aborted requests are caught cleanly so they do not trigger application error states.
2. **Request Sequence Guards**: We maintain an internal `requestSequenceId` counter in the API layer. Responses return their `sequenceId`. Components compare `data.sequenceId >= latestSequenceIdRef.current` before updating state, effectively ignoring any out-of-order stale responses.

---

## 📄 Pagination Decision

We explicitly chose **Pagination** over Infinite Scroll for several technical and user experience reasons:
- **Direct URL Synchronization**: Current page numbers (e.g. `?page=3`) are represented directly in the URL query string.
- **Bookmarkability & Shareability**: Users can bookmark or share a link to a specific catalogue page and see the exact same view.
- **Predictable Navigation**: Returning to the catalogue returns the user to the precise page they were browsing.
- **Accessibility & Footer Access**: Pagination gives users predictable control over list boundaries without displacing page layout elements.

---

## 🔗 URL Query State Management (`useQueryParams`)

All user interaction states (Search keyword, Category, Min Price, Max Price, In-stock toggle, Sorting choice, and Page number) are synchronized bidirectionally with the URL query parameters using the custom [useQueryParams.js](file:///C:/Users/strka/.gemini/antigravity/scratch/product-catalogue-browser/src/hooks/useQueryParams.js) hook.

- **Synchronization**: Changing a filter updates the URL (e.g., `/products?search=phone&category=smartphones&minPrice=100&inStock=true&sort=price-desc&page=1`).
- **State Restoration**: Refreshing or opening a shared URL immediately restores the exact filter and search state.
- **History Stack Optimization**: Rapid search input and filter changes use `{ replace: true }` navigation to avoid creating unwanted browser history entries for every single keystroke.

---

## 📜 Scroll Position Restoration (`useScrollRestoration`)

When a user scrolls down the product list and clicks a product card (e.g. at position 1200px), they navigate to `/products/:id`. When pressing the browser Back button or clicking "Back to Catalogue":

1. The scroll position is recorded before navigation or saved continuously to `sessionStorage` via [useScrollRestoration.js](file:///C:/Users/strka/.gemini/antigravity/scratch/product-catalogue-browser/src/hooks/useScrollRestoration.js).
2. Upon returning to `/products`, the hook waits until product data loading completes (`!isLoading`) and uses `requestAnimationFrame` to execute `window.scrollTo({ top: savedY })`.
3. The catalog retains its exact scroll position, page number, and active filters without resetting to top or jumping.

---

## ⚡ Performance & Rendering Optimization

- **`React.memo`**: Applied to `ProductCard` to eliminate unnecessary re-renders during search input typing.
- **`useMemo`**: Used in `ProductListPage` for calculating derived filtered, sorted, and paginated product arrays.
- **`useCallback`**: Memoizes event handlers passed to child components (`Header`, `Filters`, `FilterChips`, `CategoryPills`).
- **Debounced Search**: The [useDebounce.js](file:///C:/Users/strka/.gemini/antigravity/scratch/product-catalogue-browser/src/hooks/useDebounce.js) hook delays search filtering computations by 400ms to maintain 60fps UI responsiveness.

---

## ♿ Keyboard Accessibility

- **Semantic Elements**: Built using standard `<header>`, `<main>`, `<article>`, `<button>`, `<nav>`, and `<label>` elements.
- **Full Tab Ring Navigation**: Every interactive control (search, category pills, select dropdowns, price inputs, checkboxes, filter chips, pagination, product cards, gallery thumbnails) is reachable via `Tab`.
- **Visible Focus Rings**: Custom high-contrast outline focus ring (`outline: 2px solid #6366f1`) ensures focus visibility across dark theme controls.
- **Enter Key to Open**: Focused product cards support pressing `Enter` to navigate directly to `/products/:id`.
- **Escape Key to Close/Return**: Pressing `Escape` anywhere on the product detail page returns to the catalogue.
- **Image Alt Texts**: All thumbnails and hero images include descriptive `alt` text.

---

## 📦 Git Commit History

The repository has been constructed step-by-step across **11 meaningful commits**:

| Commit Hash | Commit Message |
| :--- | :--- |
| `7563a2d` | **Step 10**: Enhance UI with horizontal CategoryPills icon bar, dollar savings badges, visual stock level meters, and product item counter |
| `af6f1ac` | **Step 9**: Major UI Upgrade with Plus Jakarta Sans typography, ambient mesh gradients, hero section, customer reviews, and glowing glassmorphic panels |
| `bc00d6c` | **Step 8**: Finalize accessibility audit, README documentation, and CSS syntax fix |
| `54f85da` | **Step 7**: Add ProductDetailPage, ImageGallery, and React Router configuration |
| `7a17c6e` | **Step 6**: Build ProductListPage with combined multi-filtering, URL params sync, and pagination |
| `e2e4741` | **Step 5**: Add ProductCard, ProductGrid, ProductSkeleton, EmptyState, ErrorState, Pagination components |
| `bbdaa7e` | **Step 4**: Implement Header, SearchBar, Filters, FilterChips components and design tokens |
| `9dfbad5` | **Step 3**: Implement custom hooks (useDebounce, useQueryParams, useScrollRestoration) |
| `f9c59ba` | **Step 2**: Add API service layer with AbortController signal support and stale request sequence guards |
| `80b1b59` | **Step 1**: Initialize Vite React project with React Router and Lucide icons |

---

## 💡 What I Would Improve With More Time

1. **Persistent API Caching**: Implement an in-memory cache or React Query/SWR to avoid re-fetching the product list when navigating between routes.
2. **Automated Testing**: Add unit tests using React Testing Library and end-to-end e2e tests using Playwright for search, filter combination, URL state, and keyboard flows.
3. **List Virtualization**: Integrate `@tanstack/react-virtual` if catalogue scaling exceeded thousands of products.
4. **Enhanced Image Optimization**: Serve modern webp responsive srcset images with blur placeholders.
