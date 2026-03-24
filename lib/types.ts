export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  pieces?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observation?: string;
}

export interface PixPayment {
  transactionId: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPasteCode: string;
  amount: number;
  expiresAt: string;
  status: "pending" | "paid" | "expired" | "cancelled";
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  deliveryType: "delivery" | "pickup";
}
