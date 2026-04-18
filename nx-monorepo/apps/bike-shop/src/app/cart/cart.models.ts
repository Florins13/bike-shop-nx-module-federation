import { Bike } from "../product/bike";

export interface CartItem {
  id: number;
  bike: Bike;
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  cartTotal: number;
  cartIsEmpty: boolean;
}