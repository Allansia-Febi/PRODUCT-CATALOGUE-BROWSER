# Product Catalogue Browser

A production-quality, single-page **Product Catalogue Browser** built with **React**, **React Router**, and styled using plain CSS with modern design tokens. This project connects directly to the public **DummyJSON Products API** (`https://dummyjson.com/products`) and operates entirely client-side without a backend.

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

### Production Build
To create an optimized production build:
```bash
npm run build
```

---

## 📡 Data Fetching & API Strategy

- **Data Source**: Uses the **DummyJSON public API** (`https://dummyjson.com/products`). No backend or database is required.
- **Endpoints Used**:
  - `GET https://dummyjson.com/products?limit=200` — Fetches the product dataset.
  - `GET https://dummyjson.com/products/categories` — Fetches category list metadata.
  - `GET https://dummyjson.com/products/:id` — Fetches single product details for product route `/products/:id`.
- **Combined Filtering Architecture**: Since DummyJSON server search and category endpoints operate independently, our API service layer retrieves the full catalog and applies deterministic multi-condition filtering (`Search AND Category AND MinPrice AND MaxPrice AND InStock`) on the client side, along with client-side sorting and pagination. This ensures all active filter criteria always combine correctly without logical conflicts.

---

## 🛡️ Stale Response Protection & Race Condition Handling

When users type rapidly in the search input or toggle filters quickly, multiple asynchronous HTTP requests can be initiated in short succession. To ensure an older, slower request **never overwrites** newer search results:

1. **`AbortController` Cancellation**: Every API request in `src/services/productsApi.js` accepts an `AbortSignal`. When search or filter parameters update, previous pending requests are automatically cancelled via `controller.abort()`. Aborted requests are caught cleanly so they do not trigger application error states.
2. **Request Sequence Guards**: We maintain an incrementing `requestSequenceId` counter in the API layer. Upon completion, response payloads carry their `sequenceId`. Components compare `data.sequenceId >= latestSequenceIdRef.current` before updating state, effectively ignoring any out-of-order stale responses.

---

## 📄 Pagination Decision

We explicitly chose **Pagination** over Infinite Scroll for several technical and user experience reasons:
- **Direct URL Synchronization**: Current page numbers (e.g. `?page=3`) can be encoded directly into the URL query string.
- **Bookmarkability & Shareability**: Users can bookmark or share a link to a specific catalogue page and see the exact same view.
- **Predictable Browser Back Navigation**: Returning to the catalogue returns the user to the precise page they were browsing.
- **Accessibility & Footer Access**: Pagination gives users predictable control over list boundaries without displacing page footer elements.

---

## 🔗 URL Query State Management (`useQueryParams`)

All user interaction states (Search keyword, Category, Min Price, Max Price, In-stock toggle, Sorting choice, and Page number) are synchronized bidirectionally with the URL query parameters using the custom `useQueryParams` hook.

- **Synchronization**: Updating a filter updates the URL (e.g., `/products?search=laptop&category=laptops&minPrice=500&inStock=true&sort=price-desc&page=1`).
- **State Restoration**: Refreshing or opening a shared URL immediately restores the exact filter and search state.
- **History Clutter Prevention**: Rapid search input and filter changes use `{ replace: true }` navigation to avoid creating unwanted browser history entries for every single keystroke.

---

## 📜 Scroll Position Restoration (`useScrollRestoration`)

When a user scrolls down the product list and clicks a product card (e.g. at position 1200px), they navigate to `/products/:id`. When pressing the browser Back button or clicking "Back to Catalogue":

1. The scroll position is recorded before navigation or saved continuously to `sessionStorage` via `useScrollRestoration`.
2. Upon returning to `/products`, the hook waits until product data loading completes (`!isLoading`) and uses `requestAnimationFrame` to execute `window.scrollTo({ top: savedY })`.
3. The catalog retains its exact scroll position, page number, and active filters without resetting to top or jumping.

---

## ⚡ Performance & Rendering Optimization

- **`React.memo`**: Applied to `ProductCard` to avoid re-rendering individual cards when parent list re-renders.
- **`useMemo`**: Used in `ProductListPage` for calculating derived filtered, sorted, and paginated product arrays, preventing expensive array operations on unrelated renders.
- **`useCallback`**: Memoizes search and filter handler callbacks passed to child components (`Header`, `Filters`, `FilterChips`).
- **Debounced Search**: The `useDebounce` hook prevents search filtering computations on every keystroke, introducing a smooth 400ms delay.

---

## ♿ Keyboard Accessibility Features

- **Semantic HTML**: Built using standard `<header>`, `<main>`, `<article>`, `<button>`, `<nav>`, and `<label>` elements.
- **Full Tab Ring Navigation**: Every interactive control (search, select dropdowns, numeric inputs, checkboxes, filter chips, pagination, product cards, thumbnails) is reachable via `Tab`.
- **Visible Focus States**: Custom high-contrast outline focus ring (`outline: 2px solid #38bdf8; outline-offset: 2px;`) ensures clear focus visibility across dark theme controls.
- **Enter Key to Open**: Focused product cards support pressing `Enter` to navigate directly to `/products/:id`.
- **Escape Key to Close/Return**: Pressing `Escape` anywhere on the product detail page returns to the catalogue.
- **Image Alt Texts**: All thumbnails and hero images include descriptive `alt` text.

---

## 💡 What I Would Improve With More Time

1. **Persistent API Caching**: Implement a lightweight in-memory cache (or React Query/SWR) to eliminate redundant network fetches when navigating back and forth.
2. **Automated Testing**: Add unit tests using React Testing Library and end-to-end e2e tests using Playwright for search, filter combination, URL state, and keyboard flows.
3. **List Virtualization**: Integrate `@tanstack/react-virtual` if catalogue scaling exceeded thousands of products.
4. **Enhanced Image Optimization**: Serve modern webp responsive srcset images with blur placeholders.
