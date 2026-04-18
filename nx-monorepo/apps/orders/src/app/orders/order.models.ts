
interface Bike {
  id: number;
  model: string;
  imageSource: string;
  stock: number;
  details: string;
  electric: boolean;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  telephone: string;
  zipCode: string;
}

export interface OrderItem {
  id: number;
  bike: Bike;
  quantity: number;
}

export interface Order {
  transaction: string;
  orderState: string;
  acquireType: 'buy' | 'rent';
  shippingItems: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  username: string;
}

export interface OrderRequest {
  shippingAddress: ShippingAddress;
  acquireType: 'buy' | 'rent';
}
