// B10 FIX: Removed the "use client" directive. Zustand stores do not need
// this directive; they are automatically included in client bundles when
// imported from client components. The directive was causing Next.js to
// treat this entire module tree as client-only unnecessarily.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  nameAr?: string | null;
  imageUrl?: string | null;
  price: number;
  stockQty: number;
  artisanName: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + 1, i.stockQty),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(quantity, i.stockQty) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "redoasis-cart",
    }
  )
);
