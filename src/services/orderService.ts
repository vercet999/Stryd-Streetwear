export interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface LineItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

export interface OrderResult {
  success: boolean;
  orderId: number;
  orderNumber: string;
  status: string;
  paystackRef: string;
}

export async function createWooCommerceOrder(
  billing: BillingInfo,
  lineItems: LineItem[],
  paystackRef: string,
  paystackAmount: number
): Promise<OrderResult> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ billing, lineItems, paystackRef, paystackAmount }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
}
