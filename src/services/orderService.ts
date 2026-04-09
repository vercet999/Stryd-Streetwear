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
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billing, lineItems, paystackRef, paystackAmount }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create order';
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error occurred while creating order');
  }
}
