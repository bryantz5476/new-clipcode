import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

export const shopifyClient = domain && storefrontAccessToken 
  ? Client.buildClient({
      domain,
      storefrontAccessToken,
      apiVersion: '2024-01'
    })
  : null;

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: Array<{
    id: string;
    src: string;
    altText: string | null;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
  }>;
}

export interface CartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      images: Array<{
        src: string;
      }>;
    };
  };
}

export interface ShopifyCart {
  id: string;
  webUrl: string;
  lineItems: CartItem[];
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
}

export async function fetchProducts(): Promise<ShopifyProduct[]> {
  if (!shopifyClient) {
    return [];
  }
  
  try {
    const products = await shopifyClient.product.fetchAll();
    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      images: product.images.map((img: any) => ({
        id: img.id,
        src: img.src,
        altText: img.altText
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode
        },
        available: variant.available
      }))
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createCart(): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    return null;
  }
  
  try {
    const checkout = await shopifyClient.checkout.create();
    return {
      id: checkout.id as string,
      webUrl: checkout.webUrl,
      lineItems: [],
      subtotalPrice: {
        amount: checkout.subtotalPrice?.amount || '0',
        currencyCode: checkout.subtotalPrice?.currencyCode || 'EUR'
      }
    };
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

export async function addToCart(
  checkoutId: string, 
  variantId: string, 
  quantity: number = 1
): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    return null;
  }
  
  try {
    const lineItemsToAdd = [{ variantId, quantity }];
    const checkout = await shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd);
    
    return {
      id: checkout.id as string,
      webUrl: checkout.webUrl,
      lineItems: checkout.lineItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        variant: {
          id: item.variant.id,
          title: item.variant.title,
          price: {
            amount: item.variant.price.amount,
            currencyCode: item.variant.price.currencyCode
          },
          product: {
            title: item.variant.product.title,
            images: item.variant.product.images.map((img: any) => ({ src: img.src }))
          }
        }
      })),
      subtotalPrice: {
        amount: checkout.subtotalPrice?.amount || '0',
        currencyCode: checkout.subtotalPrice?.currencyCode || 'EUR'
      }
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

export async function removeFromCart(
  checkoutId: string, 
  lineItemIds: string[]
): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    return null;
  }
  
  try {
    const checkout = await shopifyClient.checkout.removeLineItems(checkoutId, lineItemIds);
    
    return {
      id: checkout.id as string,
      webUrl: checkout.webUrl,
      lineItems: checkout.lineItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        variant: {
          id: item.variant.id,
          title: item.variant.title,
          price: {
            amount: item.variant.price.amount,
            currencyCode: item.variant.price.currencyCode
          },
          product: {
            title: item.variant.product.title,
            images: item.variant.product.images.map((img: any) => ({ src: img.src }))
          }
        }
      })),
      subtotalPrice: {
        amount: checkout.subtotalPrice?.amount || '0',
        currencyCode: checkout.subtotalPrice?.currencyCode || 'EUR'
      }
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

export function redirectToCheckout(webUrl: string): void {
  window.location.href = webUrl;
}
