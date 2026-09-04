/**
 * API Service Layer for DummyJSON Products
 * Supports AbortController signals and sequence checking for stale response protection.
 */

const BASE_URL = 'https://dummyjson.com/products';

let requestSequenceId = 0;

/**
 * Fetch all categories from DummyJSON.
 * Returns array of category objects { slug, name, url }
 */
export async function fetchCategories(signal) {
  try {
    const response = await fetch(`${BASE_URL}/categories`, { signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch categories (${response.status})`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch products from API.
 * DummyJSON provides up to 194 total products. We fetch full dataset (or limit=200)
 * to perform combined multi-condition filtering (Search AND Category AND Price AND Stock)
 * client-side cleanly and deterministically.
 */
export async function fetchAllProducts(signal) {
  const sequenceId = ++requestSequenceId;
  try {
    const response = await fetch(`${BASE_URL}?limit=200`, { signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch products (${response.status})`);
    }
    const data = await response.json();
    return {
      products: data.products || [],
      total: data.total || 0,
      sequenceId,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProductById(id, signal) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { signal });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID "${id}" was not found.`);
      }
      throw new Error(`Failed to load product details (${response.status})`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Helper sequence tracker getter to check if a response is stale.
 */
export function getCurrentSequenceId() {
  return requestSequenceId;
}
