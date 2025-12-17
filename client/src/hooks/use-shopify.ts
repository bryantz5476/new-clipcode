import { useState, useEffect } from 'react';
import {
  ShopifyProduct,
  fetchProducts,
  shopifyClient
} from '@/lib/shopify';

export function useShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!shopifyClient) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { products, loading, error, isConnected: !!shopifyClient };
}


