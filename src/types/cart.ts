export interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; title: string; price: number }) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}
