import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartState } from "../types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
          };
          set({
            items: [...items, newItem],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      increaseQuantity: (productId) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (productId) => {
        const { items } = get();
        const target = items.find((item) => item.productId === productId);
        if (!target) return;

        if (target.quantity <= 1) {
          // Agar quantity 1 ga tenglashib, yana kamaytirilsa, elementni butunlay o'chirish
          set({
            items: items.filter((item) => item.productId !== productId),
          });
        } else {
          set({
            items: items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
